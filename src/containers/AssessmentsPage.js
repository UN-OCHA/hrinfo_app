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
import Moment from 'moment';


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
  },
  fab: {
    position: 'fixed',
    bottom: theme.spacing.unit * 2,
    right: theme.spacing.unit * 2,
    color: 'white'
  }
});

class AssessmentsPage extends React.Component {

  state = {
    anchorEl: null,
    openMenuId: null,
    view: 'grid'
  };

  handleClick = (event, id) => {
    this.setState({ anchorEl: event.currentTarget, openMenuId: id });
  };

  handleClose = () => {
    this.setState({ anchorEl: null });
  };

  render() {
    const { classes, content, handleChangePage, handleChangeRowsPerPage , rowsPerPage, page, toggleDrawer, drawerState, contentType, spaceType, filters, removeFilter} = this.props;
    const emptyRows = rowsPerPage - Math.min(rowsPerPage, content.count - page * rowsPerPage);
    const { anchorEl, openMenuId, view } = this.state;

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
                  <TableCell>Title</TableCell>
                  <TableCell>Location(s)</TableCell>
                  <TableCell>Organization(s)</TableCell>
                  <TableCell>Participating Organization(s)</TableCell>
                  <TableCell>Cluster(s)/Sector(s)</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Assessment Date(s)</TableCell>
                  <TableCell>Data</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {content.data.map(n => {
                  let date = '';
                  if (n.date.from !== n.date.to) {
                    date = Moment(n.date.from).format('MMM DD YYYY') + ' to ' + Moment(n.date.to).format('MMM DD YYYY');
                  }
                  else {
                    date = Moment(n.date.from).format('MMM DD YYYY');
                  }
                  let reportData = [];
                  if (n.report && n.report.accessibility) {
                    if (n.report.file) {
                      reportData.push((<div>Report: <a href={n.report.file.url} target="_blank">{n.report.accessibility}</a></div>));
                    }
                    else {
                      reportData.push((<div>Report: {n.report.accessibility}</div>));
                    }
                  }
                  if (n.questionnaire && n.questionnaire.accessibility) {
                    if (n.questionnaire.file) {
                      reportData.push((<div>Report: <a href={n.questionnaire.file.url} target="_blank">{n.questionnaire.accessibility}</a></div>));
                    }
                    else {
                      reportData.push((<div>Questionnaire: {n.questionnaire.accessibility}</div>));
                    }
                  }
                  if (n.data && n.data.accessibility) {
                    if (n.data.file) {
                      reportData.push((<div>Data: <a href={n.data.file.url} target="_blank">{n.data.accessibility}</a></div>));
                    }
                    else {
                      reportData.push((<div>Data: {n.data.accessibility}</div>));
                    }
                  }
                  return (
                    <TableRow key={n.id}>
                      <TableCell component="th" scope="row">
                        <Link to={'/assessments/' + n.id}>{n.label}</Link>
                      </TableCell>
                      <TableCell>{n.locations && n.locations.length ? n.locations.map(o => {
                        return (<Link key={o.id} to={'/locations/' + o.id}>{o.label}</Link>);
                      }).reduce((prev, curr) => [prev, ', ', curr]) : ''}</TableCell>
                      <TableCell>{n.organizations && n.organizations.length ? n.organizations.map(o => {
                        return (<Link key={o.id} to={'/organizations/' + o.id}>{o.label}</Link>);
                      }).reduce((prev, curr) => [prev, ', ', curr]) : ''}</TableCell>
                      <TableCell>{n.participating_organizations && n.participating_organizations.length ? n.participating_organizations.map(o => {
                        return (<Link key={o.id} to={'/organizations/' + o.id}>{o.label}</Link>);
                      }).reduce((prev, curr) => [prev, ', ', curr]) : ''}</TableCell>
                      <TableCell>{n.bundles && n.bundles.length ? n.bundles.map(o => {
                        return (<Link key={o.id} to={'/groups/' + o.id}>{o.label}</Link>);
                      }).reduce((prev, curr) => [prev, ', ', curr]) : ''}</TableCell>
                      <TableCell>{n.status}</TableCell>
                      <TableCell>{date}</TableCell>
                      <TableCell>{reportData}</TableCell>
                    </TableRow>
                  );
                })}
                {emptyRows > 0 && (
                  <TableRow style={{ height: 48 * emptyRows }}>
                    <TableCell colSpan={8} />
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
              return (<Item item={n} viewMode="search" />);
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
        {this.props.doc && this.props.hasPermission('add', 'assessment', this.props.doc) ?
          <Link to="/assessments/new">
            <Button variant="fab" color="secondary" aria-label="Add" className={classes.fab}>
              <AddIcon />
            </Button>
          </Link> : '' }
      </div>
    );
  }
}

AssessmentsPage.propTypes = {
  classes: PropTypes.object.isRequired,
  content: PropTypes.object.isRequired
};

export default withSpace(withStyles(styles)(AssessmentsPage), {contentType: 'assessments', contentLabel: 'Assessments', sort: '-date'});
