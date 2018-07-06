import React from 'react';
import {Container, Row, Col} from 'reactstrap';
import moment from 'moment';
import HidAPI from './HidAPI';

class User extends React.Component {

    constructor(props) {
      super(props);

      this.state = {
        user: null
      };

      this.hidAPI = new HidAPI();
    }

    async componentDidMount() {
      if (this.props.match.params.id) {
        const user = await this.hidAPI.getItem('user', this.props.match.params.id);
        this.setState({
          user: user
        });
      }
    }

    async componentDidUpdate () {
      if (this.state.user.id && this.state.user.id !== this.props.match.params.id) {
        const user = await this.hidAPI.getItem('user', this.props.match.params.id);
        this.setState({
          user: user
        });
      }
    }

    render() {
      if (this.state.user) {
        const user = this.state.user;
        let org = '';
        if (user.organization) {
          if (user.organization.acronym) {
            org = <span><i className="icon-home" /> {user.organization.acronym}</span>;
          }
          else {
            org = <span><i className="icon-home" /> {user.organization.name}</span>;
          }
        }
        let phonesList = '';
        phonesList = user.phone_numbers.map(function (phone) {
          return <li><a href={'tel:' + phone.number}>{phone.number}</a><div>{phone.type}</div></li>;
        });
        let emailsList = '';
        emailsList = user.emails.map(function (email) {
          return <li><a href={'mailto:' + email.email}>{email.email}</a></li>;
        });
        let socialsList = '';
        socialsList = user.voips.map(function (voip) {
          return <li>{voip.type}: {voip.username}</li>;
        });
        let orgsList = '';
        orgsList = user.organizations.map(function (org) {
          return <li>{org.name}</li>;
        });
        let jobsList = '';
        jobsList = user.job_titles.map(function (job) {
          return <li>{job}</li>;
        });
        let locsList = '';
        locsList = user.locations.map(function (loc) {
          return <li>{loc.country.name}</li>;
        });
        let rolesList = '';
        rolesList = user.functional_roles.map(function (role) {
          return <li>{role.name}</li>;
        });
        let sitesList = '';
        sitesList = user.websites.map(function (site) {
          return <li><a href={site.url}>{site.url}</a></li>;
        });
        const userVerified = <span><i className="icon-check-circle" /> This user has been verified</span>;
        return (
          <Container>
            <Row>
              <Col sm="3"><img src={user.picture} alt={user.name} className="img-thumbnail" /></Col>
              <Col>
                <h1>{this.state.user.name}</h1>
                <ul className="list-inline">
                  <li>{org}</li>
                  <li>{ (user.location && user.location.country) ? <span><i class="icon-map-pin" /> {user.location.country.name}</span> : ''}</li>
                </ul>
                <hr />
                <p>{user.status}</p>
                <p>{user.verified ? userVerified : 'This user has not been verified.'}</p>
              </Col>
            </Row>
            <Row>
              <Col>
                <h2>Contact Information</h2>
                <h3>Phone numbers</h3>
                <ul>{phonesList}</ul>
                <hr />
                <h3>Emails</h3>
                <ul>{emailsList}</ul>
                <hr />
                <h3>Social Networks</h3>
                <ul>{socialsList}</ul>
              </Col>
              <Col>
                <h2>Humanitarian Details</h2>
                <h3>Organizations</h3>
                <ul>{orgsList}</ul>
                <hr />
                <h3>Job Titles</h3>
                <ul>{jobsList}</ul>
                <hr />
                <h3>Locations</h3>
                <ul>{locsList}</ul>
                <hr />
              </Col>
              <Col>
                <h2>Additional Information</h2>
                <h3>Functional Roles</h3>
                <ul>{rolesList}</ul>
                <hr />
                <h3>Websites</h3>
                <ul>{sitesList}</ul>
                <hr />
                <ul>
                  <li>Last Updated: {moment(user.updatedAt).format('MMMM DD, YYYY')}</li>
                  <li>Created: {moment(user.createdAt).format('MMMM DD, YYYY')}</li>
                </ul>
                <hr />
              </Col>
            </Row>
          </Container>
        );
      }
      else {
        return null;
      }
    }
}

export default User;
