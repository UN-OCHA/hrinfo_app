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

  render() {
    return (
        <MaterialSelect
          id        = "userType"
          name      = "userType"
          onChange  = {this.props.onChange}
          options   = {this.state.options}
          value     = {this.props.value}
          className = {this.props.className} />
    );
  }
}

export default UserType;
