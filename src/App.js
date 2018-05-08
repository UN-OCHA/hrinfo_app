import React, { Component } from 'react';
import { instanceOf } from 'prop-types';
import { withCookies, Cookies } from 'react-cookie';
import { withRouter } from "react-router-dom";
import Routes from "./Routes";
import './App.css';

class App extends Component {
  static propTypes = {
    cookies: instanceOf(Cookies).isRequired
  };

  constructor(props) {
    super(props);

    this.state = {
      isAuthenticated: false,
      user: {},
      token: ''
    };

    this.userHasAuthenticated = this.userHasAuthenticated.bind(this);
    this.userIsAuthenticated = this.userIsAuthenticated.bind(this);
    this.handleLogout = this.handleLogout.bind(this);
  }

  userHasAuthenticated (authenticated, user, token) {
    const { cookies } = this.props;
    let newState = {};
    if (authenticated === true) {
      cookies.set('hid', {token: token, user: {name: user.name}}, {path: '/'});
      console.log('created cookie');
      newState = {
        authenticated: true,
        user: user,
        token: token
      };
    }
    else {
      cookies.remove('hid');
      newState = {
        authenticated: false,
        user: {},
        token: ''
      };
    }
    this.setState(newState);
  }

  userIsAuthenticated () {
    const { cookies } = this.props;
    return cookies.get('hid');
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
        user: cookie.user,
        token: cookie.token
      });
    }
  }

  render() {
    const childProps = {
      isAuthenticated: this.state.isAuthenticated,
      userHasAuthenticated: this.userHasAuthenticated,
      userIsAuthenticated: this.userIsAuthenticated,
      user: this.state.user,
      token: this.state.token
    };
    return (
      <div className="App container">
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
          <a className="navbar-brand" href="#">Navbar</a>
          <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav mr-auto">
              <li className="nav-item active">
                <a className="nav-link" href="/home">Home <span className="sr-only">(current)</span></a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="/document">Add document</a>
              </li>
              <li className="nav-item">
                <button className="nav-link" onClick={this.handleLogout}>Logout</button>
              </li>
            </ul>
          </div>
        </nav>
        <Routes childProps={childProps} />
      </div>
    );
  }
}

export default withRouter(withCookies(App));
