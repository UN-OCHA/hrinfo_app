import React from 'react';
import MaterialSelect from './MaterialSelect';

class ClusterTypeSelect extends React.Component {

  state = {
  };

  options = [
    { value: 'cluster', label: 'Cluster'},
    { value: 'aor', label: 'Area of Responsability (Sub-Cluster)' },
    { value: 'sector', label: 'Sector' },
    { value: 'working_group', label: 'Working Group' }
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
          id="type"
          name="type"
          onChange={this.handleChange}
          options={this.options}
          value={this.getValue(this.props.value)}
          className={this.props.className} />
    );
  }
}

export default ClusterTypeSelect;
