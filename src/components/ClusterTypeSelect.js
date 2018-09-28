import React from 'react';
import MaterialSelect from './MaterialSelect';

class ClusterTypeSelect extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      options: [
        { value: 'cluster', label: 'Cluster'},
        { value: 'aor', label: 'Area of Responsability (Sub-Cluster)' },
        { value: 'sector', label: 'Sector' },
        { value: 'working_group', label: 'Working Group' }
      ],
    };
    this.handleChange = this.handleChange.bind(this);
    this.getValue = this.getValue.bind(this);
  }

  getValue (val) {
    let out = {value: '', label: ''};
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
          id="type"
          name="type"
          onChange={this.handleChange}
          options={this.state.options}
          value={this.getValue(this.props.value)}
          className={this.props.className} />
    );
  }
}

export default ClusterTypeSelect;
