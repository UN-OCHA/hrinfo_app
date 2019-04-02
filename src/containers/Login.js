import React from 'react';
import HRInfoAPI from '../api/HRInfoAPI';
import HidAPI from '../api/HidAPI';
import { translate } from 'react-i18next';
import qs from 'qs';

import IconButton from '@material-ui/core/IconButton';
import InputLabel from '@material-ui/core/InputLabel';
import InputAdornment from '@material-ui/core/InputAdornment';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Input from '@material-ui/core/Input';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import SnackbarContent from '@material-ui/core/SnackbarContent';

import './Login.css';

class Login extends React.Component {

  state = {
    email: '',
    password: '',
    status: 'initial',
    showPassword: false
  };

  handleChange = (event) => {
    this.setState({
      [event.target.id]: event.target.value
    });
  }

  handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  handleClickShowPassword = () => {
    this.setState(state => ({
      showPassword: !state.showPassword
    }));
  };

  handleSubmit = async (event) => {
    event.preventDefault();
    const qArgs = qs.parse(this.props.location.search);
    this.setState({status: 'submitting'});
    this.hidAPI = new HidAPI();
    try {
      const token = await this.hidAPI.getJWT(this.state.email, this.state.password);
      if (!token.user || !token.token) {
          throw new Error("Unknown exception");
      }
      this.hrinfoAPI = new HRInfoAPI(token.token);
      const hrinfoUser = await this.hrinfoAPI.getProfile();
      token.user.hrinfo = {
        roles: hrinfoUser.roles,
        spaces: hrinfoUser.spaces
      };
      this.props.userHasAuthenticated(true, token.user, token.token);
      if (qArgs.redirect || qArgs['?redirect']) {
        const redirect = qArgs.redirect ? qArgs.redirect : qArgs['?redirect'];
        this.props.history.push(redirect);
      }
      else {
        this.props.history.push('/');
      }
    }
    catch (err) {
      this.setState({status: 'initial'});
      this.props.setAlert('danger', 'Could not log you in. Please check your email and password.');
    }
  }

  render() {
    const { t } = this.props;
    const message = (<p>Dear managers and editors, welcome to the new HR.info environment ! <br />
      Here you find the new content forms developed to improve HR.info performance.
      After a transition period, these forms will replace the old ones. Your content will be published within your space on the live HR.info. <br />
      If you have any feedback or suggestions for improvements, send us an email to <a href="mailto:info@humanitarianresponse.info" style={{color: 'white'}}>info@humanitarianresponse.info</a></p>);
    return (
      <React.Fragment>
        <SnackbarContent
          aria-describedby="client-snackbar"
          message={message} />
    		<form className="login-container" onSubmit={this.handleSubmit}>
    			<FormControl required fullWidth margin="normal">
    				<InputLabel htmlFor="email">{t('login.email')}</InputLabel>
    				<Input id="email" value={this.state.email} onChange={this.handleChange}/>
    				<FormHelperText id="email-text">{t('login.email_helper')}</FormHelperText>
    			</FormControl>
    			<FormControl required fullWidth margin="normal">
    				<InputLabel htmlFor="password">{t('login.password')}</InputLabel>
    				<Input id="password"
    					type={this.state.showPassword ? 'text' : 'password'}
    					value={this.state.password}
    					onChange={this.handleChange}
    					endAdornment={
    						<InputAdornment position = "end" >
    							<IconButton aria-label="Toggle password visibility"
    								onClick={this.handleClickShowPassword}
    								onMouseDown={this.handleMouseDownPassword}>
    								{ this.state.showPassword ? <i className="icon-eye-hidden" /> : <i className="icon-eye" /> }
    							</IconButton>
    						</InputAdornment> }/>
    				<FormHelperText id="password-text">{t('login.password_helper')}</FormHelperText>
    			</FormControl>
    			{ this.state.status === 'initial' &&
    				<Button type="submit"
              variant="contained"
    					color="primary"
    					disabled={this.state.email === '' || this.state.password === ''}
    					>{t('login.button')}</Button>
    			}
    			{ this.state.status === 'submitting' &&
    				<CircularProgress/>
    			}
    		</form>
      </React.Fragment>
	  );
  }
}

export default translate('common')(Login);
