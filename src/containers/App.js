import React, {Component} from 'react';
import ReactGA from 'react-ga';
import {instanceOf} from 'prop-types';
import {withCookies, Cookies} from 'react-cookie';
import {withRouter, NavLink} from "react-router-dom";
import { translate } from 'react-i18next';
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
import ViewModule from '@material-ui/icons/ViewModule';
import KeyboardArrowDown from '@material-ui/icons/KeyboardArrowDown';
import Popover from '@material-ui/core/Popover';
import Grid from '@material-ui/core/Grid';
import Hidden from '@material-ui/core/Hidden';

import './App.css';

import Routes from '../utils/Routes';
import IconLogo from '../components/IconLogo';
import SpaceMenu from '../components/SpaceMenu';
import Breadcrumb from '../components/Breadcrumb';
import SearchInput from '../components/SearchInput';

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
            anchorLanguage: null,
            alert: {},
            searchTerms: '',
			      searchEnabled: false,
            group: null,
            openPopover: false,
            anchorPopover: null,
            breadcrumb: []
        };

        this.userHasAuthenticated = this.userHasAuthenticated.bind(this);
        this.userIsAuthenticated = this.userIsAuthenticated.bind(this);
        this.handleLogout = this.handleLogout.bind(this);
        this.setSearch = this.setSearch.bind(this);
        this.toggleMenu = this.toggleMenu.bind(this);
        this.toggleMenuLanguage = this.toggleMenuLanguage.bind(this);
        this.setAlert = this.setAlert.bind(this);
        this.hideAlert = this.hideAlert.bind(this);
        this.setGroup = this.setGroup.bind(this);
        this.handlePopover = this.handlePopover.bind(this);
        this.setBreadcrumb = this.setBreadcrumb.bind(this);
        this.hasPermission = this.hasPermission.bind(this);
        this.isManagerOrEditor = this.isManagerOrEditor.bind(this);
        this.isManager = this.isManager.bind(this);
        this.isBundleMember = this.isBundleMember.bind(this);

        ReactGA.initialize('UA-70934930-2');
        ReactGA.pageview(window.location.pathname + window.location.search);
    }

    toggleMenu(event) {
        if (this.state.anchorEl) {
            this.setState({anchorEl: null});
        } else {
            this.setState({anchorEl: event.currentTarget});
        }
    }

    toggleMenuLanguage(event) {
      if (this.state.anchorLanguage) {
        this.setState({anchorLanguage: null});
      } else {
        this.setState({anchorLanguage: event.currentTarget});
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

    handlePopover (event) {
      this.setState({
        openPopover: !this.state.openPopover,
        anchorPopover: event.currentTarget
      });
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
        }
      }
    }

	setSearch(val) {
    if (val && val.id) {
      if (val.type === 'bundles') {
        this.props.history.push('/groups/' + val.id);
      }
      else if (val.type === 'search') {
        this.props.history.push('/search/' + val.label);
      }
      else {
        this.props.history.push('/' + val.type + '/' + val.id);
      }
    }
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

    setGroup (group) {
      this.setState({
        group: group
      });
    }

    setBreadcrumb (breadcrumb) {
      this.setState({
        breadcrumb: breadcrumb
      });
    }

    isManagerOrEditor (space) {
      const hrinfo = this.state.user ? this.state.user.hrinfo : {};
      const perms = hrinfo.spaces[space.id];
      if (!perms) {
        return false;
      }
      if (perms.indexOf('manager') !== -1 || perms.indexOf('editor') !== -1) {
        return true;
      }
      return false;
    }

    isManager (space) {
      const hrinfo = this.state.user ? this.state.user.hrinfo : {};
      const perms = hrinfo.spaces[space.id];
      if (!perms) {
        return false;
      }
      if (perms.indexOf('manager') !== -1) {
        return true;
      }
      return false;
    }

    isBundleMember (space) {
      const hrinfo = this.state.user ? this.state.user.hrinfo : {};
      const perms = hrinfo.spaces[space.id];
      if (!perms) {
        return false;
      }
      if (perms.indexOf('bundle member') !== -1) {
        return true;
      }
      return false;
    }

    hasPermission (action, content, space) {
      const that = this;
      const hrinfo = this.state.user ? this.state.user.hrinfo : {};
      if (hrinfo.roles && hrinfo.roles.indexOf('administrator') !== -1 && content.type !== 'dataset' && content.type !== 'users') {
        return true;
      }
      let isAllowed = false;
      if (action === 'add') {
        // Allow user to add if he is a manager, contributor or editor of the space
        const perms = hrinfo.spaces[space.id];
        if (perms &&
          content !== 'bundles' &&
          (perms.indexOf('editor') !== -1 || perms.indexOf('manager') !== -1 || perms.indexOf('contributor') !== -1)) {
          isAllowed = true;
        }
      }
      if (action === 'edit' || action === 'delete') {
        const contentTypes = ['events', 'documents', 'infographics', 'assessments', 'offices'];
        // Allow user to edit operation if he is a manager of the operation
        if (content.type === 'operation' && this.isManager(content) && action === 'edit') {
          isAllowed = true;
        }
        // Allow user to edit a group if he is a manager of the group or a manager of the operation
        if (content.type === 'bundle' &&
          action === 'edit' &&
          (this.isManager(content) || this.isManager(content.operation[0]))) {
          isAllowed = true;
        }
        if (contentTypes.indexOf(content.type) !== -1) {
          let isOperationManagerEditor = true;
          let isBundleMember = true;
          content.operation.forEach(function (op) {
            if (!that.isManagerOrEditor(op)) {
              isOperationManagerEditor = false;
            }
            if (!that.isBundleMember(op)) {
              isBundleMember = false;
            }
          });
          if (content.bundles) {
            let isBundleManagerEditor = true;
            content.bundles.forEach(function (b) {
              if (!b || !that.isManagerOrEditor(b)) {
                isBundleManagerEditor = false;
              }
            });
            if (isOperationManagerEditor || (isBundleMember && isBundleManagerEditor)) {
              isAllowed = true;
            }
          }
          else {
            if (isOperationManagerEditor) {
              isAllowed = true;
            }
          }
        }
      }
      if (action === 'customize') {
        if (content.type === 'operation' && this.isManager(content)) {
          isAllowed = true;
        }
        if (content.type === 'bundle' &&
          (this.isManager(content) || this.isManager(content.operation[0]))) {
          isAllowed = true;
        }
        if (content.type === 'office' && this.isManager(content.operation[0])) {
          isAllowed = true;
        }
      }
      return isAllowed;
    }

    render() {
        const {t, i18n} = this.props;
        const childProps = {
            isAuthenticated: this.state.isAuthenticated,
            userHasAuthenticated: this.userHasAuthenticated,
            userIsAuthenticated: this.userIsAuthenticated,
            setAlert: this.setAlert,
            user: this.state.user,
            setGroup: this.setGroup,
            setBreadcrumb: this.setBreadcrumb,
            hasPermission: this.hasPermission
        };

        const popover = this.state.group ? (
          <Popover open={this.state.openPopover}
            onClose={this.handlePopover}
            anchorEl={this.state.anchorPopover}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'center',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'center',
            }}><SpaceMenu space={this.state.group} handlePopover={this.handlePopover} /></Popover>
        ) : '';

        const modulesButton = this.state.group ? (
          <IconButton aria-label="Modules" onClick={this.handlePopover} color="secondary">
            <ViewModule />
          </IconButton>
        ) : '';

        const navbar = this.state.isAuthenticated ? (
			<Grid item xs={12}>
				<AppBar position="sticky" color="primary">
	                <Toolbar className="toolbar">
	                    <Typography variant="title" color="inherit">
	                        <NavLink to={'/home'} className="link"><IconLogo /></NavLink>
	                        <Breadcrumb elts={this.state.breadcrumb} />
	                    </Typography>
						<Hidden xsDown>
							<Paper elevation={0} className="paper">
                <SearchInput
                  onChange={this.setSearch}
                  value={this.state.searchResult}
                  />
							</Paper>
						</Hidden>
            <div>
              <Button color="secondary" onClick={this.toggleMenuLanguage}>{i18n.languages[0]} <KeyboardArrowDown /> </Button>
              <Menu id="language-menu" anchorEl={this.state.anchorLanguage} onClose={this.toggleMenuLanguage} open={Boolean(this.state.anchorLanguage)}>
                <MenuItem key='en' onClick={() => {this.toggleMenuLanguage(); i18n.changeLanguage('en'); }}>EN</MenuItem>
                <MenuItem key='fr' onClick={() => {this.toggleMenuLanguage(); i18n.changeLanguage('fr'); }}>FR</MenuItem>
                <MenuItem key='es' onClick={() => {this.toggleMenuLanguage(); i18n.changeLanguage('es'); }}>ES</MenuItem>
              </Menu>
            </div>
	                    <div>
	                        {modulesButton}
	                        <Button aria-owns={Boolean(this.state.anchorEl) ? 'menu-appbar' : null}
								aria-haspopup="true"
								onClick={this.toggleMenu}
								color="secondary"
								variant="fab"
								mini
								classes={{flat: 'flat'}}>
								{ this.state.user.picture ? (
									<Avatar src={this.state.user.picture}></Avatar>
								) : (
									<Avatar>{this.state.user.name.substring(0,1)}</Avatar>
								)}
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
                            <MenuItem onClick={this.toggleMenu}>
	                              <a href="mailto:info@humanitarianresponse.info" className="link">Feedback</a>
	                          </MenuItem>
	                          <Divider/>
	                          <MenuItem onClick={this.handleLogout}>Logout</MenuItem>
	                        </Menu>
	                    </div>
	                </Toolbar>
	            </AppBar>
				<Hidden smUp>
					<AppBar position="sticky" color="secondary" elevation={0}>
						<Toolbar variant="dense">
							<Paper elevation={0} className="paper">
								<Input value={this.state.searchTerms}
									onChange={this.setSearch}
									placeholder={t('app.search_placeholder')}
									disableUnderline
									fullWidth
									startAdornment={
										<InputAdornment position = "start" >
											<i className="icon-search" />
										</InputAdornment>
									}
									className="inputMargin"/>
							</Paper>
						</Toolbar>
					</AppBar>
				</Hidden>
			</Grid>
			)
            : (
			<AppBar position="sticky" color="primary">
                <Toolbar>
                    <Typography variant="title" color="inherit" href="/home">
                        <IconLogo />
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

            return (!this.state.isAuthenticating &&
			<Grid container className="App" justify="center" alignItems="center">
				{navbar}
                {popover}
                <Grid item className="container-fluid" sm={11}>
                    {myAlert}
                    <Routes childProps={childProps}/>
                </Grid>
            </Grid>);
    }
}

export default withRouter(withCookies(translate('common')(App)));
