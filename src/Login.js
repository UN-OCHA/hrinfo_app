import React from 'react';
import { Button, Form, FormGroup, FormText, Label, Input } from 'reactstrap';

class Login extends React.Component {
  constructor(props) {
      super(props);

      this.state = {
        email: "",
        password: ""
      };

      this.validateForm = this.validateForm.bind(this);
      this.handleChange = this.handleChange.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);
    }

    validateForm() {
      return this.state.email.length > 0 && this.state.password.length > 0;
    }

    handleChange (event) {
      this.setState({
        [event.target.id]: event.target.value
      });
    }

    handleSubmit (event) {
      event.preventDefault();
      let body = this.state;
      body.exp = Math.floor(Date.now() / 1000) + 3600;
      let tokenData = {};
      fetch('https://auth.humanitarian.id/api/v2/jsonwebtoken', {
        method: 'POST',
        body: JSON.stringify(body),
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
        })
        .then(results => {
            return results.json();
        })
        .then(data => {
          if (!data.user || !data.token) {
            throw "Unknown exception";
          }
          else {
            tokenData = data;
            return fetch('https://www.humanitarianresponse.info/api/v1.0/user/me?access_token=' + data.token);
          }
        })
        .then(results => {
          return results.json();
        })
        .then(data => {
          tokenData.user.hrinfo = {
            roles: data.data[0].roles,
            spaces: data.data[0].spaces
          };
          this.props.userHasAuthenticated(true, tokenData.user, tokenData.token);
          this.props.history.push('/home');
        })
        .catch(err => {
          alert('Could not log you in');
        });
    }

    render() {
      return (
        <Form onSubmit={this.handleSubmit}>
          <FormGroup>
            <Label for="email">Email</Label>
            <Input type="email" name="email" id="email" value={this.state.email} onChange={this.handleChange} />
            <FormText color="muted">Your Humanitarian ID email</FormText>
          </FormGroup>
          <FormGroup>
            <Label for="password">Password</Label>
            <Input type="password" name="password" id="password" value={this.state.password} onChange={this.handleChange} />
            <FormText color="muted">Your Humanitarian ID password</FormText>
          </FormGroup>
          <Button color="primary">Login</Button>
        </Form>
      );
    }
}

export default Login;
