import React from 'react';
import { Button, Form, FormGroup, Label, Input, FormText } from 'reactstrap';
import { EditorState, ContentState, convertFromHTML } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import {stateToHTML} from 'draft-js-export-html';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import Select from 'react-select';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import faSpinner from '@fortawesome/fontawesome-free-solid/faSpinner';
import HRInfoSelect from './HRInfoSelect';
import HRInfoLocations from './HRInfoLocations';
import HRInfoOrganizations from './HRInfoOrganizations';
import HRInfoFiles from './HRInfoFiles';
import RelatedContent from './RelatedContent';

class DocumentForm extends React.Component {
  constructor(props) {
    super(props);
    let type = 'documents';
    let typeLabel = 'document';
    if (props.match.url.indexOf('documents') === -1) {
      type = 'infographics';
      typeLabel = 'map/infographic';
    }
    this.state = {
      doc: {
        label: '',
        publication_date: ''
      },
      editorState: EditorState.createEmpty(),
      languages: [
        { value: 'en', label: 'English'},
        { value: 'fr', label: 'French' },
        { value: 'es', label: 'Spanish' },
        { value: 'ru', label: 'Russian' }
      ],
      status: '',
      type: type,
      typeLabel: typeLabel
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSelectChange = this.handleSelectChange.bind(this);
    this.onEditorStateChange = this.onEditorStateChange.bind(this);
    this.validateForm = this.validateForm.bind(this);
    this.isValid = this.isValid.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.postFieldCollections = this.postFieldCollections.bind(this);
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
    doc[name] = selected;
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

  async postFieldCollections (docid, field_collections) {
    const token = this.props.token;
    for (const fc of field_collections) {
      const body = {
        file: fc.file,
        language: fc.language,
        host_entity: docid
      };
      let url = 'https://www.humanitarianresponse.info/api/v1.0/files_collection';
      let httpMethod = 'POST';
      if (fc.item_id !== '') {
        url = 'https://www.humanitarianresponse.info/api/v1.0/files_collection/' + fc.item_id;
        httpMethod = 'PATCH';
      }
      await fetch(url, {
        method: httpMethod,
        body: JSON.stringify(body),
        headers: {
          'Authorization': 'Bearer ' + token,
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
    }
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
      ((this.state.type === 'documents' && this.isValid(doc.document_type)) || (this.state.type === 'infographics' && this.isValid(doc.infographic_type)))  &&
      this.isValid(doc.publication_date) &&
      this.isValid(doc.files) &&
      this.isValid(doc.organizations)) {
      return true;
    }
    else {
      return false;
    }
  }

  handleSubmit(event) {
    event.preventDefault();
    const isValid = this.validateForm();
    if (!isValid) {
      this.setState({
        status: 'was-validated'
      });
      return;
    }
    this.setState({
      status: 'submitting'
    });
    const token = this.props.token;
    let doc = {};
    let body = JSON.stringify(this.state.doc);
    body = JSON.parse(body);
    if (this.state.type === 'documents') {
      body.document_type = body.document_type.id;
    }
    else {
      body.infographic_type = body.infographic_type.id;
    }
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
    body.publication_date = Math.floor(new Date(this.state.doc.publication_date).getTime() / 1000);
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
    let field_collections = [];
    body.files.files.forEach(function (file, index) {
      let fc = {};
      if (body.files.languages[index]) {
        fc.language = body.files.languages[index].value;
      }
      fc.file = file.id ? file.id : file.fid;
      fc.file = parseInt(fc.file, 10);
      fc.item_id = '';
      if (body.files.collections[index]) {
        fc.item_id = parseInt(body.files.collections[index], 10);
      }
      field_collections.push(fc);
    });
    delete body.files;
    body.language = body.language.value;

    let httpMethod = 'POST';
    let url = 'https://www.humanitarianresponse.info/api/v1.0/' + this.state.type;
    if (body.id) {
      httpMethod = 'PATCH';
      url = 'https://www.humanitarianresponse.info/api/v1.0/' + this.state.type + '/' + body.id;
      delete body.created;
      delete body.changed;
      delete body.url;
    }

    fetch(url, {
        method: httpMethod,
        body: JSON.stringify(body),
        headers: {
          'Authorization': 'Bearer ' + token,
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      })
      .then(results => {
        return results.json();
      })
      .then(data => {
        doc = data.data[0];
        return this.postFieldCollections(doc.id, field_collections);
      })
      .then(res => {
        this.props.history.push('/' + this.state.type + '/' + doc.id);
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
      fetch('https://www.humanitarianresponse.info/api/v1.0/' + this.state.type + '/' + this.props.match.params.id, {
          method: 'DELETE',
          headers: {
            'Authorization': 'Bearer ' + this.props.token,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        })
        .then(results => {
          that.props.setAlert('success', that.state.typeLabel + ' deleted successfully');
          that.props.history.push('/home');
        }).catch(function(err) {
          that.props.setAlert('danger', 'There was an error deleting your ' + that.state.typeLabel);
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

  getDocument () {
    const that = this;
    return fetch("https://www.humanitarianresponse.info/api/v1.0/" + this.state.type + "/" + this.props.match.params.id)
        .then(results => {
            return results.json();
        }).then(data => {
          return data.data[0];
        }).catch(function(err) {
          that.props.setAlert('danger', 'Could not fetch ' + that.state.typeLabel);
        });
  }

  async componentDidMount() {
    if (this.props.match.params.id) {
      const doc = await this.getDocument();
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
    const offices = this.state.doc.hasOperation ? (
      <FormGroup>
        <Label for="offices">Coordination hub(s)</Label>
        <HRInfoSelect type="offices" spaces={this.state.doc.spaces} isMulti={true} onChange={(s) => this.handleSelectChange('offices', s)} value={this.state.doc.offices} />
        <FormText color="muted">
          Click on the field and select the coordination hub(s) the {this.state.typeLabel} refers to (if any).
        </FormText>
      </FormGroup>
    ) : '';

    const disasters = this.state.doc.hasOperation ? (
      <FormGroup>
        <Label for="disasters">Disaster(s)</Label>
        <HRInfoSelect type="disasters" spaces={this.state.doc.spaces} isMulti={true} onChange={(s) => this.handleSelectChange('disasters', s)} value={this.state.doc.disasters} />
        <FormText color="muted">
          Click on the field and select the disaster(s) or emergency the {this.state.typeLabel} refers to. Each disaster/emergency is associated with a number, called GLIDE, which is a common standard used by a wide network of organizations See <a href="http://glidenumer.net/?ref=hrinfo">glidenumber.net</a>.
        </FormText>
      </FormGroup>
    ) : '';

    const bundles = this.state.doc.hasOperation ? (
      <FormGroup>
        <Label for="bundles">Cluster(s)/Sector(s)</Label>
        <HRInfoSelect type="bundles" spaces={this.state.doc.spaces} isMulti={true} onChange={(s) => this.handleSelectChange('bundles', s)} value={this.state.doc.bundles} />
        <FormText color="muted">
          Indicate the cluster(s)/sector(s) the {this.state.typeLabel} refers to.
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
          <Label for="spaces">Spaces</Label>
          <HRInfoSelect type="spaces" isMulti={true} onChange={(s) => this.handleSelectChange('spaces', s)} value={this.state.doc.spaces} className={this.isValid(this.state.doc.spaces) ? 'is-valid' : 'is-invalid'} />
          <FormText color="muted">
            Click on the field and select where to publish the {this.state.typeLabel} (operation, regional site or thematic site).
          </FormText>
          <div className="invalid-feedback">
            You must select an operation or a space
          </div>
        </FormGroup>

        <FormGroup className="required">
          <Label for="label">Label</Label>
          <Input type="text" name="label" id="label" placeholder="Enter the title of the document" required="required" value={this.state.doc.label} onChange={this.handleInputChange} />
          <FormText color="muted">
            Type the original title of the {this.state.typeLabel}. Try not to use abbreviations. To see Standards and Naming Conventions click <a href="https://drive.google.com/open?id=1TxOek13c4uoYAQWqsYBhjppeYUwHZK7nhx5qgm1FALA">here</a>.
          </FormText>
          <div className="invalid-feedback">
            Please enter a document title
          </div>
        </FormGroup>

        <FormGroup className="required">
          <Label for={this.state.type === 'documents' ? 'document_type' : 'infographic_type'}>{this.state.type === 'documents' ? 'Document type' : 'Infographic type'}</Label>
          {this.state.type === 'documents' ?
            <HRInfoSelect type='document_types' onChange={(s) => this.handleSelectChange('document_type', s)} value={this.state.doc.document_type} className={this.isValid(this.state.doc.document_type) ? 'is-valid' : 'is-invalid'} />
             : <HRInfoSelect type='infographic_types' onChange={(s) => this.handleSelectChange('infographic_type', s)} value={this.state.doc.infographic_type} className={this.isValid(this.state.doc.infographic_type) ? 'is-valid' : 'is-invalid'} />
          }
          <FormText color="muted">
            Select the {this.state.typeLabel} type and sub-type that best describe the {this.state.typeLabel}.
          </FormText>
          <div className="invalid-feedback">
            You must select a {this.state.typeLabel} type
          </div>
        </FormGroup>

        <FormGroup className="required">
          <Label for="publication_date">Original Publication Date</Label>
          <Input type="date" id="publication_date" name="publication_date" value={this.state.doc.publication_date} onChange={this.handleInputChange} required />
          <FormText color="muted">
            Indicate when the {this.state.typeLabel} has originally been published.
          </FormText>
          <div className="invalid-feedback">
            You must enter a publication date
          </div>
        </FormGroup>

        <FormGroup className="required">
          <Label for="organizations">Organizations</Label>
          <HRInfoOrganizations onChange={(s) => this.handleSelectChange('organizations', s)} value={this.state.doc.organizations} className={this.isValid(this.state.doc.organizations) ? 'is-valid' : 'is-invalid'} />
          <FormText color="muted">
            Type in and select the source(s) of the {this.state.typeLabel}.
          </FormText>
          <div className="invalid-feedback">
            You must select at least one organization
          </div>
        </FormGroup>

        <FormGroup className="required">
          <Label for="files">Files</Label>
          <HRInfoFiles onChange={(s) => this.handleSelectChange('files', s)} value={this.state.doc.files} token={this.props.token} className={this.isValid(this.state.doc.files) ? 'is-valid' : 'is-invalid'} />
          <FormText color="muted">
            Upload the file to publish from your computer, and specify its language. It is best to publish one file per record, however you can add
            more if needed. To see Standards and Naming Conventions click <a href="https://drive.google.com/open?id=1TxOek13c4uoYAQWqsYBhjppeYUwHZK7nhx5qgm1FALA">here</a>.
          </FormText>
          <div className="invalid-feedback">
            You must add at least one file
          </div>
        </FormGroup>

        <FormGroup>
          <Label for="body">Description or Summary of Content</Label>
          <Editor
            editorState={editorState}
            wrapperClassName="demo-wrapper"
            editorClassName="demo-editor"
            onEditorStateChange={this.onEditorStateChange}
          />
          <FormText color="muted">
            Try to always include here the text (in full or part of it) of the {this.state.typeLabel} (example: use the introduction or the executive summary). If no text is available add a description of the file(s) you are publishing.
          </FormText>
        </FormGroup>

        <FormGroup>
          <Label for="related_content">Related Content</Label>
          <RelatedContent onChange={(s) => this.handleSelectChange('related_content', s)} value={this.state.doc.related_content} />
          <FormText color="muted">
            Add links to content that is related to the {this.state.typeLabel} you are publishing (example: language versions of the same {this.state.typeLabel}, or the link of the event the meeting minutes refer to) by indicating the title of the content and its url.
          </FormText>
        </FormGroup>

        <FormGroup>
          <Label for="locations">Locations</Label>
          <HRInfoLocations onChange={(s) => this.handleSelectChange('locations', s)} value={this.state.doc.locations} />
          <FormText color="muted">
            Select from the menu the country(ies) the {this.state.typeLabel} is about and indicate more specific locations by selecting multiple layers (region, province, town).
          </FormText>
        </FormGroup>
        {bundles}
        {offices}
        {disasters}
        <FormGroup>
          <Label for="themes">Themes</Label>
          <HRInfoSelect type="themes" isMulti={true} onChange={(s) => this.handleSelectChange('themes', s)} value={this.state.doc.themes} />
          <FormText color="muted">
            Click on the field and select all relevant themes. Choose only themes the {this.state.typeLabel} substantively refers to.
          </FormText>
        </FormGroup>
        {this.state.status !== 'submitting' &&
          <Button color="primary">Submit</Button>
        }
        {(this.state.status === 'submitting' || this.state.status === 'deleting') &&
          <FontAwesomeIcon icon={faSpinner} pulse fixedWidth />
        }
        {(this.props.match.params.id && this.state.status !== 'deleting') &&
          <Button color="danger" onClick={this.handleDelete}>Delete</Button>
        }
      </Form>
    );
  }
}

export default DocumentForm;
