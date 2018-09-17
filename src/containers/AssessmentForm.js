import React from 'react';
import { EditorState, ContentState, convertFromHTML } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import {stateToHTML} from 'draft-js-export-html';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import Select from 'react-select';
import { translate, Trans } from 'react-i18next';

import HRInfoAPI from '../api/HRInfoAPI';

// Components
import HRInfoSelect       from '../components/HRInfoSelect';
import HRInfoLocations    from '../components/HRInfoLocations';
import HRInfoAsyncSelect  from '../components/HRInfoAsyncSelect';
import RelatedContent     from '../components/RelatedContent';
import HidContacts        from '../components/HidContacts';
import Address            from '../components/Address';
import EventDate          from '../components/EventDate';

// Material plugin
import FormHelperText   from '@material-ui/core/FormHelperText';
import FormControl      from '@material-ui/core/FormControl';
import FormLabel        from '@material-ui/core/FormLabel';
import TextField        from '@material-ui/core/TextField';
import Button           from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import Collapse         from '@material-ui/core/Collapse';
import Card             from '@material-ui/core/Card';
import Grid             from '@material-ui/core/Grid';
import Snackbar         from '@material-ui/core/Snackbar';
import Typography       from '@material-ui/core/Typography';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox         from '@material-ui/core/Checkbox';

class AssessmentForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      doc: {
        label: '',
        date: [{}],
        address: {}
      },
      editorState: EditorState.createEmpty(),
      languages: [
        { value: 'en', label: 'English'},
        { value: 'fr', label: 'French' },
        { value: 'es', label: 'Spanish' },
        { value: 'ru', label: 'Russian' }
      ],
      assessment_statuses: [
        { value: 'Planned', label: 'Planned'},
        { value: 'Ongoing', label: 'Ongoing'},
        { value: 'Draft / Preliminary Results', label: 'Draft / Preliminary Results'},
        { value: 'Field work completed', label: 'Field work completed'},
        { value: 'Report completed', label: 'Report completed'}
      ],
      collection_methods: [
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
      masurement_units: [
        { value: 'Community', label: 'Community'},
        { value: 'Settlements', label: 'Settlements'},
        { value: 'Households', label: 'Households'},
        { value: 'Individuals', label: 'Individuals'},
      ],
      geographic_levels: [
        { value: 'District', label: 'District'},
        { value: 'National', label: 'National'},
        { value: 'Non-representative', label: 'Non-representative'},
        { value: 'Other', label: 'Other'},
        { value: 'Province', label: 'Province'},
        { value: 'Regional', label: 'Regional'},
        { value: 'Sub-district', label: 'Sub-district'},
        { value: 'Village', label: 'Village'}
      ],
      status: ''
    };

    this.hrinfoAPI = new HRInfoAPI();

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSelectChange = this.handleSelectChange.bind(this);
    this.onEditorStateChange = this.onEditorStateChange.bind(this);
    this.validateForm = this.validateForm.bind(this);
    this.isValid = this.isValid.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
  }

  handleInputChange(event) {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    let doc = this.state.doc;
    doc[name] = value;
    this.setState({
      doc: doc
    });
  }

  handleSelectChange (name, selected) {
    let doc = this.state.doc;
    if (name === 'date') {
      doc[name][0] = selected;
    }
    else {
      doc[name] = selected;
    }
    let hasOperation = this.state.doc.hasOperation ? this.state.doc.hasOperation : false;
    if (name === 'spaces') {
      doc.spaces.forEach(function (val) {
        if (val.type === 'operations') {
          hasOperation = true;
        }
      });
    }
    doc.hasOperation = hasOperation;
    this.setState({
      doc: doc
    });
  }

  isValid (value) {
    if (typeof value === 'undefined') {
      return false;
    }
    if (!value) {
      return false;
    }
    if (Array.isArray(value) && value.length === 0) {
      return false;
    }
    if (value.files && value.files.length === 0) {
      return false;
    }
    if (typeof value === 'string' && value === 'und') {
      return false;
    }
    return true;
  }

  validateForm () {
    const doc = this.state.doc;
    if (this.isValid(doc.language) &&
      this.isValid(doc.spaces) &&
      this.isValid(doc.label) &&
      this.isValid(doc.category)  &&
      this.isValid(doc.date) &&
      this.isValid(doc.organizations)) {
      return true;
    }
    else {
      return false;
    }
  }

  handleSubmit(event, isDraft = 0) {
    event.preventDefault();
    const isValid = this.validateForm();
    /*if (!isValid) {
      this.setState({
        status: 'was-validated'
      });
      return;
    }*/
    this.setState({
      status: 'submitting'
    });
    const token = this.props.token;
    let doc = {};
    let body = JSON.stringify(this.state.doc);
    body = JSON.parse(body);
    body.published = isDraft ? 0 : 1;
    body.category = body.category.value;
    body.operation = [];
    body.space = [];
    body.spaces.forEach(function (sp) {
      if (sp.type === 'operations') {
        body.operation.push(sp.id);
      }
      else {
        body.space.push(sp.id);
      }
    });
    delete body.spaces;
    delete body.hasOperation;
    const selectFields = ['organizations', 'bundles', 'offices', 'disasters', 'themes'];
    selectFields.forEach(function (field) {
      if (body[field]) {
        for (let i = 0; i < body[field].length; i++) {
          body[field][i] = parseInt(body[field][i].id, 10);
        }
      }
    });
    if (body.locations) {
      let locations = [];
      body.locations.forEach(function (location, index) {
        let last = 0;
        for (let j = 0; j < location.length; j++) {
          if (typeof location[j] === 'object') {
            last = j;
          }
        }
        locations.push(parseInt(location[last].id, 10));
      });
      body.locations = locations;
    }
    body.language = body.language.value;
    if (body.address && body.address.country && typeof body.address.country === 'object') {
      body.address.country = body.address.country.pcode;
    }
    if (body.date[0] && body.date[0].timezone_db) {
      body.date[0].timezone_db = body.date[0].timezone_db.value;
    }
    if (body.date[0] && body.date[0].timezone) {
      body.date[0].timezone = body.date[0].timezone.value;
    }

    this.hrinfoAPI
      .save('assessments', body)
      .then(doc => {
        this.props.history.push('/assessments/' + doc.id);
      })
      .catch(err => {
        this.props.setAlert('danger', 'There was an error uploading your document');
      });
  }

  handleDelete () {
    if (this.props.match.params.id) {
      const that = this;
      this.setState({
        status: 'deleting'
      });
      this.hrinfoAPI
        .remove('assessments', this.props.match.params.id)
        .then(results => {
          that.props.setAlert('success', 'Assessment deleted successfully');
          that.props.history.push('/home');
        }).catch(function(err) {
          that.props.setAlert('danger', 'There was an error deleting your assessment');
          that.props.history.push('/home');
        });
    }
  }

  onEditorStateChange (editorState) {
    let html = stateToHTML(editorState.getCurrentContent());
    let doc = this.state.doc;
    doc.body = html;
    this.setState({
      editorState,
      doc: doc
    });
  }

  async componentDidMount() {
    if (this.props.match.params.id) {
      const doc = await this.hrinfoAPI.getItem('assessments', this.props.match.params.id);
      doc.spaces = [];
      doc.operation.forEach(function (op) {
        if (op) {
          doc.hasOperation = true;
          op.type = "operations";
          doc.spaces.push(op);
        }
      });
      doc.space.forEach(function (sp) {
        if (sp) {
          sp.type = "spaces";
          doc.spaces.push(sp);
        }
      });
      this.state.languages.forEach(function (lang) {
        if (doc.language === lang.value) {
          doc.language = lang;
        }
      });
      this.state.event_categories.forEach(function (category) {
        if (category.value === parseInt(doc.category, 10)) {
          doc.category = category;
        }
      });
      let state = {
        doc: doc
      };
      if (doc['body-html']) {
        const blocksFromHTML = convertFromHTML(doc['body-html']);
        const contentState = ContentState.createFromBlockArray(
          blocksFromHTML.contentBlocks,
          blocksFromHTML.entityMap
        );
        state.editorState = EditorState.createWithContent(contentState);
      }
      this.setState(state);
    }
  }

  render() {
    const { t, label } = this.props;

    const disasters = this.state.doc.hasOperation ? (
      <FormControl fullWidth margin="normal">
        <FormLabel error={this.props.status === 'was-validated' && !this.props.isValid(this.props.doc.disasters)}>Disaster(s) / Emergency</FormLabel>
        <HRInfoSelect type="disasters"
          spaces={this.props.doc.spaces}
          isMulti={true}
          onChange={(s) => this.props.handleSelectChange('disasters', s)}
          value={this.props.doc.disasters} />
        <FormHelperText id = "disasters-text">
          Click on the field and select the disaster(s) or emergency the assessment refers to.
          Each disaster/emergency is associated with a number, called GLIDE, which is a common standard used by a wide network of organizations.
          See <a href="http://glidenumer.net/?ref=hrinfo">glidenumber.net</a>.
        </FormHelperText>
      </FormControl>
    ) : '';

    const bundles = this.state.doc.hasOperation ? (
      <FormControl fullWidth margin="normal">
        <FormLabel error={this.props.status === 'was-validated' && !this.props.isValid(this.props.doc.bundles)}>Cluster(s)/Sector(s)</FormLabel>
        <HRInfoSelect type="bundles"
          spaces={this.props.doc.spaces}
          isMulti={true}
          onChange={(s) => this.props.handleSelectChange('bundles', s)}
          value={this.props.doc.bundles} />
        <FormHelperText id = "bundles-text">
          Indicate the cluster(s)/sector(s) the assessment refers to.
        </FormHelperText>
      </FormControl>
    ) : '';

    const { editorState } = this.state;

    return (
      <Grid container direction="column" alignItems="center">
        <Typography color="textSecondary" gutterBottom variant = "headline">Create Assessment</Typography>
        <Grid item>
          <Grid container justify="space-around">

            {/* FIRST COLUMN */}
            <Grid item md={6} xs={11}>
              {/* Copied from Document Form, TODO change */}
              {/*<FormControl required fullWidth margin = "normal">
                <FormLabel focused error={this.props.status === 'was-validated' && !this.props.isValid(this.props.doc.label)}>{t('title')}</FormLabel>
                <TextField
                  type     = "text"
                  name     = "label"
                  id       = "label"
                  value    = {this.props.doc.label}
                  onChange = {this.props.handleInputChange}/>
                <FormHelperText id = "label-text">
                  <Trans i18nKey={label + '.helpers.title'}>Type the original title of the document. Try not to use abbreviations. To see Standards and Naming Conventions click
                  <a href = "https://drive.google.com/open?id=1TxOek13c4uoYAQWqsYBhjppeYUwHZK7nhx5qgm1FALA"> here</a>.</Trans>
                </FormHelperText>
              </FormControl>
            </Grid>*/}

            {/* SECOND COLUMN */}
            <Grid item md={3} xs={11}>
              {/* TODO same */}
              {/*<FormControl required fullWidth margin="normal">
                <FormLabel focused error={this.props.status === 'was-validated' && !this.props.isValid(this.props.doc.spaces)}>{t('spaces')}</FormLabel>
                <HRInfoSelect type="spaces" isMulti={true} onChange={(s) => this.props.handleSelectChange('spaces', s)} value={this.props.doc.spaces}/>
                <FormHelperText>
                  {t(label + '.helpers.spaces')}
                </FormHelperText>
              </FormControl>*/}
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

    /*const disasters = this.state.doc.hasOperation ? (
      <FormGroup>
        <Label for="disasters">Disaster(s) / Emergency</Label>
        <HRInfoSelect type="disasters" spaces={this.state.doc.spaces} isMulti={true} onChange={(s) => this.handleSelectChange('disasters', s)} value={this.state.doc.disasters} />
        <FormText color="muted">
          Click on the field and select the disaster(s) or emergency the assessment refers to. Each disaster/emergency is associated with a number, called GLIDE, which is a common standard used by a wide network of organizations See <a href="http://glidenumer.net/?ref=hrinfo">glidenumber.net</a>.
        </FormText>
      </FormGroup>
    ) : '';

    const bundles = this.state.doc.hasOperation ? (
      <FormGroup>
        <Label for="bundles">Cluster(s)/Sector(s)</Label>
        <HRInfoSelect type="bundles" spaces={this.state.doc.spaces} isMulti={true} onChange={(s) => this.handleSelectChange('bundles', s)} value={this.state.doc.bundles} />
        <FormText color="muted">
          Indicate the cluster(s)/sector(s) the assessment refers to.
        </FormText>
      </FormGroup>
    ) : '';

    const { editorState } = this.state;

    return (
      <Form onSubmit={this.handleSubmit} noValidate className={this.state.status === 'was-validated' ? 'was-validated bg-white my-3 p-3': 'bg-white my-3 p-3'}>
        <FormGroup className="required">
          <Label for="language">Language</Label>
          <Select id="language" name="language" options={this.state.languages} value={this.state.doc.language} onChange={(s) => this.handleSelectChange('language', s)} className={this.isValid(this.state.doc.language) ? 'is-valid' : 'is-invalid'}/>
          <div className="invalid-feedback">
            Please select a language
          </div>
        </FormGroup>

        <FormGroup className="required">
          <Label for="spaces">Operation(s) / Webspace(s)</Label>
          <HRInfoSelect type="spaces" isMulti={true} onChange={(s) => this.handleSelectChange('spaces', s)} value={this.state.doc.spaces} className={this.isValid(this.state.doc.spaces) ? 'is-valid' : 'is-invalid'} />
          <FormText color="muted">
            Click on the field and select where to publish the event (operation, regional site or thematic site).
          </FormText>
          <div className="invalid-feedback">
            You must select an operation or a space
          </div>
        </FormGroup>

        <FormGroup className="required">
          <Label for="status">Status</Label>
          <Select id="status" name="status" options={this.state.assessment_statuses} value={this.state.doc.status} onChange={(s) => this.handleSelectChange('status', s)} className={this.isValid(this.state.doc.category) ? 'is-valid' : 'is-invalid'}/>
          <FormText color="muted">
            Indicate the phase of the assessment. Please remember to update this field as phases move on.
          </FormText>
          <div className="invalid-feedback">
            You must select an assessment status
          </div>
        </FormGroup>

        <FormGroup>
          <Label for="organizations">Leading/Coordinating Organization(s)</Label>
          <HRInfoAsyncSelect type="organizations" onChange={(s) => this.handleSelectChange('organizations', s)} value={this.state.doc.organizations} className={this.isValid(this.state.doc.organizations) ? 'is-valid' : 'is-invalid'} />
          <FormText color="muted">
            Type in and select from the list the organization(s) conducting the assessment. To indicate multiple organizations add a comma after each entry.
          </FormText>
        </FormGroup>

        <FormGroup>
          <Label for="participating_organizations">Participating Organization(s)</Label>
          <HRInfoAsyncSelect type="organizations" onChange={(s) => this.handleSelectChange('participating_organizations', s)} value={this.state.doc.participating_organizations} className={this.isValid(this.state.doc.participating_organizations) ? 'is-valid' : 'is-invalid'} />
          <FormText color="muted">
            Type in and select from the list the organization(s) taking part into (but not leading) the assessment. To indicate multiple organizations add a comma after each entry.
          </FormText>
        </FormGroup>

        <FormGroup>
          <Label for="locations">Location(s)</Label>
          <HRInfoLocations onChange={(s) => this.handleSelectChange('location', s)} value={this.state.doc.location} isMulti />
          <FormText color="muted">
            Select from the menu the country(ies) the assessment is about and indicate more specific locations by selecting multiple layers (region, province, town).
            You can indicate up to four locations right away. If you need to indicate more than four, save your assessment as draft then edit it to add more locations.
          </FormText>
        </FormGroup>

        <FormGroup>
          <Label for="other_location">Other location</Label>
          <Input type="text" name="other_location" id="other_location" value={this.state.doc.other_location} onChange={this.handleInputChange} />
          <FormText color="muted">
            You can specify here a location not available in the Location(s) field list.
          </FormText>
        </FormGroup>

        <FormGroup>
          <Label for="population_types">Population Type(s)</Label>
          <HRInfoSelect type="population_types" isMulti={true} onChange={(s) => this.handleSelectChange('population_types', s)} value={this.state.doc.population_types} />
          <FormText color="muted">
            Click on the field and select the segment(s) of the population targeted by the assessment. You can select multiple population types.
          </FormText>
        </FormGroup>

        <FormGroup className="required">
          <Label for="label">Title</Label>
          <Input type="text" name="label" id="label" placeholder="Enter the title of the assessment" required="required" value={this.state.doc.label} onChange={this.handleInputChange} />
          <FormText color="muted">
            Type the original title of the assessment. Try not to use abbreviations. To see Standards and Naming Conventions click <a href="https://drive.google.com/open?id=1TxOek13c4uoYAQWqsYBhjppeYUwHZK7nhx5qgm1FALA">here</a>.
          </FormText>
          <div className="invalid-feedback">
            Please enter the assessment title
          </div>
        </FormGroup>

        <FormGroup>
          <Label for="subject">Subject/Objective</Label>
          <Input type="textarea" name="subject" id="subject" value={this.state.doc.subject} onChange={this.handleInputChange} />
          <FormText color="muted">
            Insert a brief description of the topic of the assessment and what its goals are.
          </FormText>
        </FormGroup>

        <FormGroup>
          <Label for="methodology">Methodology</Label>
          <Input type="textarea" name="methodology" id="methodology" value={this.state.doc.methodology} onChange={this.handleInputChange} />
          <FormText color="muted">
            Insert a brief description of the procedures and the techniques used to collect, store and analyse the data.
          </FormText>
        </FormGroup>

        <FormGroup>
          <Label for="key_findings">Key findings</Label>
          <Input type="textarea" name="key_findings" id="key_findings" value={this.state.doc.key_findings} onChange={this.handleInputChange} />
          <FormText color="muted">
            Insert a brief summary of the assessment’s results.
          </FormText>
        </FormGroup>

        {bundles}

        <FormGroup>
          <Label for="themes">Themes</Label>
          <HRInfoSelect type="themes" isMulti={true} onChange={(s) => this.handleSelectChange('themes', s)} value={this.state.doc.themes} />
          <FormText color="muted">
            Click on the field and select all relevant themes. Choose only themes the event substantively refers to.
          </FormText>
        </FormGroup>

        {disasters}

        <FormGroup>
          <Label for="collection_method">Collection method(s)</Label>
          <Select id="collection_method" name="collection_method" options={this.state.collection_methods} value={this.state.doc.collection_method} onChange={(s) => this.handleSelectChange('collection_method', s)} />
          <FormText color="muted">
            Click on the field and select the collection method(s) used to gather information during the assessment.
          </FormText>
        </FormGroup>

        <FormGroup>
          <Label for="unit_measurement">Unit(s) of Measurement</Label>
          <Select id="unit_measurement" name="unit_measurement" options={this.state.measurement_units} value={this.state.doc.unit_measurement} onChange={(s) => this.handleSelectChange('unit_measurement', s)} />
          <FormText color="muted">
            Click on the field and select the unit(s) of measurement used for the assessment.
          </FormText>
        </FormGroup>

        <FormGroup>
          <Label for="sample_size">Sample size</Label>
          <Input type="text" name="sample_size" id="sample_size" value={this.state.doc.sample_size} onChange={this.handleInputChange} />
          <FormText color="muted">
            Indicate the number of communities/households/individuals surveyed during the assessment.
          </FormText>
        </FormGroup>

        <FormGroup>
          <Label for="geographic_level">Level of Representation</Label>
          <Select id="geographic_level" name="geographic_level" options={this.state.geographic_levels} value={this.state.doc.geographic_level} onChange={(s) => this.handleSelectChange('geographic_level', s)} />
          <FormText color="muted">
            Select at what geographical level the assessment is (has been) conducted.
          </FormText>
        </FormGroup>

        <FormGroup>
          <Label for="contacts">Contact(s)</Label>
          <HidContacts isMulti={true} token={this.props.token} onChange={(s) => this.handleSelectChange('contacts', s)} value={this.state.doc.contacts} />
          <FormText color="muted">
            Indicate the person(s) to contact for information regarding the event. To show up in the list, the person must have a HumanitarianID profile.
          </FormText>
        </FormGroup>

        <FormGroup>
          <Label for="agendas">Agenda(s)</Label>
          <HRInfoAsyncSelect type="documents" onChange={(s) => this.handleSelectChange('agendas', s)} value={this.state.doc.agendas} />
          <FormText color="muted">
            Add the agenda of the event as a document first, and then reference this document from here.
          </FormText>
        </FormGroup>

        <FormGroup>
          <Label for="meeting_minutes">Meeting minute(s)</Label>
          <HRInfoAsyncSelect type="documents" onChange={(s) => this.handleSelectChange('meeting_minutes', s)} value={this.state.doc.meeting_minutes} />
          <FormText color="muted">
            Add the meeting minutes of the event as a document first, and then reference this document from here.
          </FormText>
        </FormGroup>

        <FormGroup>
          <Label for="related_content">Related Content</Label>
          <RelatedContent onChange={(s) => this.handleSelectChange('related_content', s)} value={this.state.doc.related_content} />
          <FormText color="muted">
            Add links to content that is related to the event you are creating by indicating the title of the content and its url. When using the Search function make sure to search by content title.
          </FormText>
        </FormGroup>

        {this.state.status !== 'submitting' &&
          <span>
            <Button color="primary">Publish</Button> &nbsp;
            <Button color="secondary" onClick={(evt) => this.handleSubmit(evt, 1)}>Save as Draft</Button> &nbsp;
          </span>
        }
        {(this.state.status === 'submitting' || this.state.status === 'deleting') &&
          <FontAwesomeIcon icon={faSpinner} pulse fixedWidth />
        }
        {(this.props.match.params.id && this.state.status !== 'deleting') &&
          <Button color="danger" onClick={this.handleDelete}>Delete</Button>
        }
      </Form>
    );*/
  }
}

export default translate('forms')(AssessmentForm);
