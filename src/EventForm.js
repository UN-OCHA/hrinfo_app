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
import HRInfoAsyncSelect from './HRInfoAsyncSelect';
import RelatedContent from './RelatedContent';
import HidContacts from './HidContacts';
import Address from './Address';
import EventDate from './EventDate';

class EventForm extends React.Component {
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
      event_categories: [
        { value: 82, label: 'Meetings'},
        { value: 83, label: 'Trainings'},
        { value: 84, label: 'Workshops'},
        { value: 85, label: 'Conferences'}
      ],
      status: ''
    };

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
    delete body.language;
    //body.language = body.language.value;
    if (body.address && body.address.country) {
      body.address.country = body.address.country.pcode;
    }
    if (body.date[0] && body.date[0].timezone_db) {
      body.date[0].timezone_db = body.date[0].timezone_db.value;
    }

    let httpMethod = 'POST';
    let url = 'https://www.humanitarianresponse.info/api/v1.0/events';
    if (body.id) {
      httpMethod = 'PATCH';
      url = 'https://www.humanitarianresponse.info/api/v1.0/events/' + body.id;
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
        doc =  data.data[0];
      })
      .then(res => {
        this.props.history.push('/events/' + doc.id);
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
      fetch('https://www.humanitarianresponse.info/api/v1.0/events/' + this.props.match.params.id, {
          method: 'DELETE',
          headers: {
            'Authorization': 'Bearer ' + this.props.token,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        })
        .then(results => {
          that.props.setAlert('success', 'Event deleted successfully');
          that.props.history.push('/home');
        }).catch(function(err) {
          that.props.setAlert('danger', 'There was an error deleting your event');
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
    return fetch("https://www.humanitarianresponse.info/api/v1.0/events/" + this.props.match.params.id)
        .then(results => {
            return results.json();
        }).then(data => {
          return data.data[0];
        }).catch(function(err) {
          that.props.setAlert('danger', 'Could not fetch event');
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
    const offices = this.state.doc.hasOperation ? (
      <FormGroup>
        <Label for="offices">Coordination hub(s)</Label>
        <HRInfoSelect type="offices" spaces={this.state.doc.spaces} isMulti={true} onChange={(s) => this.handleSelectChange('offices', s)} value={this.state.doc.offices} />
        <FormText color="muted">
          Click on the field and select the coordination hub(s) the event refers to (if any).
        </FormText>
      </FormGroup>
    ) : '';

    const disasters = this.state.doc.hasOperation ? (
      <FormGroup>
        <Label for="disasters">Disaster(s) / Emergency</Label>
        <HRInfoSelect type="disasters" spaces={this.state.doc.spaces} isMulti={true} onChange={(s) => this.handleSelectChange('disasters', s)} value={this.state.doc.disasters} />
        <FormText color="muted">
          Click on the field and select the disaster(s) or emergency the event refers to. Each disaster/emergency is associated with a number, called GLIDE, which is a common standard used by a wide network of organizations See <a href="http://glidenumer.net/?ref=hrinfo">glidenumber.net</a>.
        </FormText>
      </FormGroup>
    ) : '';

    const bundles = this.state.doc.hasOperation ? (
      <FormGroup>
        <Label for="bundles">Cluster(s)/Sector(s)</Label>
        <HRInfoSelect type="bundles" spaces={this.state.doc.spaces} isMulti={true} onChange={(s) => this.handleSelectChange('bundles', s)} value={this.state.doc.bundles} />
        <FormText color="muted">
          Indicate the cluster(s)/sector(s) the event refers to.
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
          <Label for="label">Title</Label>
          <Input type="text" name="label" id="label" placeholder="Enter the title of the event" required="required" value={this.state.doc.label} onChange={this.handleInputChange} />
          <FormText color="muted">
            Type the original title of the event. Try not to use abbreviations. To see Standards and Naming Conventions click <a href="https://drive.google.com/open?id=1TxOek13c4uoYAQWqsYBhjppeYUwHZK7nhx5qgm1FALA">here</a>.
          </FormText>
          <div className="invalid-feedback">
            Please enter the event title
          </div>
        </FormGroup>

        <FormGroup className="required">
          <Label for="category">Event Category</Label>
          <Select id="category" name="category" options={this.state.event_categories} value={this.state.doc.category} onChange={(s) => this.handleSelectChange('category', s)} className={this.isValid(this.state.doc.category) ? 'is-valid' : 'is-invalid'}/>
          <FormText color="muted">
            From the list, select the kind of event you are creating.
          </FormText>
          <div className="invalid-feedback">
            You must select an event category
          </div>
        </FormGroup>

        <FormGroup className="required">
          <Label for="date">Date(s)</Label>
          <EventDate value={this.state.doc.date[0]} required onChange={(val) => {console.log(val); this.handleSelectChange('date', val);}} />
          <FormText color="muted">
            Indicate the date(s) of the event.
          </FormText>
          <div className="invalid-feedback">
            You must enter a date
          </div>
        </FormGroup>

        <FormGroup>
          <Label for="locations">Location</Label>
          <HRInfoLocations onChange={(s) => this.handleSelectChange('location', s)} value={this.state.doc.location} />
          <FormText color="muted">
            Select from the menu the country(ies) the {this.state.typeLabel} is about and indicate more specific locations by selecting multiple layers (region, province, town).
          </FormText>
        </FormGroup>

        <FormGroup>
          <Label for="venue">Venue</Label>
          <Address value={this.state.doc.address} onChange={(val) => this.handleSelectChange('address', val)} />
          <FormText color="muted">
            Indicate here where the event takes place.
          </FormText>
        </FormGroup>

        <FormGroup>
          <Label for="organizations">Organization(s)</Label>
          <HRInfoAsyncSelect type="organizations" onChange={(s) => this.handleSelectChange('organizations', s)} value={this.state.doc.organizations} className={this.isValid(this.state.doc.organizations) ? 'is-valid' : 'is-invalid'} />
          <FormText color="muted">
            Type in and select the the event organizer(s).
          </FormText>
        </FormGroup>

        {bundles}

        <FormGroup>
          <Label for="body">Event description</Label>
          <Editor
            editorState={editorState}
            wrapperClassName="demo-wrapper"
            editorClassName="demo-editor"
            onEditorStateChange={this.onEditorStateChange}
          />
          <FormText color="muted">
            Provide here additional information regarding the event.
          </FormText>
        </FormGroup>

        {offices}
        {disasters}
        <FormGroup>
          <Label for="themes">Themes</Label>
          <HRInfoSelect type="themes" isMulti={true} onChange={(s) => this.handleSelectChange('themes', s)} value={this.state.doc.themes} />
          <FormText color="muted">
            Click on the field and select all relevant themes. Choose only themes the event substantively refers to.
          </FormText>
        </FormGroup>

        <FormGroup>
          <Label for="contacts">Contact(s)</Label>
          <HidContacts token={this.props.token} onChange={(s) => this.handleSelectChange('contacts', s)} value={this.state.doc.contacts} />
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
    );
  }
}

export default EventForm;
