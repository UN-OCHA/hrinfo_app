import React from 'react';
import MaterialSelect from './MaterialSelect';

class CollectionMethodSelect extends React.Component {

  state = {
    options: [
      { value: 'Structured Interview', label: 'Structured Interview'},
      { value: 'Unstructured Interview', label: 'Unstructured Interview'},
      { value: 'Key Informant Interview', label: 'Key Informant Interview'},
      { value: 'Focus group discussion', label: 'Focus group discussion'},
      { value: 'Observation', label: 'Observation'},
      { value: 'Baseline data analysis', label: 'Baseline data analysis'},
      { value: 'Field Interview', label: 'Field Interview'},
      { value: 'Email / Mail Interview', label: 'Email / Mail Interview'},
      { value: 'Mixed', label: 'Mixed'},
      { value: 'Other', label: 'Other'}
    ]
  };

  render() {
    return (
      <MaterialSelect
        id        = "collectionMethod"
        name      = "collectionMethod"
        onChange  = {this.props.onChange}
        options   = {this.state.options}
        value     = {this.props.value}
        className = {this.props.className} />
    );
  }
}

export default CollectionMethodSelect;
