import React                  from 'react';
import { RRule, rrulestr }    from 'rrule';
import moment from 'moment';

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
    excludeDate: ''
  };

  handleChange = (event, type = null) => {
    let name  = event.target ? event.target.name  : '';
    let value = event.target ? event.target.value : event.format();
    if (name === 'exclude') {
      value = event.target.checked;
    }
    if (name === '' && (type === 'UNTIL' || type === 'excludeDate')) {
      const parts = value.toString().split('T');
      value = parts[0].replace(/-/gi, '') + 'T000000Z';
      if (type === 'UNTIL') {
        name = 'until';
      }
      else {
        name = 'excludeDate';
      }
    }

    let newState = {...this.state, [name]: value};

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
      this.props.onChange(options);
    }
  }

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
            <FormControl margin = "normal">
              <MuiPickersUtilsProvider utils={MomentUtils}>
                <DatePicker
                  id             = "excludeDate"
                  name           = "excludeDate"
                  label          = "Date"
                  format         = "DD/MM/YYYY"
                  value          = {this.state.excludeDate ? this.state.excludeDate : ''}
                  invalidLabel   = ""
                  autoOk
                  onChange       = {(e) => this.handleChange(e, 'excludeDate')}
                  leftArrowIcon  = {<i className="icon-arrow-left" />}
                  rightArrowIcon = {<i className="icon-arrow-right" />}
                  InputLabelProps={{
                      shrink: true,
                  }}
                />
              </MuiPickersUtilsProvider>
            </FormControl>
          </div> }
        </CardContent>
      </Card>
    );
  }
}

export default RRuleGenerator;
