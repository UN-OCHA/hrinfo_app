import React from 'react';
import { translate} from 'react-i18next';
import MaterialSelect from './MaterialSelect';

class EventCategorySelect extends React.Component {
  t = this.props.t;

  state = {
    options: [
      { value: '82', label: this.t('events.category.meetings')},
      { value: '83', label: this.t('events.category.trainings')},
      { value: '84', label: this.t('events.category.workshops')},
      { value: '85', label: this.t('events.category.conferences')}
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

export default translate('forms')(EventCategorySelect);
