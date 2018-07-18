import React from 'react';
import PropTypes from 'prop-types';
import {Link} from "react-router-dom";
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableFooter from '@material-ui/core/TableFooter';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Drawer from '@material-ui/core/Drawer';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';

import TablePaginationActionsWrapped from './TablePaginationActionsWrapped';
import withSpace from './withSpace';
import {Filters, FilterChips} from './Filters';

const styles = theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing.unit * 3,
    overflowX: 'auto',
  },
  table: {
    minWidth: 700,
  },
  list: {
    width: 250
  }
});

class DocumentsPage extends React.Component {

    render() {
      const { classes, content, handleChangePage, handleChangeRowsPerPage , rowsPerPage, page, toggleDrawer, drawerState, contentType, spaceType, filters, removeFilter} = this.props;
      const emptyRows = rowsPerPage - Math.min(rowsPerPage, content.count - page * rowsPerPage);

      return (
        <div>
          <Filters
            contentType={contentType}
            spaceType={spaceType}
            filters={filters}
            setFilter={this.props.setFilter}
            toggleDrawer={toggleDrawer}
            drawerState={drawerState}
            doc={this.props.doc} />
          <Paper className={classes.root}>
            <Typography align="right">
              <Button onClick={toggleDrawer}><i className="icon-filter" /></Button>
            </Typography>
            <Typography variant="subheading">
              <FilterChips filters={filters} removeFilter={removeFilter} />&nbsp;<strong>{content.count}</strong> elements found
            </Typography>
            <Table className={classes.table}>
              <TableHead>
                <TableRow>
                  <TableCell>Title</TableCell>
                  <TableCell>Document type</TableCell>
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
                      <TableCell>{n.document_type ? n.document_type.label : ''}</TableCell>
                      <TableCell>{n.organizations ? n.organizations.map(o => {
                        return (<Link to={'/organizations/' + o.id}>{o.label}</Link>);
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
        </div>
      );
    }
}

DocumentsPage.propTypes = {
  classes: PropTypes.object.isRequired,
  content: PropTypes.object.isRequired
};

export default withSpace(withStyles(styles)(DocumentsPage), {contentType: 'documents', contentLabel: 'Documents', sort: '-publication_date'});
