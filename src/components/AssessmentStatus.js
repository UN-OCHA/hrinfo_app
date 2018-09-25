import React from 'react';
import { translate} from 'react-i18next';
import MaterialSelect from './MaterialSelect';

class AssessmentStatus extends React.Component {

  t = this.props.t;

  state = {
    options: [
      { value: 'Planned', label: this.t('assessments.status.planned')},
      { value: 'Ongoing', label: this.t('assessments.status.ongoing') },
      { value: 'Draft', label: this.t('assessments.status.draft')},
      { value: 'Field work completed', label: this.t('assessments.status.field_work')},
      { value: 'Report completed', label: this.t('assessments.status.report')}
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

export default translate('forms')(AssessmentStatus);
