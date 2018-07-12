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
import IconButton from '@material-ui/core/IconButton';
import FirstPageIcon from '@material-ui/icons/FirstPage';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import LastPageIcon from '@material-ui/icons/LastPage';

import HRInfoAPI from './HRInfoAPI';
import HidAPI from './HidAPI';

const actionsStyles = theme => ({
  root: {
    flexShrink: 0,
    color: theme.palette.text.secondary,
    marginLeft: theme.spacing.unit * 2.5,
  },
});

class TablePaginationActions extends React.Component {
  handleFirstPageButtonClick = event => {
    this.props.onChangePage(event, 0);
  };

  handleBackButtonClick = event => {
    this.props.onChangePage(event, this.props.page - 1);
  };

  handleNextButtonClick = event => {
    this.props.onChangePage(event, this.props.page + 1);
  };

  handleLastPageButtonClick = event => {
    this.props.onChangePage(
      event,
      Math.max(0, Math.ceil(this.props.count / this.props.rowsPerPage) - 1),
    );
  };

  render() {
    const { classes, count, page, rowsPerPage, theme } = this.props;

    return (
      <div className={classes.root}>
        <IconButton
          onClick={this.handleFirstPageButtonClick}
          disabled={page === 0}
          aria-label="First Page"
        >
          {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
        </IconButton>
        <IconButton
          onClick={this.handleBackButtonClick}
          disabled={page === 0}
          aria-label="Previous Page"
        >
          {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
        </IconButton>
        <IconButton
          onClick={this.handleNextButtonClick}
          disabled={page >= Math.ceil(count / rowsPerPage) - 1}
          aria-label="Next Page"
        >
          {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
        </IconButton>
        <IconButton
          onClick={this.handleLastPageButtonClick}
          disabled={page >= Math.ceil(count / rowsPerPage) - 1}
          aria-label="Last Page"
        >
          {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
        </IconButton>
      </div>
    );
  }
}

TablePaginationActions.propTypes = {
  classes: PropTypes.object.isRequired,
  count: PropTypes.number.isRequired,
  onChangePage: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
  theme: PropTypes.object.isRequired,
};

const TablePaginationActionsWrapped = withStyles(actionsStyles, { withTheme: true })(
  TablePaginationActions,
);

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

    constructor(props) {
      super(props);

      this.state = {
        doc: null,
        list: null,
        contacts: {
          count: 0,
          data: []
        },
        page: 0,
        rowsPerPage: 50
      };
      this.hrinfoAPI = new HRInfoAPI();
      this.hidAPI = new HidAPI();
      this.handleChangePage = this.handleChangePage.bind(this);
      this.handleChangeRowsPerPage = this.handleChangeRowsPerPage.bind(this);
    }

    async handleChangePage (event, page) {
      let params = {
        limit: this.state.rowsPerPage,
        sort: 'name',
        offset: page * this.state.rowsPerPage
      };
      params['operations.list'] = this.state.list._id;
      this.setState({
        page,
        contacts: await this.hidAPI.get('user', params)
      });
    }

    async handleChangeRowsPerPage(event) {
      let params = {
        limit: event.target.value,
        sort: 'name',
        offset: this.state.page * event.target.value
      };
      params['operations.list'] = this.state.list._id;
      this.setState({
        rowsPerPage: event.target.value,
        contacts: await this.hidAPI.get('user', params)
      });
    }

    async componentDidMount() {
      if (this.props.match.params.id) {
        const doc = await this.hrinfoAPI.getItem('operations', this.props.match.params.id);
        const listParams = {
          type: 'operation',
          remote_id: doc.id
        };
        const lists = await this.hidAPI.get('list', listParams);
        const list = lists.data[0];
        let params = {
          limit: this.state.rowsPerPage,
          sort: 'name'
        };
        params['operations.list'] = list._id;
        const contacts = await this.hidAPI.get('user', params);
        this.setState({
          doc: doc,
          list: list,
          contacts: contacts,
        });
        this.props.setGroup(doc);
        const breadcrumb = [
          {
            href: '/operations/' + doc.id,
            label: doc.label
          },
          {
            href: '/operations/' + doc.id + '/contacts',
            label: 'Contacts'
          }
        ];
        this.props.setBreadcrumb(breadcrumb);
      }
    }

    componentWillUnmount() {
      this.props.setGroup(null);
      this.props.setBreadcrumb([]);
    }

    render() {
      const { classes } = this.props;
      const { rowsPerPage, page } = this.state;
      const emptyRows = rowsPerPage - Math.min(rowsPerPage, this.state.contacts.count - page * rowsPerPage);

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
              {this.state.contacts.data.map(n => {
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
                  count={this.state.contacts.count}
                  rowsPerPage={rowsPerPage}
                  rowsPerPageOptions={[50,100,150,200]}
                  page={page}
                  onChangePage={this.handleChangePage}
                  onChangeRowsPerPage={this.handleChangeRowsPerPage}
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
};

export default withStyles(styles)(ContactsPage);
