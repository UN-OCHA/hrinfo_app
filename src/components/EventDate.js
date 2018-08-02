import React  from 'react';
import Select from 'react-select';
import { FormGroup, Row, Col } from 'reactstrap';
import RRuleGenerator                        from 'react-rrule-generator';
import moment                                from 'moment';
import 'moment-timezone';

// Material
import FormControl      from '@material-ui/core/FormControl';
import FormLabel        from '@material-ui/core/FormLabel';
import Checkbox         from '@material-ui/core/Checkbox';

//Dates
import MomentUtils             from 'material-ui-pickers/utils/moment-utils';
import MuiPickersUtilsProvider from 'material-ui-pickers/utils/MuiPickersUtilsProvider';
import DatePicker              from 'material-ui-pickers/DatePicker';
import TimePicker              from 'material-ui-pickers/TimePicker';

//Card
import Card          from '@material-ui/core/Card';
import CardContent   from '@material-ui/core/CardContent';

class EventDate extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      items   : [],
      allDay  : false,
      repeats : false,
      val: {
        value       : '',
        value2      : '',
        timezone    : 'UTC',
        offset      : 0,
        offset2     : 0,
        rrule       : '',
        timezone_db : ''
      },
      from_date : '',
      from_time : '',
      to_date   : '',
      to_time   : '',
      rrule     : '',
      status    : 'initial',
    };
    this.handleChange = this.handleChange.bind(this);
    this.setCheckbox  = this.setCheckbox.bind(this);
    this.setRrule     = this.setRrule.bind(this);
    this.setTimezone  = this.setTimezone.bind(this);
  }

// Checkbox 'All day'
  setCheckbox (event) {
    const target  = event.target;
    const value   = target.type === 'checkbox' ? target.checked : target.value;
    const name    = target.name;
    let newState  = {};

    newState[name] = value;

    if (target.name === 'allDay') {
      newState.from_time  = '00:00';
      newState.to_time    = '00:00';

      newState.val        = this.state.val;
      newState.val.value  = this.state.from_date ? this.state.from_date + ' 00:00:00' : '';
      newState.val.value2 = this.state.to_date   ? this.state.to_date   + ' 00:00:00' : '';
    }
    this.setState(newState);
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
    console.log(val);

    this.setState({
      val: val
    });

    if (this.props.onChange) {
      this.props.onChange(val);
    }
  }


//Changements
  handleChange (event) {
    const target = event.target;
    const value  = target.type === 'checkbox' ? target.checked : target.value;
    const name   = target.name;
    let val      = this.state.val;

    if (name === 'from_date') {
      val.value = value;

      if (this.state.from_time) {
        val.value += ' ' + this.state.from_time + ':00';
      }
      else {
        val.value += ' 00:00:00';
      }

      this.setState({
        val      : val,
        from_date: value
      });
    }
    if (name === 'from_time') {
      val.value = this.state.from_date + ' ' + value + ':00';

      this.setState({
        val      : val,
        from_time: value
      });
    }
    if (name === 'to_date') {
      val.value2 = value;

      if (this.state.to_time) {
        val.value2 += ' ' + this.state.to_time + ':00';
      }
      else {
        val.value2 += ' 00:00:00';
      }

      this.setState({
        val    : val,
        to_date: value
      });
    }
    if (name === 'to_time') {
      val.value2 = this.state.to_date + ' ' + value + ':00';
      this.setState({
        val    : val,
        to_time: value
      });
    }

    if (this.props.onChange) {
      this.props.onChange(val);
    }
  }


// Get the date
  getDate (input) {
    const index = input.indexOf(' ');
    if (index !== -1) {
      return input.substr(0, index);
    }
  }

// Get the time
  getTime (input) {
    const index = input.indexOf(' ');
    if (index !== -1) {
      const index2 = input.lastIndexOf(':');
      return input.substring(index + 1, index2);
    }
  }


// update component
  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.props.value && Object.keys(this.props.value).length && this.state.status === 'initial') {
      let val = this.props.value;
      moment.tz.names().forEach (function (timezone) {
        if (timezone === val.timezone) {
          val.timezone = {value: timezone, label: timezone};
        }
      });
      const from_time = this.getTime(val.value);
      let newState = {
        val       : val,
        from_date : this.getDate(val.value),
        from_time : from_time,
        to_date   : this.getDate(val.value2),
        to_time   : this.getTime(val.value2),
        allDay    : this.state.allDay,
        repeats   : false,
        status    : 'ready'
      };
      if (this.props.value.rrule) {
        newState.repeats = true;
      }
      this.setState(newState);
    }
  }

  render() {
    return (
      <Card className="card-container">

      {/* 'All day checkbox' */}
        <CardContent className="date-container">
          <FormControl check>
            <Checkbox name     = "allDay"
                      onChange = {this.setCheckbox}/> All day
          </FormControl>
        </CardContent>

      {/* Date 'from' */}
        <CardContent className="date-container">
          <FormControl margin = "normal">
            <FormLabel for="from_date">From</FormLabel>
                <form>
                  <MuiPickersUtilsProvider utils = {MomentUtils}>
                    <DatePicker
                      id             = "from_date"
                      name           = "from_date"
                      format         = "DD/MM/YYYY"
                      placeholder    = 'DD/MM/YYYY'
                      value          = {this.state.from_date}
                      onChange       = {this.handleChange}
                      invalidLabel   = ""
                      autoOk
                      leftArrowIcon  = {<i className="icon-arrow-left"  />}
                      rightArrowIcon = {<i className="icon-arrow-right" />}
                    />
                  </MuiPickersUtilsProvider>

                  &nbsp;&nbsp;&nbsp;

                  <MuiPickersUtilsProvider utils = {MomentUtils}>
                    <TimePicker
                      id            = "from_time"
                      name          = "from_time"
                      placeholder   = '00:00'
                      value         = {this.state.from_time}
                      onChange      = {this.handleChange}
                      disabled      = {this.state.allDay}
                      invalidLabel  = ""
                      autoOk
                    />
                  </MuiPickersUtilsProvider>
                </form>
          </FormControl>
        </CardContent>

      {/* Date 'To' */}
        <CardContent className="date-container">
            <FormControl  margin="normal">
              <FormLabel for="from_date">To</FormLabel>
                <form>
                  <MuiPickersUtilsProvider utils = {MomentUtils}>
                    <DatePicker
                      id             = "to_date"
                      name           = "to_date"
                      format         = "DD/MM/YYYY"
                      placeholder    = 'DD/MM/YYYY'
                      value          = {this.state.to_date}
                      onChange       = {this.handleChange}
                      invalidLabel   = ""
                      autoOk
                      leftArrowIcon  = {<i className="icon-arrow-left"  />}
                      rightArrowIcon = {<i className="icon-arrow-right" />}
                    />
                  </MuiPickersUtilsProvider>
                  &nbsp;
                  <MuiPickersUtilsProvider utils = {MomentUtils}>
                    <TimePicker
                      id            = "to_time"
                      name          = "to_time"
                      placeholder   = '00:00'
                      value         = {this.state.to_time}
                      onChange      = {this.handleChange}
                      disabled      = {this.state.allDay}
                      invalidLabel  = ""
                      autoOk
                    />
                  </MuiPickersUtilsProvider>
                </form>
            </FormControl>
          </CardContent>

        {/* 'Repeat' checkbox */}
          <CardContent className="date-container">
            <FormControl check>
              <Checkbox name     = "repeats"
                        onChange = {this.setCheckbox}
              /> Repeat
            </FormControl>
          </CardContent>

        {/* 'Repeat' div hidden */}
          <CardContent className="date-container">
            {this.state.repeats === true &&
              <Row>
                <Col>
                  <RRuleGenerator onChange={this.setRrule} value={this.state.val.rrule} />
                </Col>
              </Row>
            }
          </CardContent>

        {/* Timezone div */}
          <CardContent >
            <FormGroup margin="normal">
              <FormLabel for="timezone">Timezone</FormLabel>
                <Select options  = {moment.tz.names().map(function (timezone) { return {label: timezone, value: timezone}; })}
                        onChange = {this.setTimezone}
                        value    = {this.state.val.timezone} />
              </FormGroup>

          </CardContent>
      </Card>
    );
  }
}

export default EventDate;
