import React  from 'react';
import lodash from 'lodash';
import { RRule, RRuleSet} from 'rrule';

import moment                  from 'moment';
import MaterialSelect          from './MaterialSelect';
import RRuleGenerator                   from './RRuleGenerator';
import 'moment-timezone';

// Material
import FormControl  from '@material-ui/core/FormControl';
import FormControlLabel  from '@material-ui/core/FormControlLabel';
import FormLabel    from '@material-ui/core/FormLabel';
import Checkbox     from '@material-ui/core/Checkbox';
import Typography   from '@material-ui/core/Typography';
import Card         from '@material-ui/core/Card';
import CardContent  from '@material-ui/core/CardContent';
import TextField    from '@material-ui/core/TextField';

//Material date picker
import MomentUtils from '@date-io/moment';
import MuiPickersUtilsProvider        from 'material-ui-pickers/MuiPickersUtilsProvider';
import DatePicker                     from 'material-ui-pickers/DatePicker';

class EventDate extends React.Component {

  state = {
    items   : [],
    endDate : true,
    allDay  : false,
    repeats : false,
    val : {
      value  : moment.utc(),
      value2    : moment.utc(),
      timezone    : {value: 'UTC', label: 'UTC'},
      rrule       : '',
    },
    rrule     : '',
    status    : 'initial',
  };

  changeState = (newState) => {
    if (this.state.status === 'initial') {
      newState.status = 'ready';
    }
    this.setState(newState);

    if (this.props.onChange) {
      const dates = [];
      if (newState.val && typeof newState.val.rrule !== 'undefined' && newState.val.rrule !== '') {
        const rruleSetStart = new RRuleSet();
        const rruleSetEnd = new RRuleSet();
        const optionsStart = {...newState.val.rrule, dtstart: moment.utc(newState.val.value).toDate()};
        rruleSetStart.rrule(new RRule(optionsStart));
        let datesEnd = [];
        if (newState.val.value2 && newState.val.value2 !== newState.val.value) {
          const optionsEnd = {...newState.val.rrule, dtstart: moment.utc(newState.val.value2).toDate()};
          rruleSetEnd.rrule(new RRule(optionsEnd));
          datesEnd = rruleSetEnd.all();
        }
        rruleSetStart.all().forEach(function (date, index) {
          let dateEnd = date;
          if (datesEnd.length > 0) {
            dateEnd = datesEnd[index];
          }
          dates.push({
            value: date,
            value2: dateEnd,
            timezone: newState.val.timezone.value,
            rrule: rruleSetStart.valueOf().join("\r\n")
          });
        });
      }
      else {
        dates.push(newState.val);
      }
      this.props.onChange(dates);
    }
  };

  // Checkbox
  setCheckbox = (event) => {
    const target  = event.target;
    const value   = target.checked;
    const name    = target.name;
    let newState  = {};

    newState[name] = value;

    if (target.name === 'allDay' && value) {
      let value = this.state.val.value.clone();
      value.hours(0);
      value.minutes(0);
      value.seconds(0);

      let value2 = this.state.val.value2.clone();
      value2.hours(0);
      value2.minutes(0);
      value2.seconds(0);

      if (this.state.endDate === false) {
        value2 = value.clone();
      }
      newState.val = {...this.state.val, value: value, value2: value2};
    }
    if (target.name === 'endDate') {
      newState.val = {...this.state.val, value2: this.state.val.value.clone()};
    }
    this.changeState(newState);
  };

  //Changes
  handleChange = (event, type) => {
    let value: Date;
    let val = {};
    if (!event.target) {
      // FROM
      if (type === 'from') {
        val = {...this.state.val, value: event};
      }
      // TO
      if (type === 'to') {
        val = {...this.state.val, value2: event};
      }
    }
    else {
      value = event.target.value;
      // FROM
      if (type === 'from') {
        let from = this.state.val.value.clone();
        from.hours(value.split(":")[0]);
        from.minutes(value.split(":")[1]);
        from.seconds(0);
        val = {...this.state.val, value: from};
      }
      // TO
      if (type === 'to') {
        let to = this.state.val.value2.clone();
        to.hours(value.split(":")[0]);
        to.minutes(value.split(":")[1]);
        to.seconds(0);
        val = {...this.state.val, value2: to};
      }
    }

    if (!this.state.endDate) {
      val.value2 = val.value.clone();
    }

    this.changeState({
      val : val,
      // check if time has changed for all allDay
      allDay: this.isAllDay(val.value, val.value2)
    });
  };

  // rrule
  setRrule = (rrule) => {
    let val   = {...this.state.val, rrule: rrule};

    this.changeState({
      val : val
    });
  };

  // Set timezone from departure to arrival
  setTimezone = (timezone) => {
    let val         = {...this.state.val, timezone: timezone};

    this.changeState({
      val: val
    });
  };

  getTime = (date) => {
    let hours   = ("0" + date.hours()).slice(-2);
    let minutes = ("0" + date.minutes()).slice(-2);
    return (hours + ":" + minutes);
  };

  isAllDay = (date_from, date_to) => {
    let sum_from = date_from ? date_from.hours() + date_from.minutes() : 0;
    let sum_to   = date_to ? date_to.hours() + date_to.minutes() : 0;
    return sum_from + sum_to === 0;
  };

  // update component
  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.props.timezone && prevProps.timezone !== this.props.timezone) {
      this.setTimezone({value: this.props.timezone, label: this.props.timezone});
    }
    if (this.props.value && Object.keys(this.props.value).length && this.state.status === 'initial') {
      let val = this.props.value[0] ? lodash.cloneDeep(this.props.value[0]) : lodash.cloneDeep(this.props.value);
      moment.tz.names().forEach (function (timezone) {
        if (timezone === val.timezone) {
          val.timezone = {value: timezone, label: timezone};
        }
      });
      if (val.value && typeof val.value !== 'object') {
        val.value = moment.utc(val.value);
      }
      if (val.value2 && typeof val.value2 !== 'object') {
        val.value2 = moment.utc(val.value2);
      }
      let newState = {
        val       : val,
        endDate   : val.value.unix() !== val.value2.unix(),
        allDay    : this.isAllDay(val.value, val.value2),
        repeats   : (val.rrule ? true : false),
        status    : 'ready'
      };
      this.setState(newState);
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (JSON.stringify(this.state) !== JSON.stringify(nextState) || JSON.stringify(this.props) !== JSON.stringify(nextProps)) {
      return true;
    }
    return false;
  }

  render() {
    return (
      <Card className="card-container">
        <CardContent className="date-container">
          {/* Date 'from' */}
          <FormControl margin = "normal">
            <FormLabel htmlFor="from">From</FormLabel>
            <MuiPickersUtilsProvider utils={MomentUtils}>
              <DatePicker
                id             = "from"
                name           = "from"
                label          = "Date"
                format         = "DD/MM/YYYY"
                value          = {this.state.val.value ? this.state.val.value : ''}
                invalidLabel   = ""
                autoOk
                onChange       = {(e) => this.handleChange(e, 'from')}
                leftArrowIcon  = {<i className="icon-arrow-left" />}
                rightArrowIcon = {<i className="icon-arrow-right" />}
                InputLabelProps={{
                    shrink: true,
                }}
              />
            </MuiPickersUtilsProvider>
            {!this.state.allDay &&
              <TextField
                 id             = "time_from"
                 label          = "Time"
                 type           = "time"
                 disabled       = {!this.state.val.value}
                 value          = {this.state.val.value ? this.getTime(this.state.val.value) : ''}
                 onChange       = {(e) => this.handleChange(e, 'from')}
                 InputLabelProps={{
                     shrink: true,
                 }}
              />
            }
          </FormControl>

      {/* Date 'To'*/}
        {this.state.endDate === true &&
          <FormControl  margin="normal">
            <FormLabel htmlFor="to">To</FormLabel>
            <MuiPickersUtilsProvider utils={MomentUtils}>
              <DatePicker
                id             = "to"
                name           = "to"
                label          = "Date"
                format         = "DD/MM/YYYY"
                minDate        = {this.state.val.value}
                value          = {this.state.val.value2 ? this.state.val.value2 : ''}
                invalidLabel   = ""
                autoOk
                onChange       = {(e) => this.handleChange(e, 'to')}
                leftArrowIcon  = {<i className="icon-arrow-left" />}
                rightArrowIcon = {<i className="icon-arrow-right" />}
                InputLabelProps={{
                    shrink: true,
                }}
                />
            </MuiPickersUtilsProvider>
            {!this.state.allDay &&
              <TextField
                 id             = "time_to"
                 label          = "Time"
                 type           = "time"
                 disabled       = {!this.state.val.value2}
                 value          = {this.state.val.value2 ? this.getTime(this.state.val.value2) : ''}
                 onChange       = {(e) => this.handleChange(e, 'to')}
                 InputLabelProps={{
                     shrink: true,
                 }}
              />
            }
          </FormControl>
        }
        </CardContent>

       {/* 'All day' checkbox & 'Repeat' checkbox */}
        <CardContent className = "date-container">
          <FormControlLabel
            control = {
              <Checkbox name     = "endDate"
                        color    = "primary"
                        onChange = {this.setCheckbox}
                        checked  = {this.state.endDate}
              />
            }
            label   = "End date"
          />
          <FormControlLabel
            control = {
              <Checkbox name     = "allDay"
                        color    = "primary"
                        onChange = {this.setCheckbox}
                        disabled = {!this.state.val.value}
                        checked  = {this.state.allDay}
              />
            }
            label   = "All day"
          />
         <FormControlLabel
            control = {
              <Checkbox name     = "repeats"
                        color    = "primary"
                        onChange = {this.setCheckbox}
                        checked  = {this.state.repeats}
              />
            }
            label = "Repeat"
         />
        </CardContent>

        {/* 'Repeat' div hidden */}
        {this.state.repeats === true &&
          <React.Fragment>
          <CardContent className = "date-container">
              <RRuleGenerator onChange={(rrule) => this.setRrule(rrule)} value={this.state.val.rrule}/>
          </CardContent>

          </React.Fragment>
        }

        {/* Timezone */}
        <CardContent >
          <Typography> Timezone </Typography>
          <MaterialSelect options  = {moment.tz.names().map(function (timezone) { return {label: timezone, value: timezone}; })}
                          onChange = {this.setTimezone}
                          value    = {this.state.val.timezone} />
        </CardContent>
      </Card>
    );
  }
}

export default EventDate;
