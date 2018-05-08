import React from 'react';
import { EditorState } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import {stateToHTML} from 'draft-js-export-html';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import HRInfoSelect from './HRInfoSelect';
import HRInfoLocations from './HRInfoLocations';
import HRInfoOrganizations from './HRInfoOrganizations';
import HRInfoFiles from './HRInfoFiles';
import RelatedContent from './RelatedContent';

class DocumentForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      label: '',
      type: '',
      publication_date: '',
      body: '',
      operations: '',
      editorState: EditorState.createEmpty(),
      offices: [],
      disasters: [],
      bundles: [],
      locations: [],
      related_content: [],
      files: []
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSelectChange = this.handleSelectChange.bind(this);
    this.onEditorStateChange = this.onEditorStateChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleInputChange(event) {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
  }

  handleSelectChange (name, selected) {
    this.setState({
      [name]: selected.id ? selected.id : selected
    });
  }

  handleSubmit(event) {
    let html = stateToHTML(this.state.editorState.getCurrentContent());
    event.preventDefault();
    console.log(this.state);
    console.log(html);
  }

  onEditorStateChange (editorState) {
    this.setState({
      editorState,
    });
  }

  render() {
    const offices = this.state.operations ? (
      <div className="form-group">
        <label htmlFor="offices">Coordination hub(s)</label>
        <HRInfoSelect type="offices" operation={this.state.operations} multi={true} onChange={(s) => this.handleSelectChange('offices', s)} />
      </div>
    ) : '';

    const disasters = this.state.operations ? (
      <div className="form-group">
        <label htmlFor="disasters">Disaster(s)</label>
        <HRInfoSelect type="disasters" operation={this.state.operations} multi={true} onChange={(s) => this.handleSelectChange('disasters', s)} />
      </div>
    ) : '';

    const bundles = this.state.operations ? (
      <div className="form-group">
        <label htmlFor="bundles">Cluster(s)/Sector(s)</label>
        <HRInfoSelect type="bundles" operation={this.state.operations} multi={true} onChange={(s) => this.handleSelectChange('bundles', s)} />
      </div>
    ) : '';

    const { editorState } = this.state;

    return (
      <form onSubmit={this.handleSubmit}>
        <div className="form-group">
          <label htmlFor="operations">Operation</label>
          <HRInfoSelect type="operations" onChange={(s) => this.handleSelectChange('operations', s)} />
        </div>
        <div className="form-group">
          <label htmlFor="label">Label</label>
          <input type="text" className="form-control" name="label" id="label" aria-describedby="labelHelp" placeholder="Document title" value={this.state.label} onChange={this.handleInputChange} />
          <small id="labelHelp" className="form-text text-muted">Enter the title of the document.</small>
        </div>
        <div className="form-group">
          <label htmlFor="document_type">Document type</label>
          <HRInfoSelect type="document_types" onChange={(s) => this.handleSelectChange('document_types', s)} />
        </div>
        <div className="form-group">
          <label htmlFor="publication_date">Original Publication Date</label>
          <input type="date" className="form-control" id="publication_date" name="publication_date" value={this.state.publication_date} onChange={this.handleInputChange} />
        </div>
        <div className="form-group">
          <label htmlFor="files">Files</label>
          <HRInfoFiles onChange={(s) => this.handleSelectChange('files', s)} />
        </div>
        <div className="form-group">
          <label htmlFor="body">Body</label>
          <Editor
            editorState={editorState}
            wrapperClassName="demo-wrapper"
            editorClassName="demo-editor"
            onEditorStateChange={this.onEditorStateChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="related_content">Related Content</label>
          <RelatedContent onChange={(s) => this.handleSelectChange('related_content', s)} />
        </div>
        <div className="form-group">
          <label htmlFor="organizations">Organizations</label>
          <HRInfoOrganizations />
        </div>
        <div className="form-group">
          <label htmlFor="locations">Locations</label>
          <HRInfoLocations onChange={(s) => this.handleSelectChange('locations', s)} />
        </div>
        {bundles}
        {offices}
        {disasters}
        <div className="form-group">
          <label htmlFor="themes">Themes</label>
          <HRInfoSelect type="themes" multi={true} onChange={(s) => this.handleSelectChange('themes', s)} />
        </div>
        <input type="submit" value="Submit" />
      </form>
    );
  }
}

export default DocumentForm;
