import React from 'react';
import { translate} from 'react-i18next';
import MaterialSelect from './MaterialSelect';

class AssessmentStatus extends React.Component {

  t = this.props.t;

  state = {
  };

  options = [
    { value: 'Planned', label: this.t('assessment.status.planned')},
    { value: 'Ongoing', label: this.t('assessment.status.ongoing') },
    { value: 'Draft', label: this.t('assessment.status.draft')},
    { value: 'Field work completed', label: this.t('assessment.status.field_work')},
    { value: 'Report completed', label: this.t('assessment.status.report')}
  ];

  shouldComponentUpdate(nextProps, nextState) {
    if (JSON.stringify(this.props.value) !== JSON.stringify(nextProps.value)) {
      return true;
    }
    return false;
  }

  render() {
    return (
      <MaterialSelect
        id        = "assessmentStatus"
        name      = "assessmentStatus"
        onChange  = {this.props.onChange}
        options   = {this.options}
        value     = {this.props.value}
        className = {this.props.className} />
    );
  }
}

export default translate('forms')(AssessmentStatus);
