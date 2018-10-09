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

import './Login.css';

class Login extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            email: '',
            password: '',
            status: 'initial',
            showPassword: false
        };

        this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
		this.handleMouseDownPassword = this.handleMouseDownPassword.bind(this);
        this.handleClickShowPassword = this.handleClickShowPassword.bind(this);
    }

    handleChange(event) {
        this.setState({
            [event.target.id]: event.target.value
        });
    }

    handleMouseDownPassword(event) {
        event.preventDefault();
    };

    handleClickShowPassword() {
        this.setState(state => ({
            showPassword: !state.showPassword
        }));
    };

    handleSubmit(event) {
        event.preventDefault();
        const qArgs = qs.parse(this.props.location.search);
        const that = this;
        this.setState({status: 'submitting'});
        let tokenData = {};
        this.hidAPI = new HidAPI();
        this.hidAPI.getJWT(this.state.email, this.state.password).then(data => {
            if (!data.user || !data.token) {
                throw "Unknown exception";
            } else {
                tokenData = data;
                that.hrinfoAPI = new HRInfoAPI(data.token);
                return that.hrinfoAPI.getProfile();
            }
        }).then(data => {
            tokenData.user.hrinfo = {
                roles: data.roles,
                spaces: data.spaces
            };
            this.props.userHasAuthenticated(true, tokenData.user, tokenData.token);
            if (qArgs.redirect || qArgs['?redirect']) {
              const redirect = qArgs.redirect ? qArgs.redirect : qArgs['?redirect'];
              this.props.history.push(redirect);
            }
            else {
              this.props.history.push('/home');
            }
        }).catch(err => {
            this.setState({status: 'initial'});
            this.props.setAlert('danger', 'Could not log you in. Please check your email and password.');
        });
    }

    render() {
      const { t } = this.props;
        return (
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
		);
    }
}

export default translate('common')(Login);
