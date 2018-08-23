import React from 'react';
import { CardDeck } from 'reactstrap';
import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Avatar from '@material-ui/core/Avatar';
import ListItemText from '@material-ui/core/ListItemText';
import Paper from '@material-ui/core/Paper';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';

import Item from '../components/Item';
import HRInfoAPI from '../api/HRInfoAPI';
import HidAPI from '../api/HidAPI';

class SearchPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      items: [],
      q: '',
      tab: 'documents'
    };
    this.hrinfoAPI = new HRInfoAPI();
    this.hidAPI = new HidAPI();
    this.getItems = this.getItems.bind(this);
  }

  getItems (input) {
    const type = this.state.tab;
    let params = {};
    if (type !== 'contacts') {
      params['filter[label][value]'] = input;
      params['filter[label][operator]'] = 'CONTAINS';
      params['sort'] = 'label';
      params['range'] = 10;
      return this.hrinfoAPI
        .get(type, params)
        .then(data => {
          let out = [];
          data.data.forEach(function (item) {
            item.type = type;
            out.push(item);
          });
          return out;
        }).catch(function(err) {
            console.log("Fetch error: ", err);
        });
    }
    else {
      params['q'] = input;
      params['sort'] = 'name';
      params['limit'] = 10;
      return this.hidAPI
        .get('user', params)
        .then(data => {
          data.data.forEach(function (item) {
            item.type = 'user';
          });
          return data.data;
        });
    }
  }

  async componentDidMount() {
    if (this.props.match.params.q) {
      const items = await this.getItems(this.props.match.params.q);
      this.setState({
        items: items
      });
    }
  }

  async componentDidUpdate (prevProps, prevState, snapshot) {
    if (this.props.match.params.q && (this.state.tab !== prevState.tab || this.props.match.params.q !== prevProps.match.params.q)) {
      const items = await this.getItems(this.props.match.params.q);
      this.setState({
        items: items
      });
    }
  }

  render() {
    return (
      <Grid container spacing={24}>
        <Grid item xs={12} sm={3}>
          <Paper>
            <List>
              <ListItem button onClick={(e) => {this.setState({tab: 'documents'})}}>
                <Avatar>
                  <i className="icon-document" />
                </Avatar>
                <ListItemText primary="Documents" />
              </ListItem>
              <Divider />
              <ListItem button onClick={(e) => {this.setState({tab: 'infographics'})}}>
                <Avatar>
                  <i className="icon-map-pin" />
                </Avatar>
                <ListItemText primary="Infographics" />
              </ListItem>
              <Divider />
              <ListItem button onClick={(e) => {this.setState({tab: 'events'})}}>
                <Avatar>
                  <i className="icon-calendar" />
                </Avatar>
                <ListItemText primary="Events" />
              </ListItem>
              <Divider />
              <ListItem button onClick={(e) => {this.setState({tab: 'assessments'})}}>
                <Avatar>
                  <i className="icon-folder" />
                </Avatar>
                <ListItemText primary="Assessments" />
              </ListItem>
              <Divider />
              <ListItem button onClick={(e) => {this.setState({tab: 'contacts'})}}>
                <Avatar>
                  <i className="icon-users" />
                </Avatar>
                <ListItemText primary="Contacts" />
              </ListItem>
              <Divider />
              <ListItem button onClick={(e) => {this.setState({tab: 'offices'})}}>
                <Avatar>
                  <i className="icon-flag" />
                </Avatar>
                <ListItemText primary="Offices" />
              </ListItem>
              <Divider />
              <ListItem button onClick={(e) => {this.setState({tab: 'disasters'})}}>
                <Avatar>
                  <i className="icon-beaker" />
                </Avatar>
                <ListItemText primary="Disasters" />
              </ListItem>
              <Divider />
              <ListItem button onClick={(e) => {this.setState({tab: 'organizations'})}}>
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
            <Typography variant="display3">{this.state.tab.charAt(0).toUpperCase() + this.state.tab.slice(1)}</Typography>
            {this.state.items ? this.state.items.map((item) => {
              return (<Item key={item.id} item={item} viewMode="search" />);
            }) : ''}
          </Paper>
        </Grid>
      </Grid>
    );
  }
}

export default SearchPage;
