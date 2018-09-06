import React from 'react';
import MaterialSelect from './MaterialSelect';

class EventCategorySelect extends React.Component {
  state = {
    options: [
      { value: '82', label: 'Meetings'},
      { value: '83', label: 'Trainings'},
      { value: '84', label: 'Workshops'},
      { value: '85', label: 'Conferences'}
    ],
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
      this.props.onChange(selectedOption ? selectedOption.value : selectedOption);
    }
  };

  render() {
    return (
        <MaterialSelect
          id        = "eventCategory"
          name      = "eventCategory"
          onChange  = {this.handleChange}
          options   = {this.state.options}
          value     = {this.getValue(this.props.value)}
          className = {this.props.className} />
    );
  }
}

export default EventCategorySelect;
