import React from 'react';
import HRInfoAPI from './HRInfoAPI';
import HidAPI from './HidAPI';

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
            this.props.history.push('/home');
        }).catch(err => {
            this.setState({status: 'initial'});
            this.props.setAlert('danger', 'Could not log you in. Please check your email and password.');
        });
    }

    render() {
        return (
			<form className="login-container" onSubmit={this.handleSubmit}>
				<FormControl required fullWidth margin="normal">
					<InputLabel htmlFor="email">Email</InputLabel>
					<Input id="email" value={this.state.email} onChange={this.handleChange}/>
					<FormHelperText id="email-text">Your Humanitarian ID email</FormHelperText>
				</FormControl>
				<FormControl required fullWidth margin="normal">
					<InputLabel htmlFor="password">Password</InputLabel>
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
					<FormHelperText id="password-text">Your Humanitarian ID password</FormHelperText>
				</FormControl>
				{ this.state.status === 'initial' &&
					<Button variant="contained"
						color="primary"
						onClick={this.handleSubmit}
						type="submit"
						disabled={this.state.email == '' || this.state.password == ''}>
						Login
					</Button>
				}
				{ this.state.status === 'submitting' &&
					<CircularProgress/>
				}
			</form>
		);
    }
}

export default Login;
