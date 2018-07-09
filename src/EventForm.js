import React from 'react';
import { Button, Form, FormGroup, Label, Input, FormText } from 'reactstrap';
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import faSpinner from '@fortawesome/fontawesome-free-solid/faSpinner';
import HRInfoSelect from './HRInfoSelect';
import HRInfoLocations from './HRInfoLocations';
import HRInfoAsyncSelect from './HRInfoAsyncSelect';
import RelatedContent from './RelatedContent';
import HidContacts from './HidContacts';
import Address from './Address';
import EventDate from './EventDate';
import LanguageSelect from './LanguageSelect';
import StringSelect from './StringSelect';

class EventForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      event_categories: [
        { value: '82', label: 'Meetings'},
        { value: '83', label: 'Trainings'},
        { value: '84', label: 'Workshops'},
        { value: '85', label: 'Conferences'}
      ]
    };
  }

  render() {
    const offices = this.props.doc.hasOperation ? (
      <FormGroup>
        <Label for="offices">Coordination hub(s)</Label>
        <HRInfoSelect type="offices" spaces={this.props.doc.spaces} isMulti={true} onChange={(s) => this.props.handleSelectChange('offices', s)} value={this.props.doc.offices} />
        <FormText color="muted">
          Click on the field and select the coordination hub(s) the event refers to (if any).
        </FormText>
      </FormGroup>
    ) : '';

    const disasters = this.props.doc.hasOperation ? (
      <FormGroup>
        <Label for="disasters">Disaster(s) / Emergency</Label>
        <HRInfoSelect type="disasters" spaces={this.props.doc.spaces} isMulti={true} onChange={(s) => this.props.handleSelectChange('disasters', s)} value={this.props.doc.disasters} />
        <FormText color="muted">
          Click on the field and select the disaster(s) or emergency the event refers to. Each disaster/emergency is associated with a number, called GLIDE, which is a common standard used by a wide network of organizations See <a href="http://glidenumer.net/?ref=hrinfo">glidenumber.net</a>.
        </FormText>
      </FormGroup>
    ) : '';

    const bundles = this.props.doc.hasOperation ? (
      <FormGroup>
        <Label for="bundles">Cluster(s)/Sector(s)</Label>
        <HRInfoSelect type="bundles" spaces={this.props.doc.spaces} isMulti={true} onChange={(s) => this.props.handleSelectChange('bundles', s)} value={this.props.doc.bundles} />
        <FormText color="muted">
          Indicate the cluster(s)/sector(s) the event refers to.
        </FormText>
      </FormGroup>
    ) : '';

    return (
      <Form onSubmit={this.props.handleSubmit} noValidate className={this.state.status === 'was-validated' ? 'was-validated bg-white my-3 p-3': 'bg-white my-3 p-3'}>
        <FormGroup className="required">
          <Label for="language">Language</Label>
          <LanguageSelect value={this.props.doc.language} onChange={(s) => this.props.handleSelectChange('language', s)} className={this.props.isValid(this.props.doc.language) ? 'is-valid' : 'is-invalid'}/>
          <div className="invalid-feedback">
            Please select a language
          </div>
        </FormGroup>

        <FormGroup className="required">
          <Label for="spaces">Operation(s) / Webspace(s)</Label>
          <HRInfoSelect type="spaces" isMulti={true} onChange={(s) => this.props.handleSelectChange('spaces', s)} value={this.props.doc.spaces} className={this.props.isValid(this.props.doc.spaces) ? 'is-valid' : 'is-invalid'} />
          <FormText color="muted">
            Click on the field and select where to publish the event (operation, regional site or thematic site).
          </FormText>
          <div className="invalid-feedback">
            You must select an operation or a space
          </div>
        </FormGroup>

        <FormGroup className="required">
          <Label for="label">Title</Label>
          <Input type="text" name="label" id="label" placeholder="Enter the title of the event" required="required" value={this.props.doc.label} onChange={this.props.handleInputChange} />
          <FormText color="muted">
            Type the original title of the event. Try not to use abbreviations. To see Standards and Naming Conventions click <a href="https://drive.google.com/open?id=1TxOek13c4uoYAQWqsYBhjppeYUwHZK7nhx5qgm1FALA">here</a>.
          </FormText>
          <div className="invalid-feedback">
            Please enter the event title
          </div>
        </FormGroup>

        <FormGroup className="required">
          <Label for="category">Event Category</Label>
          <StringSelect id="category" name="category" options={this.state.event_categories} value={this.props.doc.category} onChange={(s) => this.props.handleSelectChange('category', s)} className={this.props.isValid(this.props.doc.category) ? 'is-valid' : 'is-invalid'}/>
          <FormText color="muted">
            From the list, select the kind of event you are creating.
          </FormText>
          <div className="invalid-feedback">
            You must select an event category
          </div>
        </FormGroup>

        <FormGroup className="required">
          <Label for="date">Date(s)</Label>
          <EventDate value={this.props.doc.date[0]} required onChange={(val) => {console.log(val); this.props.handleSelectChange('date', val);}} />
          <FormText color="muted">
            Indicate the date(s) of the event.
          </FormText>
          <div className="invalid-feedback">
            You must enter a date
          </div>
        </FormGroup>

        <FormGroup>
          <Label for="locations">Location</Label>
          <HRInfoLocations onChange={(s) => this.props.handleSelectChange('location', s)} value={this.props.doc.location} />
          <FormText color="muted">
            Select from the menu the country(ies) the {this.state.typeLabel} is about and indicate more specific locations by selecting multiple layers (region, province, town).
          </FormText>
        </FormGroup>

        <FormGroup>
          <Label for="venue">Venue</Label>
          <Address value={this.props.doc.address} onChange={(val) => this.props.handleSelectChange('address', val)} />
          <FormText color="muted">
            Indicate here where the event takes place.
          </FormText>
        </FormGroup>

        <FormGroup>
          <Label for="organizations">Organization(s)</Label>
          <HRInfoAsyncSelect type="organizations" onChange={(s) => this.props.handleSelectChange('organizations', s)} value={this.props.doc.organizations} className={this.props.isValid(this.props.doc.organizations) ? 'is-valid' : 'is-invalid'} />
          <FormText color="muted">
            Type in and select the the event organizer(s).
          </FormText>
        </FormGroup>

        {bundles}

        <FormGroup>
          <Label for="body">Event description</Label>
          <Editor
            editorState={this.props.editorState}
            wrapperClassName="demo-wrapper"
            editorClassName="demo-editor"
            onEditorStateChange={this.props.onEditorStateChange}
          />
          <FormText color="muted">
            Provide here additional information regarding the event.
          </FormText>
        </FormGroup>

        {offices}
        {disasters}
        <FormGroup>
          <Label for="themes">Themes</Label>
          <HRInfoSelect type="themes" isMulti={true} onChange={(s) => this.props.handleSelectChange('themes', s)} value={this.props.doc.themes} />
          <FormText color="muted">
            Click on the field and select all relevant themes. Choose only themes the event substantively refers to.
          </FormText>
        </FormGroup>

        <FormGroup>
          <Label for="contacts">Contact(s)</Label>
          <HidContacts onChange={(s) => this.props.handleSelectChange('contacts', s)} value={this.props.doc.contacts} />
          <FormText color="muted">
            Indicate the person(s) to contact for information regarding the event. To show up in the list, the person must have a HumanitarianID profile.
          </FormText>
        </FormGroup>

        <FormGroup>
          <Label for="agendas">Agenda(s)</Label>
          <HRInfoAsyncSelect type="documents" onChange={(s) => this.props.handleSelectChange('agendas', s)} value={this.props.doc.agendas} />
          <FormText color="muted">
            Add the agenda of the event as a document first, and then reference this document from here.
          </FormText>
        </FormGroup>

        <FormGroup>
          <Label for="meeting_minutes">Meeting minute(s)</Label>
          <HRInfoAsyncSelect type="documents" onChange={(s) => this.props.handleSelectChange('meeting_minutes', s)} value={this.props.doc.meeting_minutes} />
          <FormText color="muted">
            Add the meeting minutes of the event as a document first, and then reference this document from here.
          </FormText>
        </FormGroup>

        <FormGroup>
          <Label for="related_content">Related Content</Label>
          <RelatedContent onChange={(s) => this.props.handleSelectChange('related_content', s)} value={this.props.doc.related_content} />
          <FormText color="muted">
            Add links to content that is related to the event you are creating by indicating the title of the content and its url. When using the Search function make sure to search by content title.
          </FormText>
        </FormGroup>

        {this.state.status !== 'submitting' &&
          <span>
            <Button color="primary">Publish</Button> &nbsp;
            <Button color="secondary" onClick={(evt) => this.props.handleSubmit(evt, 1)}>Save as Draft</Button> &nbsp;
          </span>
        }
        {(this.props.status === 'submitting' || this.props.status === 'deleting') &&
          <FontAwesomeIcon icon={faSpinner} pulse fixedWidth />
        }
        {(this.props.match.params.id && this.props.status !== 'deleting') &&
          <Button color="danger" onClick={this.props.handleDelete}>Delete</Button>
        }
      </Form>
    );
  }
}

export default EventForm;
