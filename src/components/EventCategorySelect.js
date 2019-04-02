import React from 'react';
import { translate} from 'react-i18next';
import MaterialSelect from './MaterialSelect';

class EventCategorySelect extends React.Component {
  t = this.props.t;

  state = {
  };

  options = [
    { value: '71377', label: this.t('events.category.special')},
    { value: '82', label: this.t('events.category.meetings')},
    { value: '83', label: this.t('events.category.trainings')},
    { value: '84', label: this.t('events.category.workshops')},
    { value: '85', label: this.t('events.category.conferences')}
  ];

  getValue = (val) => {
    let out = {value: '', label: ''};
    this.options.forEach(function (option) {
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

  shouldComponentUpdate(nextProps, nextState) {
    if (JSON.stringify(this.props.value) !== JSON.stringify(nextProps.value)) {
      return true;
    }
    return false;
  }

  render() {
    return (
        <MaterialSelect
          id        = "eventCategory"
          name      = "eventCategory"
          onChange  = {this.handleChange}
          options   = {this.options}
          value     = {this.getValue(this.props.value)}
          className = {this.props.className} />
    );
  }
}

export default translate('forms')(EventCategorySelect);
