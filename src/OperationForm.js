import React from 'react';
import { Button, Form, FormGroup, Label, Input, FormText } from 'reactstrap';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import Select from 'react-select';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import faSpinner from '@fortawesome/fontawesome-free-solid/faSpinner';
import HRInfoAPI from './HRInfoAPI';
import HRInfoSelect from './HRInfoSelect';
import HRInfoLocation from './HRInfoLocation';
import HRInfoAsyncSelect from './HRInfoAsyncSelect';
import HidContacts from './HidContacts';
import StringSelect from './StringSelect';
import LanguageSelect from './LanguageSelect';

class OperationForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      doc: {
        label: '',
        date: [{}],
        address: {}
      },
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
      status: ''
    };

    this.hrinfoAPI = new HRInfoAPI();

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSelectChange = this.handleSelectChange.bind(this);
    this.validateForm = this.validateForm.bind(this);
    this.isValid = this.isValid.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.getSelectValue = this.getSelectValue.bind(this);
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
    body.language = body.language.value;

    this.hrinfoAPI
      .save('operations', body)
      .then(doc => {
        this.props.history.push('/operations/' + doc.id);
      })
      .catch(err => {
        this.props.setAlert('danger', 'There was an error uploading your operation');
      });
  }

  handleDelete () {
    if (this.props.match.params.id) {
      const that = this;
      this.setState({
        status: 'deleting'
      });
      this.hrinfoAPI
        .remove('operations', this.props.match.params.id)
        .then(results => {
          that.props.setAlert('success', 'Operation deleted successfully');
          that.props.history.push('/home');
        }).catch(function(err) {
          that.props.setAlert('danger', 'There was an error deleting the operation');
          that.props.history.push('/home');
        });
    }
  }

  async componentDidMount() {
    if (this.props.match.params.id) {
      const doc = await this.hrinfoAPI.getItem('operations', this.props.match.params.id);
      if (doc.launch_date) {
        const launchDate = new Date(parseInt(doc.launch_date, 10) * 1000);
        const day = ("0" + launchDate.getDate()).slice(-2);
        const month = ("0" + (launchDate.getMonth() + 1)).slice(-2);
        doc.launch_date = launchDate.getFullYear() + '-' + month + '-' + day;
      }
      let state = {
        doc: doc
      };
      this.setState(state);
    }
  }

  getSelectValue(v) {
    return [{label: v, value: v}];
  }

  render() {

    return (
      <Form onSubmit={this.handleSubmit} noValidate className={this.state.status === 'was-validated' ? 'was-validated bg-white my-3 p-3': 'bg-white my-3 p-3'}>
        <FormGroup className="required">
          <Label for="language">Language</Label>
          <LanguageSelect value={this.state.doc.language} onChange={(s) => this.handleSelectChange('language', s)} className={this.isValid(this.state.doc.language) ? 'is-valid' : 'is-invalid'}/>
          <div className="invalid-feedback">
            Please select a language
          </div>
        </FormGroup>

        <FormGroup className="required">
          <Label for="label">Title</Label>
          <Input type="text" name="label" id="label" placeholder="Enter the title of the operation" required="required" value={this.state.doc.label} onChange={this.handleInputChange} />
          <div className="invalid-feedback">
            Please enter the operation title
          </div>
        </FormGroup>

        <FormGroup className="required">
          <Label for="type">Type</Label>
          <StringSelect id="type" name="type" options={this.state.operationTypes} value={this.state.doc.type} onChange={(s) => this.handleSelectChange('type', s)} className={this.isValid(this.state.doc.type) ? 'is-valid' : 'is-invalid'}/>
          <div className="invalid-feedback">
            You must select an operation type
          </div>
        </FormGroup>

        <FormGroup>
          <Label for="region">Region</Label>
          <HRInfoSelect type="operations" onChange={(s) => this.handleSelectChange('region', s)} value={this.state.doc.region} />
        </FormGroup>

        <FormGroup>
          <Label for="country">Country</Label>
          <HRInfoLocation onChange={(s) => this.handleSelectChange('country', s)} value={this.state.doc.country} level={0} />
        </FormGroup>

        <FormGroup>
          <Label for="status">Status</Label>
          <StringSelect id="status" name="status" options={this.state.statuses} value={this.state.doc.status} onChange={(s) => this.handleSelectChange('status', s)} />
        </FormGroup>

        <FormGroup>
          <Label for="launch_date">Launch date</Label>
          <Input type="date" id="launch_date" name="launch_date" value={this.state.doc.launch_date} onChange={this.handleInputChange} />
        </FormGroup>

        <FormGroup>
          <Label for="cluster_configuration">Cluster Configuration</Label>
          <HRInfoAsyncSelect type="documents" onChange={(s) => this.handleSelectChange('cluster_configuration', s)} value={this.state.doc.cluster_configuration} />
        </FormGroup>

        <FormGroup>
          <Label for="website">Website</Label>
          <Input type="url" id="website" name="website" value={this.state.doc.website} onChange={this.handleInputChange} />
        </FormGroup>

        <FormGroup>
          <Label for="email">Email</Label>
          <Input type="email" id="email" name="email" value={this.state.doc.email} onChange={this.handleInputChange} />
        </FormGroup>

        <FormGroup>
          <Label for="managed_by">Managed by</Label>
          <HRInfoAsyncSelect type="organizations" onChange={(s) => this.handleSelectChange('managed_by', s)} value={this.state.doc.managed_by} />
        </FormGroup>

        <FormGroup>
          <Label for="focal_points">Focal points</Label>
          <HidContacts token={this.props.token} onChange={(s) => this.handleSelectChange('focal_points', s)} value={this.state.doc.focal_points} />
        </FormGroup>

        <FormGroup>
          <Label for="social_media">Social media</Label>
          <p>Todo</p>
        </FormGroup>

        <FormGroup>
          <Label for="hid_access">Secure Humanitarian ID contact list ?</Label>
          <StringSelect id="hid_access" name="hid_access" options={this.state.hidAccesses} value={this.state.doc.hid_access} onChange={(s) => this.handleSelectChange('hid_access', s)} />
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

export default OperationForm;
