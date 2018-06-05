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
  NavItem,
  NavLink,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem } from 'reactstrap';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import faUser from '@fortawesome/fontawesome-free-solid/faUser';
import Routes from "./Routes";
import './App.css';
import Search from './Search';

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
      isOpen: false
    };

    this.userHasAuthenticated = this.userHasAuthenticated.bind(this);
    this.userIsAuthenticated = this.userIsAuthenticated.bind(this);
    this.handleLogout = this.handleLogout.bind(this);
    this.goToDocument = this.goToDocument.bind(this);
    this.toggle = this.toggle.bind(this);
  }

  toggle() {
    this.setState({
      isOpen: !this.state.isOpen
    });
  }

  userHasAuthenticated (authenticated, user, token) {
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
    this.setState(newState);
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

  goToDocument(selected) {
    this.props.history.push('/documents/' + selected.id);
  }

  render() {
    const childProps = {
      isAuthenticated: this.state.isAuthenticated,
      userHasAuthenticated: this.userHasAuthenticated,
      userIsAuthenticated: this.userIsAuthenticated,
      user: this.state.user,
      token: this.state.token
    };

    const navbar = this.state.isAuthenticated ? (
      <Navbar color="light" light expand="md">
        <NavbarBrand href="/home">HR.info Admin</NavbarBrand>
        <NavbarToggler onClick={this.toggle} />
        <Search className="col-sm-6" onChange={this.goToDocument} placeholder="Search for documents..." />
        <Collapse isOpen={this.state.isOpen} navbar>
          <Nav className="ml-auto" navbar>
            <NavItem>
              <NavLink href="/admin/">Admin</NavLink>
            </NavItem>
            <UncontrolledDropdown nav inNavbar>
              <DropdownToggle nav caret>
                <FontAwesomeIcon icon={faUser} />
              </DropdownToggle>
              <DropdownMenu right>
                <DropdownItem>
                  Option 1
                </DropdownItem>
                <DropdownItem>
                  Option 2
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
      <Navbar color="light" light expand="md">
        <NavbarBrand href="/home">HR.info Admin</NavbarBrand>
        <NavbarToggler onClick={this.toggle} />
      </Navbar>
    );
    return (
      !this.state.isAuthenticating &&
      <div className="App container">
        {navbar}
        <Routes childProps={childProps} />
      </div>
    );
  }
}

export default withRouter(withCookies(App));
