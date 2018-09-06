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
import Typography from '@material-ui/core/Typography';
import ViewModule from '@material-ui/icons/ViewModule';
import ViewList from '@material-ui/icons/ViewList';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';

import { Filters, FilterChips } from '../components/Filters';
import Item from '../components/Item';
import withSpace from '../utils/withSpace';
import TablePaginationActionsWrapped from '../components/TablePaginationActionsWrapped';

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

  state = {
    view: 'list'
  };

    render() {
      const { classes, content, page, rowsPerPage, handleChangePage, handleChangeRowsPerPage, toggleDrawer, drawerState, contentType, spaceType, filters, removeFilter } = this.props;
      const emptyRows = rowsPerPage - Math.min(rowsPerPage, content.count - page * rowsPerPage);
      const { view } = this.state;

      return (
        <div>
          <Filters
            contentType   = {contentType}
            spaceType     = {spaceType}
            filters       = {filters}
            setFilter     = {this.props.setFilter}
            toggleDrawer  = {toggleDrawer}
            drawerState   = {drawerState}
            doc           = {this.props.doc} />
          <Paper className={classes.root}>
            <Typography align = "right">
              <Button onClick={toggleDrawer}><i className="icon-filter" /></Button>
              <IconButton onClick={(v) => {this.setState({view: 'grid'})}}>
                <ViewModule />
              </IconButton>
              <IconButton onClick={(v) => {this.setState({view: 'list'})}}>
                <ViewList />
              </IconButton>
            </Typography>
            <Typography variant="subheading">
              <FilterChips filters={filters} removeFilter={removeFilter} />&nbsp;<strong>{content.count}</strong> elements found
            </Typography>
            {view === 'list' ?
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
                      <TableCell><Link to={'/users/' + n.id}>{n.name}</Link></TableCell>
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
            </Table> : ''}
            { view === 'grid' ?
              <div>
              {content.data.map(n => {
                return (<Item key={n.id} item={n} viewMode="search" />);
              })}
              <TablePagination
                count={content.count}
                rowsPerPage={rowsPerPage}
                rowsPerPageOptions={[50,100,150,200]}
                page={page}
                onChangePage={handleChangePage}
                onChangeRowsPerPage={handleChangeRowsPerPage}
                ActionsComponent={TablePaginationActionsWrapped}
              />
              </div> : ''
            }
          </Paper>
        </div>
      );
    }
}

ContactsPage.propTypes = {
  classes: PropTypes.object.isRequired,
  content: PropTypes.object.isRequired
};

export default withSpace(withStyles(styles)(ContactsPage), { contentType: 'users', contentLabel: 'Contacts', sort: 'name'});
