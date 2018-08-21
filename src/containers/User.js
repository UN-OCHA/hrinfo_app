import React from 'react';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import moment from 'moment';
import HidAPI from '../api/HidAPI';

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
        phonesList = user.phone_numbers.map(function (phone, index) {
          return <li key={index}><a href={'tel:' + phone.number}>{phone.number}</a><div>{phone.type}</div></li>;
        });
        let emailsList = '';
        emailsList = user.emails.map(function (email, index) {
          return <li key={index}><a href={'mailto:' + email.email}>{email.email}</a></li>;
        });
        let socialsList = '';
        socialsList = user.voips.map(function (voip, index) {
          return <li key={index}>{voip.type}: {voip.username}</li>;
        });
        let orgsList = '';
        orgsList = user.organizations.map(function (org, index) {
          return <li key={index}>{org.name}</li>;
        });
        let jobsList = '';
        jobsList = user.job_titles.map(function (job, index) {
          return <li key={index}>{job}</li>;
        });
        let locsList = '';
        locsList = user.locations.map(function (loc, index) {
          return <li key={index}>{loc.country.name}</li>;
        });
        let rolesList = '';
        rolesList = user.functional_roles.map(function (role, index) {
          return <li key={index}>{role.name}</li>;
        });
        let sitesList = '';
        sitesList = user.websites.map(function (site, index) {
          return <li key={index}><a href={site.url}>{site.url}</a></li>;
        });
        const userVerified = <span><i className="icon-check-circle" /> This user has been verified</span>;
        return (
          <Paper>
            <Grid container>
              <Grid item xs={3}><img src={user.picture} alt={user.name} className="user-image" /></Grid>
              <Grid item xs={9}>
                <h1>{this.state.user.name}</h1>
                <ul className="list-inline">
                  <li>{org}</li>
                  <li>{ (user.location && user.location.country) ? <span><i class="icon-map-pin" /> {user.location.country.name}</span> : ''}</li>
                </ul>
                <hr />
                <p>{user.status}</p>
                <p>{user.verified ? userVerified : 'This user has not been verified.'}</p>
              </Grid>
              <Grid item xs={4}>
                <h2>Contact Information</h2>
                <h3>Phone numbers</h3>
                <ul>{phonesList}</ul>
                <hr />
                <h3>Emails</h3>
                <ul>{emailsList}</ul>
                <hr />
                <h3>Social Networks</h3>
                <ul>{socialsList}</ul>
              </Grid>
              <Grid item xs={4}>
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
              </Grid>
              <Grid item xs={4}>
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
              </Grid>
            </Grid>
          </Paper>
        );
      }
      else {
        return null;
      }
    }
}

export default User;
