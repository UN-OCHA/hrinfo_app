import React  from 'react';

import moment                  from 'moment';
import lodash from 'lodash';
import 'moment-timezone';

// Material
import FormControl  from '@material-ui/core/FormControl';
import FormControlLabel  from '@material-ui/core/FormControlLabel';
import FormLabel    from '@material-ui/core/FormLabel';
import Checkbox     from '@material-ui/core/Checkbox';
import Card         from '@material-ui/core/Card';
import CardContent  from '@material-ui/core/CardContent';

//Material date picker
import MomentUtils from '@date-io/moment';
import MuiPickersUtilsProvider        from 'material-ui-pickers/MuiPickersUtilsProvider';
import DatePicker                     from 'material-ui-pickers/DatePicker';

class SimpleDate extends React.Component {

  state = {
    items   : [],
    endDate : true,
    val : {
      value  : moment.utc(),
      value2    : moment.utc()
    },
    status    : 'initial',
  };

  // Checkbox
  setCheckbox = (event) => {
    const target  = event.target;
    const value   = target.checked;
    const name    = target.name;
    let newState  = {};

    newState[name] = value;

    if (target.name === 'endDate') {
      newState.val = {...this.state.val, value2: this.state.val.value.clone()};
    }
    this.setState(newState);
  };

  //Changes
  handleChange = (event, type) => {
    let val = {};
    // FROM
    if (type === 'from') {
      val = {...this.state.val, value: event};
    }
    // TO
    if (type === 'to') {
      val = {...this.state.val, value2: event};
    }

    if (!this.state.endDate) {
      val = {...this.state.val, value2: val.value.clone()};
    }

    this.setState({
      val : val,
    });

    if (this.props.onChange) {
      this.props.onChange(val);
    }
  };

  // update component
  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.props.value && Object.keys(this.props.value).length && this.state.status === 'initial') {
      let val = this.props.value[0] ? lodash.cloneDeep(this.props.value[0]) : lodash.cloneDeep(this.props.value);
      if (val.value && typeof val.value !== 'object') {
        val.value = moment.utc(val.value);
      }
      if (val.value2 && typeof val.value2 !== 'object') {
        val.value2 = moment.utc(val.value2);
      }
      let newState = {
        val       : val,
        endDate   : val.value.unix() !== val.value2.unix(),
        status    : 'ready'
      };
      this.setState(newState);
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (JSON.stringify(this.state) !== JSON.stringify(nextState)) {
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
          </FormControl>
          }
        </CardContent>

        {/* 'End date' checkbox */}
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
        </CardContent>
      </Card>
    );
  }
}

export default SimpleDate;
