import React  from 'react';
import Select from 'react-select';

import RRuleGenerator          from 'react-rrule-generator';

import moment                  from 'moment';
import MaterialSelect          from './MaterialSelect';
import 'moment-timezone';

// Material
import FormControl  from '@material-ui/core/FormControl';
import FormLabel    from '@material-ui/core/FormLabel';
import Checkbox     from '@material-ui/core/Checkbox';
import Typography   from '@material-ui/core/Typography';
import TextField    from '@material-ui/core/TextField';
import Card         from '@material-ui/core/Card';
import CardContent  from '@material-ui/core/CardContent';

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
    console.log('EVENT target CHANGED', event.target)

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


  //Changements
    handleChange (event) {
      console.log('EVENT target CHANGED', event.target)

      const target = event.target;
      const value  = target.type === 'checkbox' ? target.checked : target.value;
      const name   = target.name;
      let val      = this.state.val;

      // FROM DATE
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

      // FROM TIME
      if (name === 'from_time') {
        val.value = this.state.from_date + ' ' + value + ':00';
        this.setState({
          val       : val,
          from_time : value
        });
      }

      // TO DATE
      if (name === 'to_date') {
        val.value2 = value;
        if (this.state.to_time) {
          val.value2 += ' ' + this.state.to_time + ':00';
        }
        else {
          val.value2 += ' 00:00:00';
        }
        this.setState({
          val     : val,
          to_date : value
        });
      }

      // TO TIME
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
        from_time : from_time,
        from_date : this.getDate(val.value),
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
      {/* Date 'from' */}

        <CardContent className="date-container">
          <FormControl margin = "normal">
            <FormLabel for="from_date">From</FormLabel>
                <form>
                  <TextField
                    id    = "from_date"
                    name  = "from_date"
                    type  = "date"
                    placeholder     = "DD/MM/YYYY"
                    value           = {this.state.from_date}
                    onChange        = {this.handleChange}
                    InputLabelProps ={{
                      shrink: true,
                    }}
                  />

                  &nbsp;

                  <TextField
                    id    = "from_time"
                    name  = "from_time"
                    type  = "time"
                    placeholder     = "00:00"
                    value           = {this.state.from_time}
                    onChange        = {this.handleChange}
                    InputLabelProps ={{
                      shrink: true,
                    }}
                  />
                </form>
          </FormControl>

      {/* Date 'To'
        <CardContent className="date-container"> */}
            <FormControl  margin="normal">
              <FormLabel for="from_date">To</FormLabel>
                <form>
                  <TextField
                    id    = "to_date"
                    name  = "to_date"
                    type  = "date"
                    placeholder     = "DD/MM/YYYY"
                    value           = {this.state.to_date}
                    onChange        = {this.handleChange}
                    InputLabelProps ={{
                      shrink: true,
                    }}
                  />

                  &nbsp;

                  <TextField
                    id    = "to_date"
                    name  = "to_date"
                    type  = "time"
                    placeholder     = "00:00"
                    value          = {this.state.to_time}
                    onChange       = {this.handleChange}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </form>
            </FormControl>
          </CardContent>


       {/* 'All day' checkbox & 'Repeat' checkbox */}
          <CardContent className = "date-container">
            <FormControl check>
              <Checkbox name     = "allDay"
                        onChange = {this.setCheckbox}/> All day
            </FormControl>
            <FormControl check>
              <Checkbox name     = "repeats"
                        onChange = {this.setCheckbox}
              /> Repeat
            </FormControl>
          </CardContent>

        {/* 'Repeat' div hidden */}
          <CardContent className = "date-container">
            {this.state.repeats === true &&
              <RRuleGenerator onChange={this.setRrule} value={this.state.val.rrule} />
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
