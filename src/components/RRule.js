import React                  from 'react';

import FormControl            from '@material-ui/core/FormControl';
import InputLabel             from '@material-ui/core/InputLabel';
import TextField              from '@material-ui/core/TextField';
import Card                   from '@material-ui/core/Card';
import CardContent            from '@material-ui/core/CardContent';
import Select                 from '@material-ui/core/Select';
import MenuItem               from '@material-ui/core/MenuItem';
import Divider                from '@material-ui/core/Divider';
import InputAdornment         from '@material-ui/core/InputAdornment';

//Material date picker
import MomentUtils from '@date-io/moment';
import MuiPickersUtilsProvider from 'material-ui-pickers/MuiPickersUtilsProvider';
import DatePicker              from 'material-ui-pickers/DatePicker';

class RRule extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      rrule: '',
      freq: '',
      interval: '',
      end: 'COUNT',
      count: 1,
      until: ''
    };

    this.handleChange = this.handleChange.bind(this);

  }

  handleChange(event, type = null) {
    const name  = event.target ? event.target.name  : 'until';
    let value = event.target ? event.target.value : event.format();
    if (name === 'until') {
      const parts = value.toString().split('T');
      value = parts[0].replace(/-/gi, '') + 'T000000Z';
    }

    let rrule = this.state.rrule;

    if (type) {
      /* Regular Expression to check if the type is already in rrule */
      const regExp = new RegExp("^(.*" + type + "=)([A-Z0-9-=:+]+)(.*)$");
      /* If YES replace */
      if (regExp.test(rrule)) {
        rrule = rrule.replace(regExp, "$1"+ value +"$3");
      }
      /* If NO add */
      else {
        rrule = rrule + (/(^$|;$)/.test(rrule) ? "" : ";") + type + "=" + value;
      }

      /* Handle special cases */
      /* Remove INTERVAL if FREQ=YEARLY */
      if (type === 'FREQ' && value === 'YEARLY') {
        rrule = rrule.replace(/;INTERVAL=[0-9]+/, '');
      }
      /* Remove UNTIL if COUNT */
      if (type === 'COUNT') {
        rrule = rrule.replace(/;UNTIL=[A-Z0-9\-:+]+/, '');
      }
      /* Remove COUNT if UNTIL */
      if (type === 'UNTIL') {
        rrule = rrule.replace(/;COUNT=[0-9]+/, '');
      }

    }

    this.setState(
      {
        [name]: value,
        rrule : rrule
      }
    );

    if (this.props.onChange) {
      this.props.onChange(rrule);
    }
  }

  getElementFromRRule(rrule, type = null) {
    if (type) {
      const regExp = new RegExp("^(.*" + type + "=)([A-Z0-9-:+]+)(.*)$");
      let match = regExp.exec(rrule);
      if (match) {
        return match[2];
      }
      else {
        return '';
      }
    }
    else {
      if (/UNTIL/.test(rrule)) {
        return 'UNTIL';
      }
      else {
        return 'COUNT';
      }
    }
  }

  componentDidMount() {
    if (this.props.value && Object.keys(this.props.value).length) {
      let rrule = this.props.value;
      let newState = {
        rrule: rrule,
        freq: this.getElementFromRRule(rrule, 'FREQ'),
        interval: this.getElementFromRRule(rrule, 'INTERVAL'),
        end: this.getElementFromRRule(rrule),
        count: this.getElementFromRRule(rrule, 'COUNT'),
        until: this.getElementFromRRule(rrule, 'UNTIL')
      };
      this.setState(newState);
    }
  }

  render() {
    const interval = (this.state.freq !== 'YEARLY' && this.state.freq !== '') ?
    (
      <FormControl>
        <TextField id         = "interval"
                   name       = "interval"
                   margin     = "normal"
                   value      = {this.state.interval}
                   onChange   = {(e) => this.handleChange(e, 'INTERVAL')}
                   InputProps = {{
                    startAdornment: <InputAdornment position="start">every</InputAdornment>,
                    endAdornment:   this.state.freq === 'MONTHLY' ?
                                      <InputAdornment position="end">month(s)</InputAdornment>
                                    : (this.state.freq === 'WEEKLY' ?
                                        <InputAdornment position="end">week(s)</InputAdornment>
                                      : (this.state.freq === 'DAILY' ?
                                          <InputAdornment position="end">day(s)</InputAdornment>
                                        : (this.state.freq === 'HOURLY' &&
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
              <MenuItem value={'YEARLY'}>Yearly</MenuItem>
              <MenuItem value={'MONTHLY'}>Monthly</MenuItem>
              <MenuItem value={'WEEKLY'}>Weekly</MenuItem>
              <MenuItem value={'DAILY'}>Daily</MenuItem>
              <MenuItem value={'HOURLY'}>Hourly</MenuItem>
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
      </Card>
    );
  }
}

export default RRule;
