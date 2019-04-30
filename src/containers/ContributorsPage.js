import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import moment from 'moment';
import FormControl      from '@material-ui/core/FormControl';
import FormLabel        from '@material-ui/core/FormLabel';
import MomentUtils from '@date-io/moment';
import MuiPickersUtilsProvider        from 'material-ui-pickers/MuiPickersUtilsProvider';
import DatePicker                     from 'material-ui-pickers/DatePicker';

import HRInfoAPI from '../api/HRInfoAPI';
import HidAPI from '../api/HidAPI';

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

class ContributorsPage extends React.Component {

  state = {
    users: [],
    from: 0,
    to: 0
  };

  hrinfoApi = new HRInfoAPI();

  hidApi = new HidAPI();

  handleSubmit = async (event) => {
    event.preventDefault();
    const params = {
      'filter[created][value][0]': this.state.from,
      'filter[created][value][1]': this.state.to,
      'filter[created][operator]': 'BETWEEN',
      fields: 'id,label,author.hid'
    };
    const that = this;
    let users = [], rawData = [], numbers = {}, promises = [];
    this.setState({
      users: users
    });
    await this
      .hrinfoApi
      .getAll('assessments', params, false)
      .then(assessments => {
        rawData = rawData.concat(assessments);
        return this.hrinfoApi.getAll('events', params, false);
      })
      .then(events => {
        rawData = rawData.concat(events);
        return this.hrinfoApi.getAll('documents', params, false);
      })
      .then(documents => {
        rawData = rawData.concat(documents);
        return this.hrinfoApi.getAll('infographics', params, false);
      })
      .then(infographics => {
        rawData = rawData.concat(infographics);
        for (const item of rawData) {
          let hid = item.author ? item.author.hid : '';
          if (hid) {
            if (!numbers[hid]) {
              numbers[hid] = 0;
            }
            numbers[hid]++;
          }
        }
        Object.keys(numbers).forEach(function (hid) {
          promises.push(that.hidApi.getItem('user', hid));
        });
        return Promise.all(promises);
      })
      .then(values => {
        values.forEach(function (user) {
          user.number = numbers[user.id];
          users.push(user);
        });
        this.setState({
          users: users
        });
      });
  };

  componentDidMount() {
    let date = new Date(), y = date.getFullYear(), m = date.getMonth();
    let firstDay = new Date(y, m, 1);
    let lastDay = new Date(y, m + 1, 0);

    this.setState({
      from: moment(firstDay).unix(),
      to: moment(lastDay).unix()
    });
  }

  render() {
    const { classes } = this.props;
    let row = 0;

    return (
      <Paper>
        <div>
          <FormControl margin = "normal">
            <FormLabel htmlFor="from">From</FormLabel>
            <MuiPickersUtilsProvider utils={MomentUtils}>
              <DatePicker
                id             = "from"
                name           = "from"
                label          = "Date"
                format         = "DD/MM/YYYY"
                value          = {this.state.from ? this.state.from * 1000 : ''}
                invalidLabel   = ""
                autoOk
                onChange       = {(e) => this.setState({from: moment(e).unix()})}
                leftArrowIcon  = {<i className="icon-arrow-left" />}
                rightArrowIcon = {<i className="icon-arrow-right" />}
                InputLabelProps={{
                    shrink: true,
                }}
              />
            </MuiPickersUtilsProvider>
          </FormControl>
          <FormControl margin = "normal">
            <FormLabel htmlFor="to">To</FormLabel>
            <MuiPickersUtilsProvider utils={MomentUtils}>
              <DatePicker
                id             = "to"
                name           = "to"
                label          = "Date"
                format         = "DD/MM/YYYY"
                value          = {this.state.to ? this.state.to * 1000 : ''}
                invalidLabel   = ""
                autoOk
                onChange       = {(e) => this.setState({to: moment(e).unix()})}
                leftArrowIcon  = {<i className="icon-arrow-left" />}
                rightArrowIcon = {<i className="icon-arrow-right" />}
                InputLabelProps={{
                    shrink: true,
                }}
              />
            </MuiPickersUtilsProvider>
          </FormControl>
          <Button color="primary" variant="contained" onClick={this.handleSubmit}>Submit</Button>
          <p>Depending on the date range you chose, results can be slow to come. Be patient !</p>
        </div>
        <Table className={classes.table}>
          <TableHead>
            <TableRow>
              <TableCell>Row</TableCell>
              <TableCell>User</TableCell>
              <TableCell>Organization</TableCell>
              <TableCell># of content items published</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {this.state.users.map(user => {
              row++;
              return (
                <TableRow>
                  <TableCell>{row}</TableCell>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.organization ? user.organization.name : ''}</TableCell>
                  <TableCell>{user.number}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Paper>
    );
  }
}

ContributorsPage.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(ContributorsPage);
