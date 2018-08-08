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
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import AddIcon from '@material-ui/icons/Add';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import ViewModule from '@material-ui/icons/ViewModule';
import ViewList from '@material-ui/icons/ViewList';
import moment from 'moment';


import TablePaginationActionsWrapped from '../components/TablePaginationActionsWrapped';
import withSpace from '../utils/withSpace';
import {Filters, FilterChips} from '../components/Filters';
import Item from '../components/Item';

const styles = theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing.unit * 3,
    overflowX: 'auto',
  },
  table: {
    minWidth: 700,
  }
});

class DatasetsPage extends React.Component {

  render() {
    const { classes, content, handleChangePage, handleChangeRowsPerPage , rowsPerPage, page, toggleDrawer, drawerState, contentType, spaceType, filters, removeFilter} = this.props;
    const emptyRows = rowsPerPage - Math.min(rowsPerPage, content.count - page * rowsPerPage);

    return (
      <Paper className={classes.root}>
        <Typography variant="subheading">
          <strong>{content.count}</strong> elements found
        </Typography>
        <Table className={classes.table}>
          <TableHead>
            <TableRow>
              <TableCell>Dataset</TableCell>
              <TableCell>Last Updated</TableCell>
              <TableCell>Source</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {content.data.map(n => {
              return (
                <TableRow key={n.id}>
                  <TableCell component="th" scope="row">
                    <a href={'https://data.humdata.org/dataset/' + n.id} target="__blank">{n.title}</a>
                  </TableCell>
                  <TableCell>{moment(n.metadata_modified).format('DD MMMM YYYY')}</TableCell>
                  <TableCell>{n.dataset_source}</TableCell>
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

DatasetsPage.propTypes = {
  classes: PropTypes.object.isRequired,
  content: PropTypes.object.isRequired
};

export default withSpace(withStyles(styles)(DatasetsPage), {contentType: 'dataset', contentLabel: 'Datasets', sort: 'metadata_modified'});
