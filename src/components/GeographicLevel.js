import React from 'react';
import MaterialSelect from './MaterialSelect';

class GeographicLevel extends React.Component {

  state = {
    options: [
      { value: 'admin0', label: 'National'},
      { value: 'admin1', label: 'Governorate / State / Regional' },
      { value: 'admin2', label: 'District / Province / Locality / County'},
      { value: 'admin3', label: 'Sub-district'},
      { value: 'admin4', label: 'Village'},
      { value: 'other', label: 'Other'},
      { value: 'non-representative', label: 'Non-representative'}
    ]
  };

  render() {
    return (
        <MaterialSelect
          id        = "geographicLevel"
          name      = "geographicLevel"
          onChange  = {this.props.onChange}
          options   = {this.state.options}
          value     = {this.props.value}
          className = {this.props.className} />
    );
  }
}

export default GeographicLevel;
