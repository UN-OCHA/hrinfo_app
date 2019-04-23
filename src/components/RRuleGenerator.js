import React                  from 'react';
import { RRule, rrulestr }    from 'rrule';
import moment from 'moment';
import { translate } from 'react-i18next';

import FormControl            from '@material-ui/core/FormControl';
import InputLabel             from '@material-ui/core/InputLabel';
import TextField              from '@material-ui/core/TextField';
import Card                   from '@material-ui/core/Card';
import CardContent            from '@material-ui/core/CardContent';
import Select                 from '@material-ui/core/Select';
import MenuItem               from '@material-ui/core/MenuItem';
import Divider                from '@material-ui/core/Divider';
import InputAdornment         from '@material-ui/core/InputAdornment';
import FormControlLabel  from '@material-ui/core/FormControlLabel';
import Checkbox     from '@material-ui/core/Checkbox';
import Button from '@material-ui/core/Button';

//Material date picker
import MomentUtils from '@date-io/moment';
import MuiPickersUtilsProvider from 'material-ui-pickers/MuiPickersUtilsProvider';
import DatePicker              from 'material-ui-pickers/DatePicker';

class RRuleGenerator extends React.Component {

  state = {
    rrule: '',
    freq: '',
    interval: '',
    end: 'COUNT',
    count: 1,
    until: moment.utc().toString(),
    exclude: false,
    exDates: [],
    exDatesNumber: 1,
    include: false,
    inDates: [],
    inDatesNumber: 1,
  };

  handleChange = (event, type = null, row) => {
    let name  = event.target ? event.target.name  : '';
    let value = event.target ? event.target.value : event.format();
    let newState = {...this.state};
    if (name === '') {
      const parts = value.toString().split('T');
      value = parts[0].replace(/-/gi, '') + 'T000000Z';
      if (type === 'UNTIL') {
        newState.until = value;
      }
      else {
        const dates = this.state[type].splice(0);
        dates[row] = value;
        newState[type] = dates;
      }
    }
    else {
      if (name === 'exclude' || name === 'include') {
        newState[name] = event.target.checked;
      }
      else {
        newState[name] = value;
      }
    }
    this.setState(newState);

    if (this.props.onChange) {
      const options = {
        freq: newState.freq,
        interval: newState.interval
      };
      if (newState.end === 'COUNT') {
        options.count = newState.count;
      }
      if (newState.end === 'UNTIL' && newState.until !== '') {
        options.until = moment(newState.until).toDate();
      }
      if (newState.exclude === true && newState.exDates.length > 0) {
        options.exclude = true;
        options.exDates = newState.exDates.map((date) => {
          return moment(date).toDate();
        });
      }
      if (newState.include === true && newState.inDates.length > 0) {
        options.include = true;
        options.inDates = newState.inDates.map((date) => {
          return moment(date).toDate();
        });
      }
      this.props.onChange(options);
    }
  };

  getRow = (number, type) => {
    return (
      <div key={number}>
        <FormControl margin = "normal">
          <MuiPickersUtilsProvider utils={MomentUtils}>
            <DatePicker
              label          = "Date"
              format         = "DD/MM/YYYY"
              value          = {this.state[type][number] ? this.state[type][number] : ''}
              invalidLabel   = ""
              autoOk
              onChange       = {(e) => this.handleChange(e, type, number)}
              leftArrowIcon  = {<i className="icon-arrow-left" />}
              rightArrowIcon = {<i className="icon-arrow-right" />}
              InputLabelProps={{
                  shrink: true,
              }}
            />
          </MuiPickersUtilsProvider>
        </FormControl>
      </div>
    );
  };

  onAddBtnClick = (event, type) => {
    this.setState({
      [type]: this.state[type] + 1
    });
  };

  componentDidMount() {
    if (this.props.value && Object.keys(this.props.value).length) {
      let rrule = rrulestr(this.props.value);
      let newState = {
        freq: rrule.options.freq,
        interval: rrule.options.interval,
        end: rrule.options.count ? 'COUNT' : 'UNTIL',
        count: rrule.options.count,
        until: rrule.options.until
      };
      this.setState(newState);
    }
  }

  render() {
    const { t } = this.props;
    const interval = (this.state.freq !== RRule.YEARLY && this.state.freq !== '') ?
    (
      <FormControl>
        <TextField id         = "interval"
                   name       = "interval"
                   margin     = "normal"
                   value      = {this.state.interval}
                   onChange   = {(e) => this.handleChange(e, 'INTERVAL')}
                   InputProps = {{
                    startAdornment: <InputAdornment position="start">every</InputAdornment>,
                    endAdornment:   this.state.freq === RRule.MONTHLY ?
                                      <InputAdornment position="end">month(s)</InputAdornment>
                                    : (this.state.freq === RRule.WEEKLY ?
                                        <InputAdornment position="end">week(s)</InputAdornment>
                                      : (this.state.freq === RRule.DAILY ?
                                          <InputAdornment position="end">day(s)</InputAdornment>
                                        : (this.state.freq === RRule.HOURLY &&
                                            <InputAdornment position="end">hour(s)</InputAdornment>
                                          : ''
                                        )
                                      )
                                    )

                  }}
        />
      </FormControl>
    ) : '';

    const after = (this.state.end === 'COUNT') ?
    (
      <FormControl>
        <TextField id         = "count"
                   name       = "count"
                   margin     = "normal"
                   value      = {this.state.count}
                   onChange   = {(e) => this.handleChange(e, 'COUNT')}
                   InputProps = {{
                    endAdornment:   <InputAdornment position="end">execution(s)</InputAdornment>
                  }}
        />
      </FormControl>
    ) : '';

    const ondate = (this.state.end === 'UNTIL') ?
    (
      <FormControl  margin="normal">
        <MuiPickersUtilsProvider utils={MomentUtils}>
          <DatePicker
            id             = "until"
            name           = "until"
            format         = "DD/MM/YYYY"
            placeholder    = "DD/MM/YYYY"
            value          = {this.state.until}
            invalidLabel   = ""
            autoOk
            onChange       = {(e) => this.handleChange(e, 'UNTIL')}
            leftArrowIcon  = {<i className="icon-arrow-left" />}
            rightArrowIcon = {<i className="icon-arrow-right" />}
          />
        </MuiPickersUtilsProvider>
      </FormControl>
    ) : '';

    let exRows = [];
    for (let i = 0; i < this.state.exDatesNumber; i++) {
      exRows.push(this.getRow(i, 'exDates'));
    }

    let inRows = [];
    for (let i = 0; i < this.state.inDatesNumber; i++) {
      inRows.push(this.getRow(i, 'inDates'));
    }

    return (
      <Card className="rrule-container">
        <CardContent>
          {/* Frequency */}
          <FormControl fullWidth>
            <InputLabel htmlFor="freq">Frequency</InputLabel>
            <Select value    = {this.state.freq}
                    onChange = {(e) => this.handleChange(e, 'FREQ')}
                    inputProps = {{
                      name: 'freq',
                      id: 'freq',
                    }}
            >
              <MenuItem value={RRule.YEARLY}>Yearly</MenuItem>
              <MenuItem value={RRule.MONTHLY}>Monthly</MenuItem>
              <MenuItem value={RRule.WEEKLY}>Weekly</MenuItem>
              <MenuItem value={RRule.DAILY}>Daily</MenuItem>
              <MenuItem value={RRule.HOURLY}>Hourly</MenuItem>
            </Select>
          </FormControl>
          {interval}
        </CardContent>
        <Divider />
        <CardContent>

          {/* End */}
          <FormControl fullWidth>
            <InputLabel htmlFor="end">End</InputLabel>
            <Select value    = {this.state.end}
                    onChange = {(e) => this.handleChange(e)}
                    inputProps = {{
                      name: 'end',
                      id: 'end',
                    }}
            >
              <MenuItem value={'COUNT'}>After</MenuItem>
              <MenuItem value={'UNTIL'}>On Date</MenuItem>
            </Select>
          </FormControl>
          {after}
          {ondate}
        </CardContent>
        <CardContent>
          <div>
            <FormControlLabel
               control = {
                 <Checkbox name     = "exclude"
                           color    = "primary"
                           onChange = {(e) => this.handleChange(e)}
                           checked  = {this.state.exclude}
                 />
               }
               label = "Exclude dates"
            />
            {this.state.exclude === true &&
              <div>
                {exRows}
                <div>
                  <Button variant="outlined" onClick={(e) => this.onAddBtnClick(e, 'exDatesNumber')}>
                    {t('add_another')}
                  </Button>
                </div>
              </div> }
          </div>
          <div>
            <FormControlLabel
               control = {
                 <Checkbox name     = "include"
                           color    = "primary"
                           onChange = {(e) => this.handleChange(e)}
                           checked  = {this.state.include}
                 />
               }
               label = "Include dates"
            />
            {this.state.include === true &&
              <div>
                {inRows}
                <div>
                  <Button variant="outlined" onClick={(e) => this.onAddBtnClick(e, 'inDatesNumber')}>
                    {t('add_another')}
                  </Button>
                </div>
              </div> }
          </div>
        </CardContent>
      </Card>
    );
  }
}

export default translate('forms')(RRuleGenerator);
