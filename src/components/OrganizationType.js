import React from 'react';
import MaterialSelect from './MaterialSelect';

class OrganizationType extends React.Component {

  state = {
    options: [
      { value: 431, label: 'Academic / Research'},
      { value: 433, label: 'Donor' },
      { value: 434, label: 'Embassy'},
      { value: 435, label: 'Government'},
      { value: 437, label: 'International NGO'},
      { value: 438, label: 'International Organization'},
      { value: 439, label: 'Media'},
      { value: 440, label: 'Military'},
      { value: 441, label: 'National NGO'},
      { value: 443, label: 'Other'},
      { value: 444, label: 'Private sector'},
      { value: 445, label: 'Red Cross / Red Crescent'},
      { value: 446, label: 'Religious'},
      { value: 447, label: 'United Nations'}
    ]
  };

  render() {
    return (
        <MaterialSelect
          id        = "organizationType"
          name      = "organizationType"
          onChange  = {this.props.onChange}
          options   = {this.state.options}
          value     = {this.props.value}
          className = {this.props.className} />
    );
  }
}

export default OrganizationType;
