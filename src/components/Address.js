import React          from 'react';
import { translate} from 'react-i18next';
import HRInfoLocation from './HRInfoLocation';

import FormControl      from '@material-ui/core/FormControl';
import Typography       from '@material-ui/core/Typography';
import TextField        from '@material-ui/core/TextField';
import Card             from '@material-ui/core/Card';
import CardContent      from '@material-ui/core/CardContent';


class Address extends React.Component {

    state = {
      val     : {},
      status  : 'initial'
    };

    setCountry = (row, level, selectedOption) => {
      let val = {...this.state.val, country: selectedOption};
      this.setState({
        val: val
      });
      if (this.props.onChange) {
        this.props.onChange(val);
      }
    };

    handleChange = (event) => {
      const target = event.target;
      const value  = target.type === 'checkbox' ? target.checked : target.value;
      const name   = target.name;

      let val      = {...this.state.val, [name]: value};
      this.setState({
        val : val
      });
      if (this.props.onChange) {
        this.props.onChange(val);
      }
    };

    componentDidUpdate(prevProps, prevState, snapshot) {
      if (this.state.status === 'initial' && this.props.value && Object.keys(this.props.value).length) {
        this.setState({
          val    : this.props.value,
          status : 'ready'
        });
      }
    }

    shouldComponentUpdate(nextProps, nextState) {
      if (JSON.stringify(this.state) !== JSON.stringify(nextState)) {
        return true;
      }
      return false;
    }

    render () {
      const { t } = this.props;
      return (
        <Card  className="card-container">

        {/* Country */}
          <CardContent className="address-container-select">
            <Typography>{t('address.country')}</Typography>
            <FormControl className="address-container-text">
               <HRInfoLocation id = "country"
                               level    = "0"
                               value    = {this.state.val.country}
                               onChange = {this.setCountry} />
            </FormControl>
          </CardContent>

        {/* Address 1 */}
          <CardContent className="address-container-select">
            <Typography>{t('address.address_1')}</Typography>
            <FormControl className="address-container-text">
            <TextField type     = "text"
                       name     = "thoroughfare"
                       onChange = {this.handleChange}
                       value    = {this.state.val.thoroughfare || ""} />
            </FormControl>
          </CardContent>

        {/* Address 2 */}
          <CardContent className="address-container-select">
            <Typography>{t('address.address_2')}</Typography>
            <FormControl className="address-container-text">
            <TextField      type     = "text"
                            name     = "premise"
                            onChange = {this.handleChange}
                            value    = {this.state.val.premise || ""} />
            </FormControl>
          </CardContent>

        {/* Postal Code */}
          <CardContent className="address-container-select">
            <Typography>{t('address.postal_code')}</Typography>
            <FormControl className="address-container-text">
            <TextField      type     = "text"
                            name     = "postal_code"
                            onChange = {this.handleChange}
                            value    = {this.state.val.postal_code || ""} />
            </FormControl>
          </CardContent>

        {/* City */}
          <CardContent className="address-container-select">
            <Typography>{t('address.city')}</Typography>
            <FormControl className="address-container-text">
            <TextField      type     = "text"
                            name     = "locality"
                            onChange = {this.handleChange}
                            value    = {this.state.val.locality || ""} />
            </FormControl>
          </CardContent>
        </Card>
          );
    }
}

export default translate('forms')(Address);
