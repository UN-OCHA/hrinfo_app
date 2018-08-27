import React from 'react';
import MaterialSelect from './MaterialSelect';

class ContactSort extends React.Component {

  state = {
    options: [
      { value: 'name', label: 'Name'},
      { value: 'job_title', label: 'Job Title' },
      { value: 'organization', label: 'Organization'},
      { value: 'verified', label: 'Verified'}
    ]
  };

  render() {
    return (
        <MaterialSelect
          id        = "contactSort"
          name      = "contactSort"
          onChange  = {this.props.onChange}
          options   = {this.state.options}
          value     = {this.props.value}
          className = {this.props.className} />
    );
  }
}

export default ContactSort;
