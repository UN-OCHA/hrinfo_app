import React from 'react';
import MaterialSelect from './MaterialSelect';

class UserType extends React.Component {

  state = {
    options: [
      { value: 'is_orphan', label: 'Orphan'},
      { value: 'is_ghost', label: 'Ghost' },
      { value: 'verified', label: 'Verified'},
      { value: 'unverified', label: 'Unverified'},
      { value: 'isManager', label: 'Manager'}
    ]
  };

  getValue = (val) => {
    let out = {};
    this.state.options.forEach(function (option) {
      if (option.value === val) {
        out = option;
      }
    });
    return out;
  };

  handleChange = (selectedOption) => {
    if (this.props.onChange) {
      this.props.onChange(selectedOption);
    }
  };

  render() {
    return (
        <MaterialSelect
          id        = "userType"
          name      = "userType"
          onChange  = {this.handleChange}
          options   = {this.state.options}
          value     = {this.getValue(this.props.value)}
          className = {this.props.className} />
    );
  }
}

export default UserType;
