import React from 'react';
import {Link} from 'react-router-dom';
import moment from 'moment';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';

import HidContacts from '../components/HidContacts';
import withSpace from '../utils/withSpace';
import HRInfoAPI from '../api/HRInfoAPI';

class SpaceManagePeople extends React.Component {
  state = {
    user: null,
    role: ''
  };

  hrinfoAPI = new HRInfoAPI();

  removeMembership = (id) => {
    const that = this;
    this
      .hrinfoAPI
      .remove('og_membership', id)
      .then(results => {
        that.props.setAlert('success', 'member deleted successfully');
        that.props.forceUpdate();
      }).catch(function(err) {
        that.props.setAlert('danger', 'There was an error deleting this member');
      });
  };

  addMembership = (evt) => {
    const that = this;
    const membership = {
      entity: this.state.user.id,
      role: this.state.role,
      group: this.props.doc.id
    };
    this
      .hrinfoAPI
      .save('og_membership', membership)
      .then(results => {
        that.props.setAlert('success', 'member added successfully');
        that.props.forceUpdate();
      }).catch(function(err) {
        that.props.setAlert('danger', 'There was an error adding this member');
      });
  };

  render() {
    const {doc, content} = this.props;
    if (doc) {
      return (
        <div>
          <h2>Add a group member</h2>
          <FormControl fullWidth margin="normal">
            <FormLabel>User</FormLabel>
            <HidContacts id="user"
                         onChange={(s) => this.setState({user: s})}
                         value={this.state.user} />
          </FormControl>
          <FormControl component="fieldset">
            <FormLabel component="legend">Role</FormLabel>
            <RadioGroup
              aria-label="Role"
              name="role"
              value={this.state.role}
              onChange={(e) => this.setState({role: e.target.value})}
            >
              <FormControlLabel value="manager" control={<Radio />} label="Manager" />
              <FormControlLabel value="editor" control={<Radio />} label="Editor" />
              <FormControlLabel value="contributor" control={<Radio />} label="Contributor" />
            </RadioGroup>
          </FormControl>
          <div>
            <Button color="primary" variant="contained" onClick={this.addMembership}>Add user</Button>
          </div>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Roles</TableCell>
                <TableCell>Member since</TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {content.data.map(n => {
                return (
                  <TableRow key={n.id}>
                    <TableCell component="th" scope="row"><Link to={'/users/' + n.entity.hid}>{n.entity.label}</Link></TableCell>
                    <TableCell><ul>{n.roles.map(r => {
                      return (<li key={n.id + '_' + r}>{r}</li>);
                    })}</ul></TableCell>
                    <TableCell>{moment.unix(n.created).format('MMM DD YYYY')}</TableCell>
                    <TableCell><Button onClick={(s) => {this.removeMembership(n.id)}}>remove</Button></TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      );
    }
    else {
      return '';
    }
  }
}

export default withSpace(SpaceManagePeople, {contentType: 'og_membership', contentLabel: 'People', sort: '-created'});
