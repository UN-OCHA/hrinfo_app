import React, {Component} from 'react';
import ReactGA from 'react-ga';
import {instanceOf} from 'prop-types';
import {withCookies, Cookies} from 'react-cookie';
import {withRouter, NavLink} from "react-router-dom";
import { translate } from 'react-i18next';
// Material Components
import { withStyles } from '@material-ui/core/styles';
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
import MenuIcon from '@material-ui/icons/Menu';
import KeyboardArrowDown from '@material-ui/icons/KeyboardArrowDown';
import Grid from '@material-ui/core/Grid';
import Hidden from '@material-ui/core/Hidden';

import './App.css';

import Routes from '../utils/Routes';
import IconLogo from '../components/IconLogo';
import SpaceMenu from '../components/SpaceMenu';
import HRBreadcrumb from '../components/HRBreadcrumb';
import HRToolbar from '../components/HRToolbar';
import SearchInput from '../components/SearchInput';
import UserMenu from '../components/UserMenu';
import LanguageMenu from '../components/LanguageMenu';

const styles = theme => ({
  layout: {
    width: 'auto',
    marginLeft: theme.spacing.unit * 3,
    marginRight: theme.spacing.unit * 3,
    [theme.breakpoints.up(1240 + theme.spacing.unit * 3 * 2)]: {
      width: 1240,
      marginLeft: 'auto',
      marginRight: 'auto',
    },
  },
  appBarButton: {
    color: 'white'
  },
  grow: {
    flexGrow: 1
  },
  footerLink: {
    color: 'white',
    fontSize: '12px'
  },
  footer: {
    backgroundColor: theme.palette.primary.main,
    padding: `${theme.spacing.unit * 6}px 0`,
    color: 'white',
    fontSize: '12px'
  },
});

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
            alert: {},
            searchTerms: '',
			      searchEnabled: false,
            isEditable: false,
            item: null,
            contentType: {}
        };

        this.userHasAuthenticated = this.userHasAuthenticated.bind(this);
        this.userIsAuthenticated = this.userIsAuthenticated.bind(this);
        this.handleLogout = this.handleLogout.bind(this);
        this.setSearch = this.setSearch.bind(this);
        this.setAlert = this.setAlert.bind(this);
        this.hideAlert = this.hideAlert.bind(this);
        this.setItem = this.setItem.bind(this);
        this.hasPermission = this.hasPermission.bind(this);
        this.isManagerOrEditor = this.isManagerOrEditor.bind(this);
        this.isManager = this.isManager.bind(this);
        this.isBundleMember = this.isBundleMember.bind(this);
        this.setContentType = this.setContentType.bind(this);

        ReactGA.initialize('UA-70934930-2');
        ReactGA.pageview(window.location.pathname + window.location.search);
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

    setItem (item) {
      this.setState({item});
    }

    setContentType (contentType) {
      this.setState({contentType});
    }

    setEditable = () => {
      const editable = this.state.isEditable;
      this.setState({
        isEditable: !editable
      });
    };

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
        const {t, i18n, classes} = this.props;
        const childProps = {
            isAuthenticated: this.state.isAuthenticated,
            userHasAuthenticated: this.userHasAuthenticated,
            userIsAuthenticated: this.userIsAuthenticated,
            setAlert: this.setAlert,
            user: this.state.user,
            setItem: this.setItem,
            hasPermission: this.hasPermission,
            setContentType: this.setContentType,
            isEditable: this.state.isEditable
        };

        const navbar = (
          <Toolbar>
            <SpaceMenu item={this.state.item} />
            <NavLink to={'/home'} className="link"><IconLogo /></NavLink>
            <Hidden xsDown>
                <SearchInput
                  onChange={this.setSearch}
                  value={this.state.searchResult}
                  />
            </Hidden>
          </Toolbar>
        );

        const appbar = (
          <React.Fragment>
          <AppBar position="static" color="primary" elevation={0}>
            <Toolbar>
              <Button className={classes.appBarButton}>OCHA Services <KeyboardArrowDown /></Button>
              <div className={classes.grow}></div>
              {this.state.isAuthenticated && <UserMenu user={this.state.user} handleLogout={this.handleLogout} /> }
              <LanguageMenu />
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
        </React.Fragment>
			);

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
			<React.Fragment>
        <div className={classes.layout}>
  				{appbar}
          <Paper elevation={0}>
            {navbar}
            {myAlert}
            {this.state.item && <HRToolbar item={this.state.item} contentType={this.state.contentType} hasPermission={this.hasPermission} setEditable={this.setEditable} goBack={this.props.history.goBack} /> }
            {this.state.item && <HRBreadcrumb item={this.state.item} contentType={this.state.contentType} /> }
            <Routes childProps={childProps}/>
          </Paper>
          <footer role="contentinfo" className={classes.footer}>
            <div className="footer-left footer__logo">
              <div>Service provided by</div>
              <div>
                <a className={classes.footerLink} href="http://www.unocha.org/"><img src={process.env.PUBLIC_URL + '/img/ocha-logo.svg'} alt="OCHA" className="img-responsive" /></a>
                <span>OCHA coordinates the global emergency response to save lives and protect people in humanitarian crises. We advocate for effective and principled humanitarian action by all, for all.</span>
              </div>
            </div>
            <div className="footer-right">
              <p className="footer__licence">Except where otherwise noted, content on this site is licensed under a <a className={classes.footerLink} href="https://creativecommons.org/licenses/by/4.0/">Creative Commons Attribution 4.0</a> International license. <span className="icon-creative-commons" aria-hidden="true"></span></p>
            </div>
          </footer>
        </div>
      </React.Fragment>);
    }
}

export default withRouter(withCookies(translate('common')(withStyles(styles)(App))));
