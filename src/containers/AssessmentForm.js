import React from 'react';
import { EditorState, ContentState, convertFromHTML } from 'draft-js';
// import { Editor } from 'react-draft-wysiwyg';
// import {stateToHTML} from 'draft-js-export-html';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { translate, Trans } from 'react-i18next';

import HRInfoAPI from '../api/HRInfoAPI';

// Components
import HRInfoSelect             from '../components/HRInfoSelect';
import HRInfoLocations          from '../components/HRInfoLocations';
import HRInfoAsyncSelect        from '../components/HRInfoAsyncSelect';
import HidContacts              from '../components/HidContacts';
import EventDate                from '../components/EventDate';
import AssessmentStatus         from "../components/AssessmentStatus";
import HRInfoFilesAccessibility from "../components/HRInfoFilesAccessibility";
import LanguageSelect           from '../components/LanguageSelect';
import RelatedContent           from '../components/RelatedContent';

// Material plugin
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

class AssessmentForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      editorState: EditorState.createEmpty(),
      collection_methods : [
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
      ],
      unit_measurements  : [
        { value: 'Community', label: 'Community'},
        { value: 'Settlements', label: 'Settlements'},
        { value: 'Households', label: 'Households'},
        { value: 'Individuals', label: 'Individuals'},
      ],
      geographic_levels  : [
        { value: 'District', label: 'District'},
        { value: 'National', label: 'National'},
        { value: 'Non-representative', label: 'Non-representative'},
        { value: 'Other', label: 'Other'},
        { value: 'Province', label: 'Province'},
        { value: 'Regional', label: 'Regional'},
        { value: 'Sub-district', label: 'Sub-district'},
        { value: 'Village', label: 'Village'}
      ],
      status             : '',
      doc                : {},
      collapseMain       : false,
      collapseSecondary  : false,
      wasSubmitted       : false,
    };

    this.hrinfoAPI      = new HRInfoAPI();

    this.toggleCollapse = this.toggleCollapse.bind(this);
  }

  toggleCollapse(collapse) {
    if (collapse === "secondary") {
      this.setState({collapseSecondary: !this.state.collapseSecondary});
    }
    else if (collapse === "main") {
      this.setState({collapseMain: !this.state.collapseMain});
    }
  }

  submit() {
    this.setState({ wasSubmitted: true });
  }

  render() {
    const { t, label } = this.props;
    // const { editorState } = this.state;

    return (
      <Grid container direction="column" alignItems="center">
        <Typography color="textSecondary" gutterBottom variant = "headline">{t(label + '.create')}</Typography>
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
                  <Trans i18nKey={label + '.helpers.title'}>Type the original title of the assessment.
                    Try not to use abbreviations. To see Standards and Naming Conventions click
                  <a href = "https://drive.google.com/open?id=1TxOek13c4uoYAQWqsYBhjppeYUwHZK7nhx5qgm1FALA"> here</a>.</Trans>
                </FormHelperText>
              </FormControl>

              {/* Dates */}
              <FormControl required fullWidth margin="normal">
                <FormLabel focused error={this.props.status === 'was-validated' && !this.props.isValid(this.props.doc.date)}>{t('date')}</FormLabel>
                <EventDate value    = {this.props.doc.date}
                           onChange = {(val) => {this.props.handleSelectChange('date', val);}}
                           required />
                <FormHelperText>
                  <Trans i18nKey={label + '.helpers.date'}>Indicate the start/end dates of the assessment.</Trans>
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
                  <Trans i18nKey={label + '.helpers.leading_organizations'}>Type in and select from the list the organization(s)
                    conducting the assessment.</Trans>
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
                  <Trans i18nKey={label + '.helpers.participating_organizations'}>Type in and select from the list
                    the organization(s) taking part into (but not leading) the assessment.
                    To indicate multiple organizations add a comma after each entry.</Trans>
                </FormHelperText>
              </FormControl>

              {/* Locations */}
              <FormControl required fullWidth margin = "normal">
                <FormLabel focused error  = {this.props.status === 'was-validated' && !this.props.isValid(this.props.doc.locations)}>{t('locations')}</FormLabel>
                <HRInfoLocations isMulti  = {true}
                                 onChange = {(s) => this.props.handleSelectChange('locations', s)}
                                 value    = {this.props.doc.locations}/>
                <FormHelperText id = "locations-text">
                  <Trans i18nKey={label + '.helpers.locations'}>Select from the menu the country(ies) the assessment is
                    about and indicate more specific locations by selecting multiple layers (region, province, town). </Trans>
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
                  <Trans i18nKey={label + '.helpers.other_location'}>You can specify here a location not available
                    in the Location(s) field list.</Trans>
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
                  <Trans i18nKey={label + '.helpers.population_types'}>Click on the field and select the segment(s) of
                    the population targeted by the assessment. You can select multiple population types. </Trans>
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
                    <Trans i18nKey={label + '.helpers.subject'}>Insert a brief description of the topic of the
                      assessment and what its goals are.</Trans>
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
                    <Trans i18nKey={label + '.helpers.methodology'}>Insert a brief description of the procedures and the
                      techniques used to collect, store and analyse the data.</Trans>
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
                    <Trans i18nKey={label + '.helpers.key_findings'}>Insert a brief summary of the assessment’s results.</Trans>
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
                    <Trans i18nKey={label + '.helpers.sample_size'}>Indicate the number of
                      communities/households/individuals surveyed during the assessment.</Trans>
                  </FormHelperText>
                </FormControl>

                {/* Related Content */}
                <FormControl fullWidth margin = "normal">
                <FormLabel>{t('related_content.related_content')}</FormLabel>
                <RelatedContent onChange = {(s) => this.props.handleSelectChange('related_content', s)}
                                value    = {this.props.doc.related_content}/>
                <FormHelperText id = "agendas-text">
                  <Trans i18nKey={label + '.helpers.related_content'}>Add links to content that is related to the event
                    you are creating by indicating the title of the content and its url. When using the Search function
                    make sure to search by content title.</Trans>
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
                  <Trans i18nKey={label + '.helpers.language'}>Select the language of the document.</Trans>
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
                  <Trans i18nKey={label + '.helpers.status'}>Indicate the phase of the assessment.
                    Please remember to update this field as phases move on.</Trans>
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
                  <Trans i18nKey={label + '.helpers.spaces'}>Click on the field and select where to publish the assessment
                    (operation, regional site or thematic site).</Trans>
                </FormHelperText>
              </FormControl>

              {/* Bundles (Cluster(s)/Sector(s)) */}
              <FormControl required fullWidth margin="normal">
                <FormLabel focused error={this.props.status === 'was-validated' && !this.props.isValid(this.props.doc.bundles)}>{t('bundles')}</FormLabel>
                <HRInfoSelect type="bundles"
                              isMulti={true}
                              onChange={(s) => this.props.handleSelectChange('bundles', s)}
                              value={this.props.doc.bundles} />
                <FormHelperText id = "bundles-text">
                  <Trans i18nKey={label + '.helpers.bundles'}>Indicate the cluster(s)/sector(s) the assessment refers to.</Trans>
                </FormHelperText>
              </FormControl>

              {/* Report */}
              <FormControl required fullWidth margin = "normal">
                <FormLabel focused error ={this.props.status === 'was-validated' && !this.props.isValid(this.props.doc.report)}>{t('files.assessment_report')}</FormLabel>
                <HRInfoFilesAccessibility onChange={(s) => this.props.handleSelectChange('report', s)}
                                          onInputChange={this.props.handleInputChange}
                                          value={this.props.doc.report} />
                <FormHelperText id = "report-text">
                  <Trans i18nKey='helpers.assessment_report'>Upload the assessment report file, stored on your computer
                    or on your Dropbox account, and indicate its level of accessibility. If the file is
                    “Available on request”, write the instructions in the related space.
                    To see File Standards and Naming Conventions click
                    <a href="https://drive.google.com/open?id=1TxOek13c4uoYAQWqsYBhjppeYUwHZK7nhx5qgm1FALA"> here</a>.</Trans>
                </FormHelperText>
              </FormControl>

              {/* Questionnaire */}
              <FormControl fullWidth margin = "normal">
                <FormLabel>{t('files.assessment_questionnaire')}</FormLabel>
                <HRInfoFilesAccessibility onChange={(s) => this.props.handleSelectChange('questionnaire', s)}
                                          value={this.props.doc.questionnaire} />
                <FormHelperText id = "questionnaire-text">
                  <Trans i18nKey='helpers.assessment_questionnaire'>Upload the assessment questionnaire file, stored on
                    your computer or on your Dropbox account, and indicate its level of accessibility.
                    If the file is “Available on request”, write the instructions in the related space.
                    To see File Standards and Naming Conventions click
                    <a href="https://drive.google.com/open?id=1TxOek13c4uoYAQWqsYBhjppeYUwHZK7nhx5qgm1FALA"> here</a>.</Trans>
                </FormHelperText>
              </FormControl>

              {/* Data */}
              <FormControl required fullWidth margin = "normal">
                <FormLabel focused error ={this.props.status === 'was-validated' && !this.props.isValid(this.props.doc.data)}>{t('files.assessment_data')}</FormLabel>
                <HRInfoFilesAccessibility onChange={(s) => this.props.handleSelectChange('data', s)}
                                          value={this.props.doc.data} />
                <FormHelperText id = "data-text">
                  <Trans i18nKey='helpers.assessment_data'>Upload the assessment data file, stored on your computer or
                    on your Dropbox account, and indicate its level of accessibility. If the file is “Available on request”,
                    write the instructions in the related space. To see File Standards and Naming Conventions  click
                    <a href="https://drive.google.com/open?id=1TxOek13c4uoYAQWqsYBhjppeYUwHZK7nhx5qgm1FALA"> here</a>.</Trans>
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

              <Collapse in={this.state.collapseSecondary}>
                {/* Theme(s) */}
                <FormControl fullWidth margin = "normal">
                  <FormLabel>{t('themes')}</FormLabel>
                  <HRInfoSelect type     = "themes"
                                isMulti  = {true}
                                onChange = {(s) => this.props.handleSelectChange('themes', s)}
                                value    = {this.props.doc.themes}/>
                  <FormHelperText id = "themes-text">
                    <Trans i18nKey={label + '.helpers.themes'}>Click on the field and select all relevant themes.
                      Choose only themes the document substantively refers to.</Trans>
                  </FormHelperText>
                </FormControl>

                {/* Disasters */}
                <FormControl fullWidth margin="normal">
                  <FormLabel>{t('disasters')}</FormLabel>
                  <HRInfoSelect type     = "disasters"
                                spaces   = {this.props.doc.spaces}
                                isMulti  = {true}
                                onChange = {(s) => this.props.handleSelectChange('disasters', s)}
                                value    = {this.props.doc.disasters} />
                  <FormHelperText id = "disasters-text">
                    <Trans i18nKey={label + '.helpers.disasters'}>Click on the field and select the disaster(s) or
                      emergency the assessment refers to.</Trans>
                  </FormHelperText>
                </FormControl>

                {/* Level of Representation */}
                <FormControl fullWidth margin = "normal">
                  <FormLabel>{t('geographic_level')}</FormLabel>
                  <HRInfoSelect type     = "geographic_level"
                                onChange = {(s) => this.props.handleSelectChange('geographic_level', s)}
                                options  = {this.state.geographic_levels}
                                value    = {this.props.doc.geographic_level}/>
                  <FormHelperText id = "geographic_level-text">
                    <Trans i18nKey={label + '.helpers.geographic_level'}>Select at what geographical level the
                      assessment is (has been) conducted.</Trans>
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
                    <Trans i18nKey={label + '.helpers.unit_measurement'}>Click on the field and select the unit(s) of
                      measurement used for the assessment.</Trans>
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
                    <Trans i18nKey={label + '.helpers.collection_method'}>Click on the field and select the collection
                      method(s) used to gather information during the assessment.</Trans>
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
                    <Trans i18nKey={label + '.helpers.contacts'}>Indicate the person(s) to contact for information
                      regarding the event. To show up in the list, the person must have a HumanitarianID profile.</Trans>
                  </FormHelperText>
                </FormControl>
              </Collapse>
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
