import React from 'react';
import PropTypes from 'prop-types';
import {NavLink} from "react-router-dom";
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableFooter from '@material-ui/core/TableFooter';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

import withSpace from './withSpace';
import TablePaginationActionsWrapped from './TablePaginationActionsWrapped';

const styles = theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing.unit * 3,
    overflowX: 'auto',
  },
  table: {
    minWidth: 700,
  },
});

class ContactsPage extends React.Component {

    render() {
      const { classes, content, page, rowsPerPage, handleChangePage, handleChangeRowsPerPage } = this.props;
      const emptyRows = rowsPerPage - Math.min(rowsPerPage, content.count - page * rowsPerPage);

      return (
        <Paper className={classes.root}>
          <Table className={classes.table}>
            <TableHead>
              <TableRow>
                <TableCell></TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Job Title</TableCell>
                <TableCell>Organization</TableCell>
                <TableCell>Cluster</TableCell>
                <TableCell>Country</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {content.data.map(n => {
                let bundles = '';
                if (n.bundles) {
                  n.bundles.forEach(function (b) {
                    bundles += b.name + ',';
                  });
                }
                return (
                  <TableRow key={n.id}>
                    <TableCell component="th" scope="row">
                      {n.verified ? <i className="icon-check-circle" /> : ''}
                    </TableCell>
                    <TableCell><NavLink to={'/users/' + n.id}>{n.name}</NavLink></TableCell>
                    <TableCell>{n.job_title}</TableCell>
                    <TableCell>{n.organization ? (n.organization.acronym ? n.organization.acronym : n.organization.name) : ''}</TableCell>
                    <TableCell>{bundles}</TableCell>
                    <TableCell>{n.location && n.location.country ? n.location.country.name : ''}</TableCell>
                  </TableRow>
                );
              })}
              {emptyRows > 0 && (
                <TableRow style={{ height: 48 * emptyRows }}>
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TablePagination
                  colSpan={3}
                  count={content.count}
                  rowsPerPage={rowsPerPage}
                  rowsPerPageOptions={[50,100,150,200]}
                  page={page}
                  onChangePage={handleChangePage}
                  onChangeRowsPerPage={handleChangeRowsPerPage}
                  ActionsComponent={TablePaginationActionsWrapped}
                />
              </TableRow>
            </TableFooter>
          </Table>
        </Paper>
      );
    }
}

ContactsPage.propTypes = {
  classes: PropTypes.object.isRequired,
  content: PropTypes.object.isRequired
};

export default withSpace(withStyles(styles)(ContactsPage), { contentType: 'user', contentLabel: 'Contacts', sort: 'name'});
