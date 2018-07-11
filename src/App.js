import React, {Component} from 'react';
import {instanceOf} from 'prop-types';
import {withCookies, Cookies} from 'react-cookie';
import {withRouter, NavLink} from "react-router-dom";
// Material Components
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import Divider from '@material-ui/core/Divider';
import Paper from '@material-ui/core/Paper';
import Input from '@material-ui/core/Input';
import InputAdornment from '@material-ui/core/InputAdornment';
import Button from '@material-ui/core/Button';
import Snackbar from '@material-ui/core/Snackbar';
import Avatar from '@material-ui/core/Avatar';

import Routes from "./Routes";
import './App.css';
import SearchPage from './SearchPage';
import HRInfoAPI from './HRInfoAPI';
import HidAPI from './HidAPI';

class App extends Component {
    static propTypes = {
        cookies: instanceOf(Cookies).isRequired
    };

    constructor(props) {
        super(props);

        this.state = {
            isAuthenticated: false,
            isAuthenticating: true,
            user: {},
            token: '',
            anchorEl: null,
            alert: {},
            searchTerms: ''
        };

        this.userHasAuthenticated = this.userHasAuthenticated.bind(this);
        this.userIsAuthenticated = this.userIsAuthenticated.bind(this);
        this.handleLogout = this.handleLogout.bind(this);
        this.setSearch = this.setSearch.bind(this);
        this.toggleMenu = this.toggleMenu.bind(this);
        this.setAlert = this.setAlert.bind(this);
        this.hideAlert = this.hideAlert.bind(this);
    }

    toggleMenu(event) {
        if (this.state.anchorEl) {
            this.setState({anchorEl: null});
        } else {
            this.setState({anchorEl: event.currentTarget});
        }
    }

    userHasAuthenticated(authenticated, user, token, setState = true) {
        const {cookies} = this.props;
        let newState = {};
        if (authenticated === true) {
            cookies.set('hid-token', token, {path: '/'});
            localStorage.setItem('hid-user', JSON.stringify(user));
            newState = {
                isAuthenticated: true,
                user: user,
                token: token
            };
        } else {
            cookies.remove('hid-token', {path: '/'});
            localStorage.clear();
            newState = {
                isAuthenticated: false,
                user: {},
                token: ''
            };
        }
        if (setState) {
            this.setState(newState);
        } else {
            return newState;
        }
    }

    userIsAuthenticated() {
        const {cookies} = this.props;
        const token = cookies.get('hid-token');
        const user = localStorage.getItem('hid-user');
        return {token: token, user: JSON.parse(user)};
    }

    handleLogout() {
        this.userHasAuthenticated(false);
        this.props.history.push('/');
        this.toggleMenu();
    }

    componentDidMount() {
        const cookie = this.userIsAuthenticated();
        if (cookie && cookie.token) {
            this.setState({isAuthenticated: true, isAuthenticating: false, user: cookie.user, token: cookie.token});
        } else {
            this.setState({isAuthenticating: false});
        }
    }

    componentDidUpdate() {
        if (this.state.token) {
            // Decode the token
            var base64Url = this.state.token.split('.')[1];
            var base64 = base64Url.replace('-', '+').replace('_', '/');
            const decoded = JSON.parse(window.atob(base64));
            const current = new Date();
            if (current.getTime() > decoded.exp * 1000) {
                // Token is expired. Redirect user to login page with error message.
                let newState = this.userHasAuthenticated(false, null, null, false);
                newState.alert = {
                    color: 'danger',
                    message: 'Your session has expired. Please login again'
                };
                this.setState(newState);
                this.props.history.push('/');
            } else {
                // Initialize HID API and HRInfo api
                new HRInfoAPI(this.state.token);
                new HidAPI(this.state.token);
            }
        }
    }

    setSearch(event) {
        const target = event.target;
        const value = target.type === 'checkbox'
            ? target.checked
            : target.value;

        this.setState({searchTerms: value});
    }

    setAlert(color, message) {
        this.setState({
            alert: {
                color: color,
                message: message
            }
        });
    }

    hideAlert() {
        this.setState({alert: {}});
    }

    render() {
        const childProps = {
            isAuthenticated: this.state.isAuthenticated,
            userHasAuthenticated: this.userHasAuthenticated,
            userIsAuthenticated: this.userIsAuthenticated,
            setAlert: this.setAlert,
            user: this.state.user
        };

        const navbar = this.state.isAuthenticated ? (
			<AppBar position="sticky">
                <Toolbar className="toolbar">
                    <Typography variant="title" color="inherit">
                        <NavLink to={'/home'} className="link">HR.info Admin</NavLink>
                    </Typography>
                    <Paper elevation0="true" className="paper">
                        <Input value={this.state.searchTerms}
							onChange={this.setSearch}
							placeholder="Start typing to search..."
							disableUnderline
							fullWidth
							startAdornment={
								<InputAdornment position = "start" >
									<i className="icon-search" />
                        		</InputAdornment>
							}
							className="inputMargin"/>
                    </Paper>
                    <div>
                        <Button aria-owns={Boolean(this.state.anchorEl) ? 'menu-appbar' : null}
							aria-haspopup="true"
							onClick={this.toggleMenu}
							color="secondary"
							variant="fab"
							mini
							classes={{flat: 'flat'}}>
							<Avatar alt={this.state.user.name} src={this.state.user.picture}/>
                        </Button>
                        <Menu id="menu-appbar"
							anchorEl={this.state.anchorEl}
							anchorOrigin={{
                                vertical: 'top',
                                horizontal: 'right'
                            }}
							transformOrigin={{
                                vertical: 'top',
                                horizontal: 'right'
                            }}
							open={Boolean(this.state.anchorEl)}
							onClose={this.toggleMenu}>
                            <MenuItem onClick={this.toggleMenu}>
                                <NavLink to={'/users/' + this.state.user.id} className="link">Profile</NavLink>
                            </MenuItem>
                            <MenuItem onClick={this.toggleMenu}>
                                <NavLink to={'/admin'} className="link">Admin</NavLink>
                            </MenuItem>
                            <Divider/>
                            <MenuItem onClick={this.handleLogout}>Logout</MenuItem>
                        </Menu>
                    </div>
                </Toolbar>
            </AppBar>)
            : (
			<AppBar position="sticky">
                <Toolbar>
                    <Typography variant="title" color="inherit" href="/home">
                        HR.info Admin
                    </Typography>
                </Toolbar>
            </AppBar>);

        const myAlert = this.state.alert.message
            ? (
			<Snackbar anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left'
                }}
				open={Boolean(this.state.alert)}
				autoHideDuration={6000}
				onClose={this.hideAlert}
				ContentProps={{
                    'aria-describedby' : 'message-id'
                }}
				message={<span id = "message-id" > {this.state.alert.message}</span>}
				action={[
                    <Button key="undo" color="secondary" size="small" onClick={this.hideAlert}>
                        CLOSE
                    </Button>
                ]}
			/>
			)
            : '';

        if (!this.state.searchTerms) {
            return (!this.state.isAuthenticating && <div className="App">
                {navbar}
                <div className="container-fluid">
                    {myAlert}
                    <Routes childProps={childProps}/>
                </div>
            </div>);
        } else {
            return (!this.state.isAuthenticating && <div className="App">
                {navbar}
                <div className="container-fluid">
                    {myAlert}
                    <SearchPage searchTerms={this.state.searchTerms}/>
                </div>
            </div>);
        }
    }
}

export default withRouter(withCookies(App));
