import React from 'react';
import { EditorState } from 'draft-js';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { translate, Trans } from 'react-i18next';

import HRInfoAPI from '../api/HRInfoAPI';

// Components
import HRInfoSelect             from '../components/HRInfoSelect';
import HRInfoLocations          from '../components/HRInfoLocations';
import HRInfoAsyncSelect        from '../components/HRInfoAsyncSelect';
import HidContacts              from '../components/HidContacts';
import SimpleDate                from '../components/SimpleDate';
import AssessmentStatus         from "../components/AssessmentStatus";
import HRInfoFilesAccessibility from "../components/HRInfoFilesAccessibility";
import LanguageSelect           from '../components/LanguageSelect';
import RelatedContent           from '../components/RelatedContent';

// Material plugin
import { withStyles }   from '@material-ui/core/styles';
import FormHelperText   from '@material-ui/core/FormHelperText';
import FormControl      from '@material-ui/core/FormControl';
import FormLabel        from '@material-ui/core/FormLabel';
import TextField        from '@material-ui/core/TextField';
import Button           from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import Grid             from '@material-ui/core/Grid';
import Snackbar         from '@material-ui/core/Snackbar';
import Typography       from '@material-ui/core/Typography';
import Collapse         from "@material-ui/core/Collapse/Collapse";

const VisibleCollapse = withStyles({
  entered: {
    overflow: 'visible'
  }
})(Collapse);

class AssessmentForm extends React.Component {
  constructor(props) {
    super(props);

    const {t} = props;

    this.state = {
      editorState: EditorState.createEmpty(),
      collection_methods : [
        { value: 'structured', label: t('assessment.collection_methods.structured')},
        { value: 'unstructured', label: t('assessment.collection_methods.unstructured')},
        { value: 'key_informant', label: t('assessment.collection_methods.key_informant')},
        { value: 'focus_group', label: t('assessment.collection_methods.focus_group')},
        { value: 'observation', label: t('assessment.collection_methods.observation')},
        { value: 'baseline', label: t('assessment.collection_methods.baseline_data')},
        { value: 'phone', label: t('assessment.collection_methods.phone_interview')},
        { value: 'field', label: t('assessment.collection_methods.field_interview')},
        { value: 'email', label: t('assessment.collection_methods.email_interview')},
        { value: 'mixed', label: t('assessment.collection_methods.mixed')},
        { value: 'other', label: t('assessment.collection_methods.other')}
      ],
      unit_measurements  : [
        { value: 'Community', label: t('assessment.unit_measurements.community')},
        { value: 'Settlements', label: t('assessment.unit_measurements.settlements')},
        { value: 'Households', label: t('assessment.unit_measurements.households')},
        { value: 'Individuals', label: t('assessment.unit_measurements.individuals')},
      ],
      geographic_levels  : [
        { value: 'admin0', label: t('assessment.geographic_levels.national')},
        { value: 'admin1', label: t('assessment.geographic_levels.regional')},
        { value: 'admin2', label: t('assessment.geographic_levels.district')},
        { value: 'admin3', label: t('assessment.geographic_levels.subdistrict')},
        { value: 'admin4', label: t('assessment.geographic_levels.village')},
        { value: 'other', label: t('assessment.geographic_levels.other')},
        { value: 'non-representative', label: t('assessment.geographic_levels.non_representative')},
      ],
      frequencies : [
        { value: 'weekly', label: t('assessment.frequencies.weekly')},
        { value: 'monthly', label: t('assessment.frequencies.monthly')},
        { value: 'quarterly', label: t('assessment.frequencies.quarterly')},
        { value: 'yearly', label: t('assessment.frequencies.yearly')},
        { value: 'other', label: t('assessment.frequencies.other')}
      ],
      status             : '',
      doc                : {},
      collapseMain       : false,
      collapseSecondary  : false,
      wasSubmitted       : false,
    };

    this.hrinfoAPI      = new HRInfoAPI();
  }

  toggleCollapse = (collapse) => {
    if (collapse === "secondary") {
      this.setState({collapseSecondary: !this.state.collapseSecondary});
    }
    else if (collapse === "main") {
      this.setState({collapseMain: !this.state.collapseMain});
    }
  };

  submit = () => {
    this.setState({ wasSubmitted: true });
  };

  render() {
    const { t, i18n } = this.props;

    const disasters = this.props.doc.hasOperation
    ? (
      <FormControl fullWidth margin="normal">
        <FormLabel>{t('disasters')}</FormLabel>
        <HRInfoSelect
          type      = "disasters"
          spaces    = {this.props.doc.spaces}
          isMulti   = {true}
          onChange  = {(s) => this.props.handleSelectChange('disasters', s)}
          value     = {this.props.doc.disasters}/>
        <FormHelperText id="disasters-text">
          <Trans i18nKey='assessment.helpers.disasters'>Click on the field and select the disaster(s) or emergency the document
          refers to. Each disaster/emergency is associated with a number, called GLIDE, which is a common standard used by a wide network of organizations See
          <a href="http://glidenumer.net/?ref=hrinfo" target="_blank" rel="noopener noreferrer"> glidenumber.net</a>.</Trans>
        </FormHelperText>
      </FormControl>
    )
    : '';

    let bundles = '';
    if (this.props.doc.hasOperation) {
      const isBundlesRequired = this.props.isBundlesRequired();
      bundles = (
        <FormControl required={isBundlesRequired} fullWidth margin="normal">
          <FormLabel>{t('groups')}</FormLabel>
          <HRInfoSelect
            type     =  "bundles"
            spaces   =  {this.props.doc.spaces}
            isMulti =  {true}
            onChange  =  {(s) => this.props.handleSelectChange('bundles', s)}
            value =  {this.props.doc.bundles}/>
          <FormHelperText id="bundles-text">
            {t('assessments.helpers.bundles')}
          </FormHelperText>
        </FormControl>
      );
    }

    let title = t('assessment.create') + ' [' + t('languages.' + i18n.languages[0]) + ']';
    if (this.props.doc.id) {
      title = t('edit') + ' ' + this.props.doc.label + ' [' + t('languages.' + i18n.languages[0]) + ']';
    }
    else {
      if (this.props.doc && this.props.doc.isClone) {
        title = t('create') + ' ' + t('clone_of') + ' ' + this.props.doc.label + ' [' + t('languages.' + i18n.languages[0]) + ']';
      }
    }

    return (
      <Grid container direction="column" alignItems="center">
        <Typography gutterBottom variant = "h2">{title}</Typography>
        <Grid item>
          <Grid container justify="space-around">

            {/* LEFT COLUMN */}
            <Grid item md={6} xs={11}>
              {/* Title */}
              <FormControl required fullWidth margin = "normal">
                <FormLabel focused error={this.props.status === 'was-validated' && !this.props.isValid(this.props.doc.label)}>{t('title')}</FormLabel>
                <TextField type     = "text"
                           name     = "label"
                           id       = "label"
                           value    = {this.props.doc.label || ''}
                           onChange = {this.props.handleInputChange}/>
                <FormHelperText id = "label-text">
                  <Trans i18nKey={'assessment.helpers.title'}>Type the original title of the assessment.
                    Try not to use abbreviations. To see Standards and Naming Conventions click
                  <a href = "https://drive.google.com/open?id=1TxOek13c4uoYAQWqsYBhjppeYUwHZK7nhx5qgm1FALA" target="_blank" rel="noopener noreferrer"> here</a>.</Trans>
                </FormHelperText>
              </FormControl>

              {/* Dates */}
              <FormControl required fullWidth margin="normal">
                <FormLabel focused error={this.props.status === 'was-validated' && !this.props.isValid(this.props.doc.date)}>{t('date')}</FormLabel>
                <SimpleDate value    = {this.props.doc.date}
                           onChange = {(val) => {this.props.handleSelectChange('date', val);}}
                           required />
                <FormHelperText>
                  {t('assessment.helpers.date')}
                </FormHelperText>
              </FormControl>

              {/* Leading Organization */}
              <FormControl required fullWidth margin = "normal">
                <FormLabel focused error    = {this.props.status === 'was-validated' && !this.props.isValid(this.props.doc.organizations)}>{t('leading_organizations')}</FormLabel>
                <HRInfoAsyncSelect type="organizations"
                                   value           = {this.props.doc.organizations}
                                   onChange        = {(s) => this.props.handleSelectChange('organizations', s)}
                                   className       = {this.props.isValid(this.props.doc.organizations) ? 'is-valid' : 'is-invalid'}
                                   classNamePrefix = {this.props.isValid(this.props.doc.organizations) ? 'is-valid' : 'is-invalid'}
                                   isMulti         = {true}
                />
                <FormHelperText id = "organizations-text">
                  {t('assessment.helpers.leading_organizations')}
                </FormHelperText>
              </FormControl>

              {/* Participation Organization(s) */}
              <FormControl fullWidth margin = "normal">
                <FormLabel>{t('participating_organizations')}</FormLabel>
                <HRInfoAsyncSelect type            = "organizations"
                                   value           = {this.props.doc.participating_organizations}
                                   onChange        = {(s) => this.props.handleSelectChange('participating_organizations', s)}
                                   className       = {this.props.isValid(this.props.doc.participating_organizations) ? 'is-valid' : 'is-invalid'}
                                   classNamePrefix = {this.props.isValid(this.props.doc.participating_organizations) ? 'is-valid' : 'is-invalid'}
                                   isMulti         = {true}
                />
                <FormHelperText id = "participating_organizations-text">
                  {t('assessment.helpers.participating_organizations')}
                </FormHelperText>
              </FormControl>

              {/* Locations */}
              <FormControl required fullWidth margin = "normal">
                <FormLabel focused error  = {this.props.status === 'was-validated' && !this.props.isValid(this.props.doc.locations)}>{t('locations')}</FormLabel>
                <HRInfoLocations isMulti  = {true}
                                 onChange = {(s) => this.props.handleSelectChange('locations', s)}
                                 value    = {this.props.doc.locations}/>
                <FormHelperText id = "locations-text">
                  {t('assessment.helpers.locations')}
                </FormHelperText>
              </FormControl>

              {/* Other location */}
              <FormControl fullWidth margin = "normal">
                <FormLabel>{t('other_location')}</FormLabel>
                <TextField id       = "other_location"
                           type     = "text"
                           name     = "other_location"
                           value    = {this.props.doc.other_location || ''}
                           onChange = {this.props.handleInputChange}/>
                <FormHelperText id = "other_location-text">
                  {t('assessment.helpers.other_location')}
                </FormHelperText>
              </FormControl>

              {/* Population Type(s) */}
              <FormControl required fullWidth margin = "normal">
                <FormLabel focused error={this.props.status === 'was-validated' && !this.props.isValid(this.props.doc.population_types)}>{t('population_types')}</FormLabel>
                <HRInfoSelect type     = "population_types"
                              isMulti  = {true}
                              onChange = {(s) => this.props.handleSelectChange('population_types', s)}
                              value    = {this.props.doc.population_types}/>
                <FormHelperText id = "population_types-text">
                  {t('assessment.helpers.population_types')}
                </FormHelperText>
              </FormControl>

              <div className="more-info-button">
              { !this.state.collapseMain &&
              <Button color="secondary" variant="contained" onClick={() => this.toggleCollapse("main")}>
                <i className = "icon-plus" /> &nbsp; {t('add_more')}
              </Button>
              }
              { this.state.collapseMain &&
              <Button color="secondary" variant="contained" onClick={() => this.toggleCollapse("main")}>
                <i className = "icon-cancel" /> &nbsp; {t('hide_information')}
              </Button>
              }
            </div>

              <Collapse in={this.state.collapseMain}>
                {/* Subject */}
                <FormControl fullWidth margin = "normal">
                  <FormLabel>{t('subject')}</FormLabel>
                  <TextField id       = "subject"
                             type     = "textarea"
                             name     = "subject"
                             multiline = {true}
                             rowsMax   = "4"
                             value    = {this.props.doc.subject}
                             onChange = {this.props.handleInputChange}/>
                  <FormHelperText id = "subject-text">
                    {t('assessment.helpers.subject')}
                  </FormHelperText>
                </FormControl>

                {/* Methodology */}
                <FormControl fullWidth margin = "normal">
                  <FormLabel>{t('methodology')}</FormLabel>
                  <TextField id       = "methodology"
                             type     = "textarea"
                             name     = "methodology"
                             multiline = {true}
                             rowsMax   = "4"
                             value    = {this.props.doc.methodology}
                             onChange = {this.props.handleInputChange}/>
                  <FormHelperText id = "methodology-text">
                    {t('assessment.helpers.methodology')}
                  </FormHelperText>
                </FormControl>

                {/* Key findings */}
                <FormControl fullWidth margin = "normal">
                  <FormLabel>{t('key_findings')}</FormLabel>
                  <TextField id       = "key_findings"
                             type     = "textarea"
                             name     = "key_findings"
                             multiline = {true}
                             rowsMax   = "4"
                             value    = {this.props.doc.key_findings}
                             onChange = {this.props.handleInputChange}/>
                  <FormHelperText id = "key_findings-text">
                    {t('assessment.helpers.key_findings')}
                  </FormHelperText>
                </FormControl>

                {/* Sample size */}
                <FormControl fullWidth margin = "normal">
                  <FormLabel>{t('sample_size')}</FormLabel>
                  <TextField id       = "sample_size"
                             type     = "text"
                             name     = "sample_size"
                             onChange = {this.props.handleInputChange}
                             value    = {this.props.doc.sample_size || ''}/>
                  <FormHelperText id = "sample_size-text">
                    {t('assessment.helpers.sample_size')}
                  </FormHelperText>
                </FormControl>

                {/* Related Content */}
                <FormControl fullWidth margin = "normal">
                <FormLabel>{t('related_content.related_content')}</FormLabel>
                <RelatedContent onChange = {(s) => this.props.handleSelectChange('related_content', s)}
                                value    = {this.props.doc.related_content}/>
                <FormHelperText id = "agendas-text">
                  {t('assessment.helpers.related_content')}
                </FormHelperText>
              </FormControl>
              </Collapse>
            </Grid>

            {/* SECOND COLUMN */}
            <Grid item md={3} xs={11}>
              {/* Languages */}
              <FormControl required fullWidth margin="normal">
                <FormLabel focused error  = {this.props.status === 'was-validated' && !this.props.isValid(this.props.doc.language)}>{t('language')}</FormLabel>
                <LanguageSelect value     = {this.props.doc.language}
                                onChange  = {(s) => this.props.handleSelectChange('language', s)}
                                className = {this.props.isValid(this.props.doc.language) ? 'is-valid' : 'is-invalid'}
                                classNamePrefix = {this.props.isValid(this.props.doc.language) ? 'is-valid' : 'is-invalid'}/>
                <FormHelperText id="language-text">
                  {t('assessment.helpers.language')}
                </FormHelperText>
              </FormControl>

              {/* Status */}
              <FormControl required fullWidth margin = "normal">
                <FormLabel focused error = {this.props.status === 'was-validated' && !this.props.isValid(this.props.doc.status)}>{t('status')}</FormLabel>
                <AssessmentStatus value     = {this.props.doc.status}
                                  onChange  = {(s) => this.props.handleSelectChange('status', s)}
                                  className = {this.props.isValid(this.props.doc.status) ? 'is-valid' : 'is-invalid'}
                                  classNamePrefix = {this.props.isValid(this.props.doc.status) ? 'is-valid' : 'is-invalid'}/>
                <FormHelperText id = "status-text">
                  {t('assessment.helpers.status')}
                </FormHelperText>
              </FormControl>

              {/* Operation(s)/Webspace(s) */}
              <FormControl required fullWidth margin="normal">
                <FormLabel focused error ={this.props.status === 'was-validated' && !this.props.isValid(this.props.doc.spaces)}>{t('spaces')}</FormLabel>
                <HRInfoSelect type    = "operations"
                              isMulti = {true}
                              onChange={(s) => this.props.handleSelectChange('spaces', s)}
                              value   = {this.props.doc.spaces}/>
                <FormHelperText>
                  {t('assessment.helpers.spaces')}
                </FormHelperText>
              </FormControl>

              {/* Bundles (Cluster(s)/Sector(s)) */}
              {bundles}

              {/* Report */}
              <FormControl required fullWidth margin = "normal">
                <FormLabel focused error ={this.props.status === 'was-validated' && !this.props.isValid(this.props.doc.report)}>{t('files.assessment_report')}</FormLabel>
                <HRInfoFilesAccessibility onChange={(s) => this.props.handleSelectChange('report', s)}
                                          value={this.props.doc.report} />
                <FormHelperText id = "report-text">
                  <Trans i18nKey='assessment.helpers.assessment_report'>Upload the assessment report file, stored on your computer
                    or on your Dropbox account, and indicate its level of accessibility. If the file is
                    “Available on request”, write the instructions in the related space.
                    To see File Standards and Naming Conventions click
                    <a href="https://drive.google.com/open?id=1TxOek13c4uoYAQWqsYBhjppeYUwHZK7nhx5qgm1FALA" target="_blank" rel="noopener noreferrer"> here</a>.</Trans>
                </FormHelperText>
              </FormControl>

              {/* Questionnaire */}
              <FormControl fullWidth margin = "normal">
                <FormLabel>{t('files.assessment_questionnaire')}</FormLabel>
                <HRInfoFilesAccessibility onChange={(s) => this.props.handleSelectChange('questionnaire', s)}
                                          value={this.props.doc.questionnaire} />
                <FormHelperText id = "questionnaire-text">
                  <Trans i18nKey='assessment.helpers.assessment_questionnaire'>Upload the assessment questionnaire file, stored on
                    your computer or on your Dropbox account, and indicate its level of accessibility.
                    If the file is “Available on request”, write the instructions in the related space.
                    To see File Standards and Naming Conventions click
                    <a href="https://drive.google.com/open?id=1TxOek13c4uoYAQWqsYBhjppeYUwHZK7nhx5qgm1FALA" target="_blank" rel="noopener noreferrer"> here</a>.</Trans>
                </FormHelperText>
              </FormControl>

              {/* Data */}
              <FormControl required fullWidth margin = "normal">
                <FormLabel focused error ={this.props.status === 'was-validated' && !this.props.isValid(this.props.doc.data)}>{t('files.assessment_data')}</FormLabel>
                <HRInfoFilesAccessibility onChange={(s) => this.props.handleSelectChange('data', s)}
                                          value={this.props.doc.data} />
                <FormHelperText id = "data-text">
                  <Trans i18nKey='assessment.helpers.assessment_data'>Upload the assessment data file, stored on your computer or
                    on your Dropbox account, and indicate its level of accessibility. If the file is “Available on request”,
                    write the instructions in the related space. To see File Standards and Naming Conventions  click
                    <a href="https://drive.google.com/open?id=1TxOek13c4uoYAQWqsYBhjppeYUwHZK7nhx5qgm1FALA" target="_blank" rel="noopener noreferrer"> here</a>.</Trans>
                </FormHelperText>
              </FormControl>

              <div className="more-info-button">
                { !this.state.collapseSecondary &&
                <Button color="secondary" variant="contained" onClick={() => this.toggleCollapse("secondary")}>
                  <i className = "icon-plus" /> &nbsp; {t('add_more')}
                </Button>
                }
                { this.state.collapseSecondary &&
                <Button color="secondary" variant="contained" onClick={() => this.toggleCollapse("secondary")}>
                  <i className = "icon-cancel" /> &nbsp; {t('hide_information')}
                </Button>
                }
              </div>

              <VisibleCollapse in={this.state.collapseSecondary}>
                {/* Theme(s) */}
                <FormControl fullWidth margin = "normal">
                  <FormLabel>{t('themes')}</FormLabel>
                  <HRInfoSelect type     = "themes"
                                isMulti  = {true}
                                onChange = {(s) => this.props.handleSelectChange('themes', s)}
                                value    = {this.props.doc.themes}/>
                  <FormHelperText id = "themes-text">
                    {t('assessment.helpers.themes')}
                  </FormHelperText>
                </FormControl>

                {/* Disasters */}
                {disasters}

                {/* Level of Representation */}
                <FormControl fullWidth margin = "normal">
                  <FormLabel>{t('geographic_level')}</FormLabel>
                  <HRInfoSelect type     = "geographic_level"
                                onChange = {(s) => this.props.handleSelectChange('geographic_level', s)}
                                options  = {this.state.geographic_levels}
                                value    = {this.props.doc.geographic_level}/>
                  <FormHelperText id = "geographic_level-text">
                    {t('assessment.helpers.geographic_level')}
                  </FormHelperText>
                </FormControl>

                {/* Frequency */}
                <FormControl fullWidth margin = "normal">
                  <FormLabel>{t('frequency')}</FormLabel>
                  <HRInfoSelect type     = "frequency"
                                onChange = {(s) => this.props.handleSelectChange('frequency', s)}
                                options  = {this.state.frequencies}
                                value    = {this.props.doc.frequency}/>
                  <FormHelperText id = "frequency-text">
                    {t('assessment.helpers.frequency')}
                  </FormHelperText>
                </FormControl>

                {/* Unit(s) of Measurement */}
                <FormControl fullWidth margin = "normal">
                  <FormLabel>{t('unit_measurement')}</FormLabel>
                  <HRInfoSelect type     = "measurement_units"
                                onChange = {(s) => this.props.handleSelectChange('unit_measurement', s)}
                                options  = {this.state.unit_measurements}
                                value    = {this.props.doc.unit_measurement}
                                isMulti  = {true}/>
                  <FormHelperText id = "unit_measurement-text">
                    {t('assessment.helpers.unit_measurement')}
                  </FormHelperText>
                </FormControl>

                {/* Collection Method(s) */}
                <FormControl fullWidth margin = "normal">
                  <FormLabel>{t('collection_method')}</FormLabel>
                  <HRInfoSelect type     = "collection_method"
                                onChange = {(s) => this.props.handleSelectChange('collection_method', s)}
                                options  = {this.state.collection_methods}
                                value    = {this.props.doc.collection_method}
                                isMulti  = {true}/>
                  <FormHelperText id = "collection_method-text">
                    {t('assessment.helpers.collection_method')}
                  </FormHelperText>
                </FormControl>

                {/* Contact(s) */}
                <FormControl fullWidth margin = "normal">
                  <FormLabel>{t('contacts')}</FormLabel>
                  <HidContacts isMulti={true}
                               id="contacts"
                               onChange={(s) => this.props.handleSelectChange('contacts', s)}
                               value={this.props.doc.contacts}/>
                  <FormHelperText id = "contacts-text">
                    {t('assessment.helpers.contacts')}
                  </FormHelperText>
                </FormControl>
              </VisibleCollapse>
  					</Grid>
  				</Grid>
  			</Grid>

        <Grid item className="submission">
        {
          this.props.status !== 'submitting' &&
          <span>
            <Button color="primary" variant="contained" onClick={(evt) => {this.props.handleSubmit(evt); this.submit()}}>{t('publish')}</Button>
              &nbsp;
            <Button color="secondary" variant="contained" onClick={(evt) => {this.props.handleSubmit(evt, 1); this.submit()}}>{t('save_as_draft')}</Button>
              &nbsp;
          </span>
        }
        {
          (this.props.status === 'submitting' || this.props.status === 'deleting') &&
          <CircularProgress />
        }
        {
          (this.props.match.params.id && this.props.status !== 'deleting') &&
          <span>
            <Button color="secondary" variant="contained" onClick={this.props.handleDelete}>{t('delete')}</Button>
          </span>
        }
        </Grid>
        <Snackbar anchorOrigin={{
            vertical  : 'bottom',
            horizontal: 'left'
          }}
          open             = {this.props.status === 'was-validated' && this.state.wasSubmitted}
          autoHideDuration = {6000}
          onClose          = {this.hideAlert}
          ContentProps     = {{
            'aria-describedby' : 'message-id'
          }}
          message={<Typography id ="message-id" color="error">{t('form_incomplete')}</Typography>}
          action={[
            <Button key="undo" color="secondary" size="small" onClick={this.hideAlert}>
            {t('close')}
            </Button>
          ]}
        />
      </Grid>
    );
  }
}

export default translate('forms')(AssessmentForm);
