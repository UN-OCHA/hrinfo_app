import React          from 'react';
import MaterialSelect from './MaterialSelect';
import DropboxChooser from 'react-dropbox-chooser';
import HRInfoAPI      from '../api/HRInfoAPI';
import HRInfoLocation from './HRInfoLocation';

import classNames from 'classnames';

import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import InputAdornment   from '@material-ui/core/InputAdornment';
import FormControl      from '@material-ui/core/FormControl';
import Button           from '@material-ui/core/Button';
import IconButton       from '@material-ui/core/IconButton';
import Typography       from '@material-ui/core/Typography';
import TextField        from '@material-ui/core/TextField';
import CircularProgress from '@material-ui/core/CircularProgress';
import Card             from '@material-ui/core/Card';
import CardHeader       from '@material-ui/core/CardHeader';
import CardContent      from '@material-ui/core/CardContent';
import CardActions      from '@material-ui/core/CardActions';
import Avatar           from '@material-ui/core/Avatar';

const styles = theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  margin: {
    margin: theme.spacing.unit,
  },
  withoutLabel: {
    marginTop: theme.spacing.unit * 3,
  },
  textField: {
    flexBasis: 200,
  },
});

class HRInfoFiles extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        val     : {},
        status  : 'initial'
      };
      this.handleChange = this.handleChange.bind(this);
      this.setCountry = this.setCountry.bind(this);
    }


    setCountry (row, level, selectedOption) {
      let val = this.state.val;
          val['country'] = selectedOption;
      this.setState({
        val: val
      });
      if (this.props.onChange) {
        this.props.onChange(val);
      }
    }

    setCountry (row, level, selectedOption) {
      let val = this.state.val;
      val['country'] = selectedOption;
      this.setState({
        val: val
      });
      if (this.props.onChange) {
        this.props.onChange(val);
      }
    }

    handleChange (event) {
      const target = event.target;
      const value  = target.type === 'checkbox' ? target.checked : target.value;
      const name   = target.name;

      let val      = this.state.val;
      val[name]    = value;
      this.setState({
        val : val
      });
      if (this.props.onChange) {
        this.props.onChange(val);
      }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
      if (this.props.value && Object.keys(this.props.value).length && this.state.status === 'initial') {
        this.setState({
          val    : this.props.value,
          status : 'ready'
        });
      }
    }

    render () {
      const { classes } = this.props;
      return (
        <Card  className="card-container">

    			<CardContent className="address-container-select">
    				<Typography>Country</Typography>
            <FormControl className="address-container-text">
      			   <HRInfoLocation level="0" value={this.state.val.country} onChange={this.setCountry} />
            </FormControl>
    			</CardContent>

          <CardContent className="address-container-select">
      			<Typography> Address 1 </Typography>
            <FormControl className="address-container-text">
            <TextField      type     = "text"
                            name     = "thoroughfare"
                            onChange = {this.handleChange}
                            value    = {this.state.val.thoroughfare} />
        		</FormControl>
          </CardContent>

          <CardContent className="address-container-select">
      			<Typography> Address 2 </Typography>
            <FormControl className="address-container-text">
            <TextField      type     = "text"
                            name     = "premise"
                            onChange = {this.handleChange}
                            value    = {this.state.val.premise} />
        		</FormControl>
          </CardContent>

          <CardContent className="address-container-select">
      			<Typography> Postal Code </Typography>
            <FormControl className="address-container-text">
            <TextField      type     = "text"
                            name     = "postal_code"
                            onChange = {this.handleChange}
                            value    = {this.state.val.postal_code} />
        		</FormControl>
          </CardContent>

          <CardContent className="address-container-select">
      			<Typography>City</Typography>
            <FormControl className="address-container-text">
            <TextField      type     = "text"
                            name     = "locality"
                            onChange = {this.handleChange}
                            value    = {this.state.val.locality} />
        		</FormControl>
          </CardContent>
    		</Card>
          );
    }
}

export default HRInfoFiles;
