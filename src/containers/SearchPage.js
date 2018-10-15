import React from 'react';
import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Avatar from '@material-ui/core/Avatar';
import ListItemText from '@material-ui/core/ListItemText';
import Paper from '@material-ui/core/Paper';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
import TablePagination from '@material-ui/core/TablePagination';

import TablePaginationActionsWrapped from '../components/TablePaginationActionsWrapped';
import Item from '../components/Item';
import HRInfoAPI from '../api/HRInfoAPI';
import HidAPI from '../api/HidAPI';

class SearchPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      items: [],
      count: 0,
      q: '',
      tab: 'documents',
      page: 0,
      rowsPerPage: 10,
    };
    this.hrinfoAPI = new HRInfoAPI();
    this.hidAPI = new HidAPI();
    this.getItems = this.getItems.bind(this);
    this.handleChangePage = this.handleChangePage.bind(this);
    this.handleChangeRowsPerPage = this.handleChangeRowsPerPage.bind(this);
  }

  getItems (input) {
    const type = this.state.tab;
    let params = {};
    if (type !== 'contacts') {
      params['filter[label][value]'] = input;
      params['filter[label][operator]'] = 'CONTAINS';
      params.sort = 'label';
      params.range = this.state.rowsPerPage;
      params.page = this.state.page + 1;
      return this.hrinfoAPI
        .get(type, params, false)
        .then(data => {
          return data;
        }).catch(function(err) {
            console.log("Fetch error: ", err);
        });
    }
    else {
      params.q = input;
      params.sort = 'name';
      params.limit = this.state.rowsPerPage;
      params.offset = this.state.page * this.state.rowsPerPage;
      return this.hidAPI
        .get('user', params)
        .then(data => {
          return data;
        });
    }
  }

  async componentDidMount() {
    if (this.props.match.params.q) {
      const items = await this.getItems(this.props.match.params.q);
      this.setState({
        items: items.data,
        count: items.count
      });
    }
  }

  async componentDidUpdate (prevProps, prevState, snapshot) {
    if (this.props.match.params.q &&
      (this.state.tab !== prevState.tab ||
      this.props.match.params.q !== prevProps.match.params.q ||
      this.state.page !== prevState.page ||
      this.state.rowsPerPage !== prevState.rowsPerPage)) {
      const items = await this.getItems(this.props.match.params.q);
      this.setState({
        items: items.data,
        count: items.count
      });
    }
  }

  handleChangePage (event, page) {
    this.setState({
      page
    });
  }

  handleChangeRowsPerPage(event) {
    this.setState({
      rowsPerPage: event.target.value
    });
  }

  render() {
    return (
      <Grid container spacing={24}>
        <Grid item xs={12} sm={3}>
          <Paper>
            <List>
              <ListItem button onClick={(e) => {this.setState({tab: 'documents', page: 0})}}>
                <Avatar>
                  <i className="icon-document" />
                </Avatar>
                <ListItemText primary="Documents" />
              </ListItem>
              <Divider />
              <ListItem button onClick={(e) => {this.setState({tab: 'infographics', page: 0})}}>
                <Avatar>
                  <i className="icon-map-pin" />
                </Avatar>
                <ListItemText primary="Infographics" />
              </ListItem>
              <Divider />
              <ListItem button onClick={(e) => {this.setState({tab: 'events', page: 0})}}>
                <Avatar>
                  <i className="icon-calendar" />
                </Avatar>
                <ListItemText primary="Events" />
              </ListItem>
              <Divider />
              <ListItem button onClick={(e) => {this.setState({tab: 'assessments', page: 0})}}>
                <Avatar>
                  <i className="icon-folder" />
                </Avatar>
                <ListItemText primary="Assessments" />
              </ListItem>
              <Divider />
              <ListItem button onClick={(e) => {this.setState({tab: 'contacts', page: 0})}}>
                <Avatar>
                  <i className="icon-users" />
                </Avatar>
                <ListItemText primary="Contacts" />
              </ListItem>
              <Divider />
              <ListItem button onClick={(e) => {this.setState({tab: 'offices', page: 0})}}>
                <Avatar>
                  <i className="icon-flag" />
                </Avatar>
                <ListItemText primary="Offices" />
              </ListItem>
              <Divider />
              <ListItem button onClick={(e) => {this.setState({tab: 'disasters', page: 0})}}>
                <Avatar>
                  <i className="icon-beaker" />
                </Avatar>
                <ListItemText primary="Disasters" />
              </ListItem>
              <Divider />
              <ListItem button onClick={(e) => {this.setState({tab: 'organizations', page: 0})}}>
                <Avatar>
                  <i className="icon-beaker" />
                </Avatar>
                <ListItemText primary="Organizations" />
              </ListItem>
            </List>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={9}>
          <Paper>
            <Typography variant="display3">{this.state.count + ' ' + this.state.tab + ' found'}</Typography>
            {this.state.items ? this.state.items.map((item) => {
              return (<Item key={item.id} item={item} viewMode="search" />);
            }) : ''}
            <TablePagination
              count={this.state.count}
              rowsPerPage={this.state.rowsPerPage}
              rowsPerPageOptions={[10,20,50]}
              page={this.state.page}
              onChangePage={this.handleChangePage}
              onChangeRowsPerPage={this.handleChangeRowsPerPage}
              ActionsComponent={TablePaginationActionsWrapped}
            />
          </Paper>
        </Grid>
      </Grid>
    );
  }
}

export default SearchPage;
