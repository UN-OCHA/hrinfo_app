import React from 'react';
import MaterialSelect from './MaterialSelect';

class MeasurementUnitsSelect extends React.Component {

  state = {
    options: [
      { value: 'Community', label: 'Community'},
      { value: 'Settlements', label: 'Settlements'},
      { value: 'Households', label: 'Households'},
      { value: 'Individuals', label: 'Individuals'},
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

export default MeasurementUnitsSelect;
