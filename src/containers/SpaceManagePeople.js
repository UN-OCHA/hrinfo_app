import React from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableFooter from '@material-ui/core/TableFooter';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';

import withSpace from '../utils/withSpace';

class SpaceManagePeople extends React.Component {

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
                    <TableCell component="th" scope="row">{n.entity.label}</TableCell>
                    <TableCell></TableCell>
                    <TableCell>{n.created}</TableCell>
                    <TableCell></TableCell>
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
