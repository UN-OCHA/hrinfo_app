import React from 'react';
import Select from 'react-select';
import { Input, FormGroup, Row, Col, Label } from 'reactstrap';
import RRuleGenerator from 'react-rrule-generator';
import timezones from './timezones.json';

class EventDate extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      items: [],
      allDay: false,
      repeats: false,
      val: {
        value: '',
        value2: '',
        timezone: 'UTC',
        offset: '0',
        offset2: '0',
        rrule: '',
        timezone_db: ''
      },
      from_date: '',
      from_time: '',
      to_date: '',
      to_time: '',
      rrule: '',
      status: 'initial'
    };
    this.handleChange = this.handleChange.bind(this);
    this.setCheckbox = this.setCheckbox.bind(this);
    this.setRrule = this.setRrule.bind(this);
    this.setTimezone = this.setTimezone.bind(this);
  }

  setCheckbox (event) {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;
    let newState = {};
    newState[name] = value;
    if (target.name === 'allDay') {
      newState.from_time = '00:00';
      newState.to_time = '00:00';
      newState.val = this.state.val;
      newState.val.value = this.state.from_date ? this.state.from_date + ' 00:00:00' : '';
      newState.val.value2 = this.state.to_date ? this.state.to_date + ' 00:00:00' : '';
    }
    this.setState(newState);
  }

  setRrule (rrule) {
    let val = this.state.val;
    val.rrule = rrule;
    this.setState({
      val: val
    });
    if (this.props.onChange) {
      this.props.onChange(val);
    }
  }

  setTimezone (timezone) {
    let val = this.state.val;
    val.timezone_db = timezone;
    this.setState({
      val: val
    });
    if (this.props.onChange) {
      this.props.onChange(val);
    }
  }

  handleChange (event) {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    let val = this.state.val;
    if (name === 'from_date') {
      val.value = value;
      if (this.state.from_time) {
        val.value += ' ' + this.state.from_time + ':00';
      }
      else {
        val.value += ' 00:00:00';
      }
      this.setState({
        val: val,
        from_date: value
      });
    }
    if (name === 'from_time') {
      val.value = this.state.from_date + ' ' + value + ':00';
      this.setState({
        val: val,
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
        val: val,
        to_date: value
      });
    }
    if (name === 'to_time') {
      val.value2 = this.state.to_date + ' ' + value + ':00';
      this.setState({
        val: val,
        to_time: value
      });
    }
    if (this.props.onChange) {
      this.props.onChange(val);
    }
  }

  getDate (input) {
    const index = input.indexOf(' ');
    if (index !== -1) {
      return input.substr(0, index);
    }
  }

  getTime (input) {
    const index = input.indexOf(' ');
    if (index !== -1) {
      const index2 = input.lastIndexOf(':');
      return input.substring(index + 1, index2);
    }
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.props.value && Object.keys(this.props.value).length && this.state.status === 'initial') {
      let val = this.props.value;
      timezones.forEach (function (group) {
        group.options.forEach(function (timezone) {
          if (timezone.value === val.timezone_db) {
            val.timezone_db = timezone;
          }
        });
      });
      const from_time = this.getTime(val.value);
      let newState = {
        val: val,
        from_date: this.getDate(val.value),
        from_time: from_time,
        to_date: this.getDate(val.value2),
        to_time: this.getTime(val.value2),
        allDay: this.state.allDay,
        repeats: false,
        status: 'ready'
      };
      if (this.props.value.rrule) {
        newState.repeats = true;
      }
      this.setState(newState);
    }
  }

  render() {
    return (
      <div>
        <Row>
          <Col>
            <FormGroup check>
              <Label check>
                <Input type="checkbox" name="allDay" onChange={this.setCheckbox} />{' '}
                All day
              </Label>
            </FormGroup>
          </Col>
        </Row>
        <Row>
          <Col>
            <FormGroup>
              <Label for="from_date">From</Label>
              <Input type="date" name="from_date" value={this.state.from_date} onChange={this.handleChange} />
            </FormGroup>
          </Col>
          <Col>
            <FormGroup>
              <Label for="from_time">&nbsp;</Label>
              <Input type="time" name="from_time" disabled={this.state.allDay} value={this.state.from_time} onChange={this.handleChange} />
            </FormGroup>
          </Col>
        </Row>
        <Row>
          <Col>
            <FormGroup>
              <Label for="to_date">To</Label>
              <Input type="date" name="to_date" value={this.state.to_date} onChange={this.handleChange} />
            </FormGroup>
          </Col>
          <Col>
            <FormGroup>
              <Label for="to_time">&nbsp;</Label>
              <Input type="time" name="to_time" disabled={this.state.allDay} value={this.state.to_time} onChange={this.handleChange} />
            </FormGroup>
          </Col>
        </Row>
        <Row>
          <Col>
            <FormGroup check>
              <Label check>
                <Input type="checkbox" name="repeats" onChange={this.setCheckbox} />{' '}
                Repeat
              </Label>
            </FormGroup>
          </Col>
        </Row>
        {this.state.repeats === true &&
          <Row>
            <Col>
              <RRuleGenerator onChange={this.setRrule} value={this.state.val.rrule} />
            </Col>
          </Row>
        }
        <Row>
          <Col>
            <FormGroup>
              <Label for="timezone">Timezone</Label>
              <Select options={timezones} onChange={this.setTimezone} value={this.state.val.timezone_db} />
            </FormGroup>
          </Col>
        </Row>
      </div>
    );
  }
}

export default EventDate;
