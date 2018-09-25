import React from 'react';
import MaterialSelect from './MaterialSelect';

class LanguageSelect extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      options: [
        { value: 'en', label: 'English'},
        { value: 'fr', label: 'French' },
        { value: 'es', label: 'Spanish' },
        { value: 'ru', label: 'Russian' }
      ],
    };
    this.handleChange = this.handleChange.bind(this);
    this.getValue = this.getValue.bind(this);
  }

  getValue (val) {
    let out = {};
    this.state.options.forEach(function (option) {
      if (option.value === val) {
        out = option;
      }
    });
    return out;
  }

  handleChange (selectedOption) {
    if (this.props.onChange) {
      this.props.onChange(selectedOption ? selectedOption.value : selectedOption);
    }
  }

  render() {
    return (
        <MaterialSelect
          id="language"
          name="language"
          onChange={this.handleChange}
          options={this.state.options}
          value={this.getValue(this.props.value)}
          className={this.props.className}
          getOptionValue={() => {
            if(this.props.value)
              return this.props.value.value;
            else
              return ''}} />
    );
  }
}

export default LanguageSelect;
