import React from 'react';
import { Button, Form, FormGroup, Label, Input } from 'reactstrap';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import faSpinner from '@fortawesome/fontawesome-free-solid/faSpinner';
import HRInfoSelect from '../components/HRInfoSelect';
import HRInfoLocation from '../components/HRInfoLocation';
import HRInfoAsyncSelect from '../components/HRInfoAsyncSelect';
import HidContacts from '../components/HidContacts';
import StringSelect from '../components/StringSelect';
import LanguageSelect from '../components/LanguageSelect';

class OperationForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      operationTypes: [
        { value: 'country', label: 'Country'},
        { value: 'region', label: 'Region'}
      ],
      statuses: [
        { value: 'active', label: 'Active'},
        { value: 'archived', label: 'Archived' },
        { value: 'inactive', label: 'Inactive' }
      ],
      hidAccesses: [
        { value: 'open', label: 'Open' },
        { value: 'closed', label: 'Closed' },
        { value: 'inactive', label: 'Inactive'}
      ],
    };
  }

  render() {

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
          <Label for="label">Title</Label>
          <Input type="text" name="label" id="label" placeholder="Enter the title of the operation" required="required" value={this.props.doc.label} onChange={this.props.handleInputChange} />
          <div className="invalid-feedback">
            Please enter the operation title
          </div>
        </FormGroup>

        <FormGroup className="required">
          <Label for="type">Type</Label>
          <StringSelect id="type" name="type" options={this.state.operationTypes} value={this.props.doc.type} onChange={(s) => this.props.handleSelectChange('type', s)} className={this.props.isValid(this.props.doc.type) ? 'is-valid' : 'is-invalid'}/>
          <div className="invalid-feedback">
            You must select an operation type
          </div>
        </FormGroup>

        <FormGroup>
          <Label for="region">Region</Label>
          <HRInfoSelect type="operations" onChange={(s) => this.props.handleSelectChange('region', s)} value={this.props.doc.region} />
        </FormGroup>

        <FormGroup>
          <Label for="country">Country</Label>
          <HRInfoLocation onChange={(s) => this.props.handleSelectChange('country', s)} value={this.props.doc.country} level={0} />
        </FormGroup>

        <FormGroup>
          <Label for="status">Status</Label>
          <StringSelect id="status" name="status" options={this.state.statuses} value={this.props.doc.status} onChange={(s) => this.props.handleSelectChange('status', s)} />
        </FormGroup>

        <FormGroup>
          <Label for="launch_date">Launch date</Label>
          <Input type="date" id="launch_date" name="launch_date" value={this.props.doc.launch_date} onChange={this.props.handleInputChange} />
        </FormGroup>

        <FormGroup>
          <Label for="cluster_configuration">Cluster Configuration</Label>
          <HRInfoAsyncSelect type="documents" onChange={(s) => this.props.handleSelectChange('cluster_configuration', s)} value={this.props.doc.cluster_configuration} />
        </FormGroup>

        <FormGroup>
          <Label for="website">Website</Label>
          <Input type="url" id="website" name="website" value={this.props.doc.website} onChange={this.props.handleInputChange} />
        </FormGroup>

        <FormGroup>
          <Label for="email">Email</Label>
          <Input type="email" id="email" name="email" value={this.props.doc.email} onChange={this.props.handleInputChange} />
        </FormGroup>

        <FormGroup>
          <Label for="managed_by">Managed by</Label>
          <HRInfoAsyncSelect type="organizations" onChange={(s) => this.props.handleSelectChange('managed_by', s)} value={this.props.doc.managed_by} />
        </FormGroup>

        <FormGroup>
          <Label for="focal_points">Focal points</Label>
          <HidContacts isMulti={true} onChange={(s) => this.props.handleSelectChange('focal_points', s)} value={this.props.doc.focal_points} />
        </FormGroup>

        <FormGroup>
          <Label for="social_media">Social media</Label>
          <p>Todo</p>
        </FormGroup>

        <FormGroup>
          <Label for="hid_access">Secure Humanitarian ID contact list ?</Label>
          <StringSelect id="hid_access" name="hid_access" options={this.state.hidAccesses} value={this.props.doc.hid_access} onChange={(s) => this.props.handleSelectChange('hid_access', s)} />
        </FormGroup>

        {this.props.status !== 'submitting' &&
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

export default OperationForm;
