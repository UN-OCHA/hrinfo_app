import React  from 'react';

import moment                  from 'moment';
import MaterialSelect          from './MaterialSelect';
import RRule                   from './RRule';
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
import MomentUtils                    from 'material-ui-pickers/utils/moment-utils';
import MuiPickersUtilsProvider        from 'material-ui-pickers/utils/MuiPickersUtilsProvider';
import DatePicker                     from 'material-ui-pickers/DatePicker';

class EventDate extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      items   : [],
      endDate : true,
      allDay  : false,
      repeats : false,
      val : {
        value  : moment(),
        value2    : moment(),
        timezone    : {value: 'UTC', label: 'UTC'},
        rrule       : '',
      },
      rrule     : '',
      status    : 'initial',
    };
    this.handleChange = this.handleChange.bind(this);
    this.setCheckbox  = this.setCheckbox.bind(this);
    this.setRrule     = this.setRrule.bind(this);
    this.setTimezone  = this.setTimezone.bind(this);
    this.getTime      = this.getTime.bind(this);
  }

  // Checkbox
  setCheckbox (event) {
    const target  = event.target;
    const value   = target.checked;
    const name    = target.name;
    let newState  = {};

    newState[name] = value;

    if (target.name === 'allDay' && value) {
      newState.val        = this.state.val;
      newState.val.value.hours(0);
      newState.val.value.minutes(0);

      newState.val.value2.hours(0);
      newState.val.value2.minutes(0);
    }
    if (target.name === 'endDate') {
      newState.val = this.state.val;
      newState.val.value2 = moment(newState.val.value.unix());
    }
    this.setState(newState);
  }

  //Changes
  handleChange (event, type) {
    let value: Date;
    let val = this.state.val;
    if (!event.target) {
      //value  = event.utc().toDate();
      // FROM
      if (type === 'from') {
        val.value = event.utc();
      }
      // TO
      if (type === 'to') {
        val.value2 = event.utc();
      }
    }
    else {
      value = event.target.value;
      // FROM
      if (type === 'from') {
        val.value.hours(value.split(":")[0]);
        val.value.minutes(value.split(":")[1]);
      }
      // TO
      if (type === 'to') {
        val.value2.hours(value.split(":")[0]);
        val.value2.minutes(value.split(":")[1]);
      }
    }

    if (!this.state.endDate) {
      val.value2 = val.value;
    }

    this.setState({
      val : val,
      // check if time has changed for all allDay
      allDay: this.isAllDay(val.value, val.value2)
    });

    if (this.props.onChange) {
      this.props.onChange(val);
    }
  }

  // rrule
  setRrule (rrule) {
    let val   = this.state.val;
    val.rrule = rrule;

    this.setState({
      val : val
    });

    if (this.props.onChange) {
      this.props.onChange(val);
    }
  }

  // Set timezone from departure to arrival
  setTimezone (timezone) {
    let val         = this.state.val;
    val.timezone     = timezone;

    this.setState({
      val: val
    });

    if (this.props.onChange) {
      this.props.onChange(val);
    }
  }

  getTime(date) {
    let hours   = ("0" + date.hours()).slice(-2);
    let minutes = ("0" + date.minutes()).slice(-2);
    return (hours + ":" + minutes);
  }

  isAllDay(date_from, date_to) {
    let sum_from = date_from ? date_from.hours() + date_from.minutes() : 0;
    let sum_to   = date_to ? date_to.hours() + date_to.minutes() : 0;
    return sum_from + sum_to === 0;
  }

  // update component
  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.props.timezone && prevProps.timezone !== this.props.timezone) {
      let val = this.state.val;
      val.timezone = {value: this.props.timezone, label: this.props.timezone};
      this.setState({
        val: val
      });
    }
    if (this.props.value && Object.keys(this.props.value).length && this.state.status === 'initial') {
      let val = this.props.value[0] ? this.props.value[0] : this.props.value;
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
          <CardContent className = "date-container">
              <RRule onChange={(rrule) => this.setRrule(rrule)} value={this.state.val.rrule}/>
          </CardContent>
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
