import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import moment from 'moment';
import FormControl      from '@material-ui/core/FormControl';
import FormLabel        from '@material-ui/core/FormLabel';
import MomentUtils                    from 'material-ui-pickers/utils/moment-utils';
import MuiPickersUtilsProvider        from 'material-ui-pickers/utils/MuiPickersUtilsProvider';
import DatePicker                     from 'material-ui-pickers/DatePicker';

import HRInfoAPI from '../api/HRInfoAPI';

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

class ContributionsPage extends React.Component {

  state = {
    data: {},
    from: 0,
    to: 0
  };

  hrinfoApi = new HRInfoAPI();

  componentDidMount() {
    let date = new Date(), y = date.getFullYear(), m = date.getMonth();
    let firstDay = new Date(y, m, 1);
    let lastDay = new Date(y, m + 1, 0);

    this.setState({
      from: moment(firstDay).unix(),
      to: moment(lastDay).unix()
    });
  }

  async componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevState.from !== this.state.from || prevState.to !== this.state.to) {
      const params = {
        'filter[created][value][0]': this.state.from,
        'filter[created][value][1]': this.state.to,
        'filter[created][operator]': 'BETWEEN',
        fields: 'id,label,operation.id,operation.label,bundles.id,bundles.label'
      };
      let data = {}, rawData = [];
      this.setState({
        data: data
      });
      await this
        .hrinfoApi
        .getAll('assessments', params)
        .then(assessments => {
          rawData = rawData.concat(assessments);
          return this.hrinfoApi.getAll('events', params);
        })
        .then(events => {
          rawData = rawData.concat(events);
          return this.hrinfoApi.getAll('documents', params);
        })
        .then(documents => {
          rawData = rawData.concat(documents);
          return this.hrinfoApi.getAll('infographics', params);
        })
        .then(infographics => {
          rawData = rawData.concat(infographics);
          rawData.forEach(function (item) {
            let opLabel = item.operation[0] ? item.operation[0].label : '';
            if (opLabel !== '') {
              if (!data[opLabel]) {
                data[opLabel] = {};
                data[opLabel]['All'] = {};
                data[opLabel]['All'][item.type] = 0;
              }
              item.bundles.forEach(function (b) {
                if (b && b.label) {
                  if (!data[opLabel][b.label]) {
                    data[opLabel][b.label] = {};
                    data[opLabel][b.label][item.type] = 0;
                  }
                  data[opLabel][b.label][item.type]++;
                }
              });
              if (!data[opLabel]['All'][item.type]) {
                data[opLabel]['All'][item.type] = 0;
              }
              data[opLabel]['All'][item.type]++;
            }
          });
          this.setState({
            data: data
          });
        });
    }
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
          <p>Depending on the date range you chose, results can be slow to come. Be patient !</p>
        </div>
        <Table className={classes.table}>
          <TableHead>
            <TableRow>
              <TableCell>Row</TableCell>
              <TableCell>Operation</TableCell>
              <TableCell>Group</TableCell>
              <TableCell>Assessments</TableCell>
              <TableCell>Events</TableCell>
              <TableCell>Documents</TableCell>
              <TableCell>Infographics</TableCell>
              <TableCell>Total</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Object.keys(this.state.data).sort().map(op => {
              return Object.keys(this.state.data[op]).sort().map(b => {
                row++;
                let nbAssessments = this.state.data[op][b]['assessments'] ? this.state.data[op][b]['assessments'] : 0;
                let nbEvents = this.state.data[op][b]['events'] ? this.state.data[op][b]['events'] : 0;
                let nbDocuments = this.state.data[op][b]['documents'] ? this.state.data[op][b]['documents'] : 0;
                let nbInfographics = this.state.data[op][b]['infographics'] ? this.state.data[op][b]['infographics'] : 0;
                let total = nbAssessments + nbEvents + nbDocuments + nbInfographics;
                return (
                  <TableRow>
                    <TableCell>{row}</TableCell>
                    <TableCell>{op}</TableCell>
                    <TableCell>{b}</TableCell>
                    <TableCell>{nbAssessments}</TableCell>
                    <TableCell>{nbEvents}</TableCell>
                    <TableCell>{nbDocuments}</TableCell>
                    <TableCell>{nbInfographics}</TableCell>
                    <TableCell>{total}</TableCell>
                  </TableRow>
                );
              });
            })}
          </TableBody>
        </Table>
      </Paper>
    );
  }
}

ContributionsPage.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(ContributionsPage);
