import React from 'react';
import MaterialSelect from './MaterialSelect';

class AssessmentStatus extends React.Component {

  state = {
    options: [
      { value: 'Planned', label: 'Planned'},
      { value: 'Ongoing', label: 'Ongoing' },
      { value: 'Draft', label: 'Draft / Preliminary Results'},
      { value: 'Field work completed', label: 'Field work completed'},
      { value: 'Report completed', label: 'Report completed'}
    ]
  };

  render() {
    return (
      <MaterialSelect
        id        = "assessmentStatus"
        name      = "assessmentStatus"
        onChange  = {this.props.onChange}
        options   = {this.state.options}
        value     = {this.props.value}
        className = {this.props.className} />
    );
  }
}

export default AssessmentStatus;
