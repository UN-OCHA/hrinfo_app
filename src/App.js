import React, { Component } from 'react';
import { instanceOf } from 'prop-types';
import { withCookies, Cookies } from 'react-cookie';
import { withRouter } from "react-router-dom";
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Alert,
  Input} from 'reactstrap';
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
      isOpen: false,
      alert: {},
      searchTerms: ''
    };

    this.userHasAuthenticated = this.userHasAuthenticated.bind(this);
    this.userIsAuthenticated = this.userIsAuthenticated.bind(this);
    this.handleLogout = this.handleLogout.bind(this);
    this.setSearch = this.setSearch.bind(this);
    this.toggle = this.toggle.bind(this);
    this.setAlert = this.setAlert.bind(this);
    this.hideAlert = this.hideAlert.bind(this);
  }

  toggle() {
    this.setState({
      isOpen: !this.state.isOpen
    });
  }

  userHasAuthenticated (authenticated, user, token, setState = true) {
    const { cookies } = this.props;
    let newState = {};
    if (authenticated === true) {
      cookies.set('hid-token', token, {path: '/'});
      localStorage.setItem('hid-user', JSON.stringify(user));
      newState = {
        isAuthenticated: true,
        user: user,
        token: token
      };
    }
    else {
      cookies.remove('hid-token', { path: '/'});
      localStorage.clear();
      newState = {
        isAuthenticated: false,
        user: {},
        token: ''
      };
    }
    if (setState) {
      this.setState(newState);
    }
    else {
      return newState;
    }
  }

  userIsAuthenticated () {
    const { cookies } = this.props;
    const token = cookies.get('hid-token');
    const user = localStorage.getItem('hid-user');
    return {token: token, user: JSON.parse(user)};
  }

  handleLogout () {
    this.userHasAuthenticated(false);
    this.props.history.push('/');
  }

  componentDidMount() {
    const cookie = this.userIsAuthenticated();
    if (cookie && cookie.token) {
      this.setState({
        isAuthenticated: true,
        isAuthenticating: false,
        user: cookie.user,
        token: cookie.token
      });
    }
    else {
      this.setState({
        isAuthenticating: false
      });
    }
  }

  componentDidUpdate () {
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
      else {
        // Initialize HID API and HRInfo api
        new HRInfoAPI(this.state.token);
        new HidAPI(this.state.token);
      }
    }
  }

  setSearch(event) {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;

    this.setState({
      searchTerms: value
    });
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
    this.setState({
      alert: {}
    });
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
      <Navbar color="dark" dark expand="md">
        <NavbarBrand href="/home">HR.info Admin</NavbarBrand>
        <NavbarToggler onClick={this.toggle} />
        <Input type="text" className="col-sm-6" value={this.state.searchTerms} onChange={this.setSearch} placeholder="Start typing to search..." />
        <Collapse isOpen={this.state.isOpen} navbar>
          <Nav className="ml-auto" navbar>
            <UncontrolledDropdown nav inNavbar>
              <DropdownToggle nav caret>
                <i className="icon-user" /> {this.state.user.name}
              </DropdownToggle>
              <DropdownMenu right>
                <DropdownItem tag="a" href={'/users/' + this.state.user.id}>
                  Profile
                </DropdownItem>
                <DropdownItem tag="a" href="/admin/">
                  Admin
                </DropdownItem>
                <DropdownItem divider />
                <DropdownItem onClick={this.handleLogout}>
                  Logout
                </DropdownItem>
              </DropdownMenu>
            </UncontrolledDropdown>
          </Nav>
        </Collapse>
      </Navbar>
    ) : (
      <Navbar color="dark" dark expand="md">
        <NavbarBrand href="/home">HR.info Admin</NavbarBrand>
        <NavbarToggler onClick={this.toggle} />
      </Navbar>
    );

    const myAlert = this.state.alert.message ? (
      <Alert color={this.state.alert.color} toggle={this.hideAlert}>{this.state.alert.message}</Alert>
    ) : '';
    if (!this.state.searchTerms) {
      return (
        !this.state.isAuthenticating &&
        <div className="App">
          {navbar}
          <div className="container-fluid">
            {myAlert}
            <Routes childProps={childProps} />
          </div>
        </div>
      );
    }
    else {
      return (
        !this.state.isAuthenticating &&
        <div className="App">
          {navbar}
          <div className="container-fluid">
            {myAlert}
            <SearchPage searchTerms={this.state.searchTerms} />
          </div>
        </div>
      );
    }
  }
}

export default withRouter(withCookies(App));
