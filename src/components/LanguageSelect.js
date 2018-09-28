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
  }

  render() {
    return (
        <MaterialSelect
          id="language"
          name="language"
          onChange={this.props.onChange}
          options={this.state.options}
          value={this.props.value && this.props.value.value ? this.props.value : ''}
          className={this.props.className}
        />
    );
  }
}

export default LanguageSelect;
