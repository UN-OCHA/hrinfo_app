import React from 'react';
import MaterialSelect from './MaterialSelect';

class LanguageSelect extends React.Component {
  state = {
  };

  options = [
    { value: 'en', label: 'English'},
    { value: 'fr', label: 'French' },
    { value: 'es', label: 'Spanish' },
    { value: 'ru', label: 'Russian' }
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
    if (nextProps.value !== this.props.value) {
      return true;
    }
    return false;
  }

  render() {
    return (
        <MaterialSelect
          id="language"
          name="language"
          onChange={this.handleChange}
          options={this.options}
          value={this.getValue(this.props.value)}
          className={this.props.className} />
    );
  }
}

export default LanguageSelect;
