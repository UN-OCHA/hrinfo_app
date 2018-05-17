import React from 'react';
import { EditorState, ContentState, convertFromHTML } from 'draft-js';
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
      doc: {
        label: '',
        publication_date: ''
      },
      editorState: EditorState.createEmpty()
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSelectChange = this.handleSelectChange.bind(this);
    this.onEditorStateChange = this.onEditorStateChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.uploadFiles = this.uploadFiles.bind(this);
    this.createFieldCollection = this.createFieldCollection.bind(this);
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
    console.log(selected);
    let doc = this.state.doc;
    doc[name] = selected;
    this.setState({
      doc: doc
    });
  }

  uploadFiles (body) {
    const data = new FormData();
    data.append('file', body.files[0].file[0]);
    data.append('filename', 'react_test.pdf');

    return fetch('https://www.humanitarianresponse.info/api/files', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + this.props.token,
      },
      body: data,
    }).then((response) => {
      return response.json();
    }).then(data => {
      return data.data[0][0].id;
    });
  }

  createFieldCollection (docid, fid, language) {
    const body = {
      file: fid,
      language: language,
      host_entity: docid
    };
    return fetch('https://www.humanitarianresponse.info/api/v1.0/files_collection', {
      method: 'POST',
      body: JSON.stringify(body),
      headers: {
        'Authorization': 'Bearer ' + this.props.token,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });
  }

  handleSubmit(event) {
    event.preventDefault();
    const token = this.props.token;
    let body = this.state.doc;
    body.document_type = body.document_type.id;
    delete body.related_content;
    body.operation = [body.operation.id];
    body.publication_date = Math.floor(new Date(this.state.doc.publication_date).getTime() / 1000);
    body.body = {
      format: 'panopoly_html_text',
      summary: '',
      value: body.body
    };
    const selectFields = ['organizations', 'bundles', 'offices', 'disasters', 'themes'];
    selectFields.forEach(function (field) {
      if (body[field]) {
        for (let i = 0; i < body[field].length; i++) {
          body[field][i] = body[field][i].id;
        }
      }
    })
    console.log(body);
    let field_collections = [];

    this.uploadFiles(body)
      .then(fid => {
        body.files[0].file = fid;
        field_collections = body.files;
        delete body.files;
        return fetch('https://www.humanitarianresponse.info/api/v1.0/documents', {
            method: 'POST',
            body: JSON.stringify(body),
            headers: {
              'Authorization': 'Bearer ' + token,
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            }
          });
      })
      .then(results => {
        return results.json();
      })
      .then(data => {
        let docid = data.data[0].id;
        console.log(docid);
        return this.createFieldCollection(docid, field_collections[0].file, field_collections[0].language);
      })
      .then(res => {
        return res.json();
      })
      .then(data => {
        console.log(data);
      });
  }

  handleDelete () {
    if (this.props.match.params.id) {
      fetch('https://www.humanitarianresponse.info/api/v1.0/documents/' + this.props.match.params.id, {
          method: 'DELETE',
          headers: {
            'Authorization': 'Bearer ' + this.props.token,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        })
        .then(results => {
          return results.json();
        }).then(data => {
          console.log(data);
        }).catch(function(err) {
          console.log("Fetch error: ", err);
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
    return fetch("https://www.humanitarianresponse.info/api/v1.0/documents/" + this.props.match.params.id)
        .then(results => {
            return results.json();
        }).then(data => {
          return data.data[0];
        }).catch(function(err) {
            console.log("Fetch error: ", err);
        });
  }

  async componentDidMount() {
    if (this.props.match.params.id) {
      const doc = await this.getDocument();
      doc.operation = doc.operation[0];
      /*doc.locations = [[
        181,
        47257,
        47278,
        47236
      ]];*/
      doc.locations = [[
        {id: 181, label: 'Afghanistan'},
        {id: 47257, label: 'Capital'},
        {id: 47278, label: 'Kabul'},
        {id: 47236, label: 'Kabul'}
      ]];
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
    const offices = this.state.doc.operation ? (
      <div className="form-group">
        <label htmlFor="offices">Coordination hub(s)</label>
        <HRInfoSelect type="offices" operation={this.state.doc.operation} isMulti={true} onChange={(s) => this.handleSelectChange('offices', s)} value={this.state.doc.offices} />
      </div>
    ) : '';

    const disasters = this.state.doc.operation ? (
      <div className="form-group">
        <label htmlFor="disasters">Disaster(s)</label>
        <HRInfoSelect type="disasters" operation={this.state.doc.operation} isMulti={true} onChange={(s) => this.handleSelectChange('disasters', s)} value={this.state.doc.disasters} />
      </div>
    ) : '';

    const bundles = this.state.doc.operation ? (
      <div className="form-group">
        <label htmlFor="bundles">Cluster(s)/Sector(s)</label>
        <HRInfoSelect type="bundles" operation={this.state.doc.operation} isMulti={true} onChange={(s) => this.handleSelectChange('bundles', s)} value={this.state.doc.bundles} />
      </div>
    ) : '';

    const { editorState } = this.state;

    return (
      <div>
      <form onSubmit={this.handleSubmit}>
        <div className="form-group">
          <label htmlFor="operations">Operation</label>
          <HRInfoSelect type="operations" onChange={(s) => this.handleSelectChange('operation', s)} value={this.state.doc.operation} />
        </div>
        <div className="form-group">
          <label htmlFor="label">Label</label>
          <input type="text" className="form-control" name="label" id="label" aria-describedby="labelHelp" placeholder="Document title" value={this.state.doc.label} onChange={this.handleInputChange} />
          <small id="labelHelp" className="form-text text-muted">Enter the title of the document.</small>
        </div>
        <div className="form-group">
          <label htmlFor="document_type">Document type</label>
          <HRInfoSelect type="document_types" onChange={(s) => this.handleSelectChange('document_type', s)} value={this.state.doc.document_type} />
        </div>
        <div className="form-group">
          <label htmlFor="publication_date">Original Publication Date</label>
          <input type="date" className="form-control" id="publication_date" name="publication_date" value={this.state.doc.publication_date} onChange={this.handleInputChange} />
        </div>
        <div className="form-group">
          <label htmlFor="files">Files</label>
          <HRInfoFiles onChange={(s) => this.handleSelectChange('files', s)} value={this.state.doc.files} />
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
          <HRInfoOrganizations onChange={(s) => this.handleSelectChange('organizations', s)} value={this.state.doc.organizations} />
        </div>
        <div className="form-group">
          <label htmlFor="locations">Locations</label>
          <HRInfoLocations onChange={(s) => this.handleSelectChange('locations', s)} value={this.state.doc.locations} />
        </div>
        {bundles}
        {offices}
        {disasters}
        <div className="form-group">
          <label htmlFor="themes">Themes</label>
          <HRInfoSelect type="themes" isMulti={true} onChange={(s) => this.handleSelectChange('themes', s)} value={this.state.doc.themes} />
        </div>
        <input type="submit" value="Submit" />
      </form>
      {this.props.match.params.id &&
        <button className="btn btn-default btn-alert" onClick={this.handleDelete}>Delete</button>
      }
      </div>
    );
  }
}

export default DocumentForm;
