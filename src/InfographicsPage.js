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

import TablePaginationActionsWrapped from './TablePaginationActionsWrapped';
import withSpace from './withSpace';

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

class InfographicsPage extends React.Component {

    render() {
      const { classes, content, handleChangePage, handleChangeRowsPerPage , rowsPerPage, page} = this.props;
      const emptyRows = rowsPerPage - Math.min(rowsPerPage, content.count - page * rowsPerPage);

      return (
        <Paper className={classes.root}>
          <Table className={classes.table}>
            <TableHead>
              <TableRow>
                <TableCell>Title</TableCell>
                <TableCell>Infographic type</TableCell>
                <TableCell>Organizations</TableCell>
                <TableCell>Publication date</TableCell>
                <TableCell>Files</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {content.data.map(n => {
                return (
                  <TableRow key={n.id}>
                    <TableCell component="th" scope="row">
                      {n.label}
                    </TableCell>
                    <TableCell>{n.infographic_type ? n.infographic_type.label : ''}</TableCell>
                    <TableCell>{n.organizations ? n.organizations.map(o => {
                      return o.label + '; ';
                    }) : ''}</TableCell>
                    <TableCell>{n.publication_date ? n.publication_date : ''}</TableCell>
                    <TableCell>TODO</TableCell>
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

InfographicsPage.propTypes = {
  classes: PropTypes.object.isRequired,
  content: PropTypes.object.isRequired
};

export default withSpace(withStyles(styles)(InfographicsPage), {spaceType: 'operations', contentType: 'infographics', contentLabel: 'Infographics', sort: '-publication_date'});
