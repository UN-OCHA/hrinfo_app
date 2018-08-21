import React from 'react';
import {Link} from 'react-router-dom';
import moment from 'moment';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableFooter from '@material-ui/core/TableFooter';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import Button from '@material-ui/core/Button';

import withSpace from '../utils/withSpace';
import HRInfoAPI from '../api/HRInfoAPI';

class SpaceManagePeople extends React.Component {

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

  render() {
    const {doc, content} = this.props;
    if (doc) {
      return (
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
      );
    }
    else {
      return '';
    }
  }
}

export default withSpace(SpaceManagePeople, {contentType: 'og_membership', contentLabel: 'People', sort: '-created'});
