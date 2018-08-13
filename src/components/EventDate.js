import React  from 'react';
import Select from 'react-select';

import RRuleGenerator          from 'react-rrule-generator';

import moment                  from 'moment';
import MaterialSelect          from './MaterialSelect';
import RRule                   from './RRule';
import 'moment-timezone';

// Material
import FormControl  from '@material-ui/core/FormControl';
import FormLabel    from '@material-ui/core/FormLabel';
import Checkbox     from '@material-ui/core/Checkbox';
import Typography   from '@material-ui/core/Typography';
import TextField    from '@material-ui/core/TextField';
import Card         from '@material-ui/core/Card';
import CardContent  from '@material-ui/core/CardContent';

//Material date picker
import MomentUtils                    from 'material-ui-pickers/utils/moment-utils';
import MuiPickersUtilsProvider        from 'material-ui-pickers/utils/MuiPickersUtilsProvider';
import DateTimePicker                 from 'material-ui-pickers/DateTimePicker';

class EventDate extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      items   : [],
      endDate : true,
      allDay  : false,
      repeats : false,
      val : {
        value       : '',
        value2      : '',
        timezone    : 'UTC',
        offset      : 0,
        offset2     : 0,
        rrule       : '',
        timezone_db : ''
      },
      rrule     : '',
      status    : 'initial',
    };
    this.handleChange = this.handleChange.bind(this);
    this.setCheckbox  = this.setCheckbox.bind(this);
    this.setRrule     = this.setRrule.bind(this);
    this.setTimezone  = this.setTimezone.bind(this);
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
      newState.val.value  = new Date(newState.val.value);
      newState.val.value.setHours(0);
      newState.val.value.setMinutes(0);

      newState.val.value2 = new Date(newState.val.value);
      newState.val.value2.setHours(0);
      newState.val.value2.setMinutes(0);
    }
    if (target.name === 'endDate' && value) {
      newState.val = this.state.val;
      newState.val.value2 = newState.val.value;
    }
    this.setState(newState);
  }

  //Changes
  handleChange (event, type) {
    const value  = event.toDate();
    const name   = type;
    let val      = this.state.val;

    // FROM
    if (name === 'from') {
      val.value = new Date(value);
      this.setState({
        val : val
      });
    }

    // TO
    if (name === 'to') {
      val.value2 = new Date(value);
      this.setState({
        val : val
      });
    }

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
    let dateVal     = new Date();
    let date2Val    = new Date();

    val.timezone_db  = timezone;
    val.timezone     = timezone;

    if (val.value) {
      dateVal = new Date(val.value);
    }
    val.offset = moment.tz.zone(timezone.value).utcOffset(dateVal.valueOf());
    val.offset = -val.offset * 60;

    if (val.value2) {
      date2Val = new Date(val.value2);
    }
    val.offset2 = moment.tz.zone(timezone.value).utcOffset(date2Val.valueOf());
    val.offset2 = -val.offset2 * 60;

    this.setState({
      val: val
    });

    if (this.props.onChange) {
      this.props.onChange(val);
    }
  }

  // update component
  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.props.value && Object.keys(this.props.value).length && this.state.status === 'initial') {
      let val = this.props.value[0] ? this.props.value[0] : this.props.value;
      moment.tz.names().forEach (function (timezone) {
        if (timezone === val.timezone) {
          val.timezone = {value: timezone, label: timezone};
        }
        val.value = moment(val.value, "YYYY-MM-DD HH:mm:ss");
        val.value2 = moment(val.value2, "YYYY-MM-DD HH:mm:ss");
      });
      let newState = {
        val       : val,
        endDate   : (val.value.isSame(val.value2) ? false : true),
        allDay    : (val.value2.hours() + val.value2.minutes() === 0 ? true : false),
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
              <DateTimePicker
                id             = "from"
                name           = "from"
                format         = "DD/MM/YYYY hh:mm A"
                value          = {this.state.val.value ? this.state.val.value : ''}
                invalidLabel   = ""
                autoOk
                onChange       = {(e) => this.handleChange(e, 'from')}
                leftArrowIcon  = {<i className="icon-arrow-left" />}
                rightArrowIcon = {<i className="icon-arrow-right" />}
                dateRangeIcon  = {<i className="icon-calendar" />}
                timeIcon       = {<i className="icon-clock" />}
              />
            </MuiPickersUtilsProvider>
          </FormControl>

      {/* Date 'To'*/}
        {this.state.endDate === true &&
          <FormControl  margin="normal">
            <FormLabel htmlFor="to">To</FormLabel>
            <MuiPickersUtilsProvider utils={MomentUtils}>
              <DateTimePicker
                id             = "to"
                name           = "to"
                format         = "DD/MM/YYYY hh:mm A"
                minDate        = {this.state.val.value}
                value          = {this.state.val.value2 ? this.state.val.value2 : ''}
                invalidLabel   = ""
                autoOk
                onChange       = {(e) => this.handleChange(e, 'to')}
                leftArrowIcon  = {<i className="icon-arrow-left" />}
                rightArrowIcon = {<i className="icon-arrow-right" />}
                dateRangeIcon  = {<i className="icon-calendar" />}
                timeIcon       = {<i className="icon-clock" />}
                />
            </MuiPickersUtilsProvider>
          </FormControl>
        }
        </CardContent>

       {/* 'All day' checkbox & 'Repeat' checkbox */}
        <CardContent className = "date-container">
          <FormControl>
            <Checkbox name     = "endDate"
                      color    = "primary"
                      onChange = {this.setCheckbox}
                      checked  = {this.state.endDate}
            /> End date
          </FormControl>
          <FormControl>
            <Checkbox name     = "allDay"
                      color    = "primary"
                      onChange = {this.setCheckbox}
                      disabled = {!this.state.val.value}
            /> All day
          </FormControl>
          <FormControl>
            <Checkbox name     = "repeats"
                      color    = "primary"
                      onChange = {this.setCheckbox}
                      checked  = {this.state.repeats}
            /> Repeat
          </FormControl>
        </CardContent>

        {/* 'Repeat' div hidden */}
        <CardContent className = "date-container">
          {this.state.repeats === true &&
              /* <RRuleGenerator onChange={this.setRrule} value={this.state.val.rrule} /> */
              <RRule onChange={(rrule) => this.setRrule(rrule)} value={this.state.val.rrule}/>
          }
        </CardContent>

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
