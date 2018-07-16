import React from 'react';
import { EditorState, ContentState, convertFromHTML } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import {stateToHTML} from 'draft-js-export-html';
import HRInfoAPI from './HRInfoAPI';

const withForm = function withForm(Component, hrinfoType, label) {
  return class extends React.Component {
    constructor (props) {
      super(props);

      this.state = {
        doc: {
          label: '',
          date: [{}],
          address: {}
        },
        editorState: EditorState.createEmpty(),
        status: ''
      };

      this.hrinfoAPI = new HRInfoAPI();

      this.handleInputChange = this.handleInputChange.bind(this);
      this.handleSelectChange = this.handleSelectChange.bind(this);
      this.onEditorStateChange = this.onEditorStateChange.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);
      this.handleDelete = this.handleDelete.bind(this);
      this.isValid = this.isValid.bind(this);
      this.validateForm = this.validateForm.bind(this);
      this.postFieldCollections = this.postFieldCollections.bind(this);
    }

    handleInputChange(event) {
		let value = null;
		let name = null;
	  	if (event.target) {
		  	const target = event.target;
		  	value = target.type === 'checkbox' ? target.checked : target.value;
		  	name = target.name;
	  	} else {
		  	name = 'publication_date';
		  	value = event.toDate();
	  	}

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
      if (hrinfoType !== 'operations') {
        let hasOperation = this.state.doc.hasOperation ? this.state.doc.hasOperation : false;
        if (name === 'spaces') {
          doc.spaces.forEach(function (val) {
            if (val.type === 'operations') {
              hasOperation = true;
            }
          });
        }
        doc.hasOperation = hasOperation;
      }
      this.setState({
        doc: doc
      });
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

    handleDelete () {
      if (this.props.match.params.id) {
        const that = this;
        this.setState({
          status: 'deleting'
        });
        this.hrinfoAPI
          .remove(hrinfoType, this.props.match.params.id)
          .then(results => {
            that.props.setAlert('success', label + ' deleted successfully');
            that.props.history.push('/home');
          }).catch(function(err) {
            that.props.setAlert('danger', 'There was an error deleting your ' + label);
            that.props.history.push('/home');
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
        ((hrinfoType === 'documents' && this.isValid(doc.document_type)) || (hrinfoType === 'infographics' && this.isValid(doc.infographic_type)))  &&
        this.isValid(doc.publication_date) &&
        this.isValid(doc.files) &&
        this.isValid(doc.organizations)) {
        return true;
      }
      else {
        return false;
      }
    }

    async postFieldCollections (docid, field_collections) {
      for (const fc of field_collections) {
        const body = {
          file: fc.file,
          language: fc.language,
          host_entity: docid
        };
        await this.hrinfoAPI.saveFieldCollection(body);
      }
      return docid;
    }

    handleSubmit(event, isDraft = 0) {
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
      let doc = {};
      let field_collections = [];
      let body = JSON.stringify(this.state.doc);
      body = JSON.parse(body);
      body.published = isDraft ? 0 : 1;
      body.language = body.language.value;
      if (hrinfoType !== 'operations') {
        if (hrinfoType === 'infographics' || hrinfoType === 'documents') {
          body.publication_date = Math.floor(new Date(this.state.doc.publication_date).getTime() / 1000);
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
        }
        if (hrinfoType === 'infographics') {
          body.infographic_type = body.infographic_type.id;
        }
        if (hrinfoType === 'documents') {
          body.document_type = body.document_type.id;
        }
        if (hrinfoType === 'events') {
          body.category = body.category.value;
          if (body.address && body.address.country && typeof body.address.country === 'object') {
            body.address.country = body.address.country.pcode;
          }
          if (body.date[0] && body.date[0].timezone_db) {
            body.date[0].timezone_db = body.date[0].timezone_db.value;
          }
          if (body.date[0] && body.date[0].timezone) {
            body.date[0].timezone = body.date[0].timezone.value;
          }
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
      }

      this.hrinfoAPI
        .save(hrinfoType, body)
        .then(doc => {
          if (hrinfoType === 'documents' || hrinfoType === 'infographics') {
            return this.postFieldCollections(doc.id, field_collections);
          }
          else {
            return doc.id;
          }
        })
        .then(docid => {
          this.props.history.push('/' + hrinfoType + '/' + docid);
        })
        .catch(err => {
          this.props.setAlert('danger', 'There was an error uploading your ' + label);
        });
    }

    async componentDidMount() {
      if (this.props.match.params.id) {
        const doc = await this.hrinfoAPI.getItem(hrinfoType, this.props.match.params.id);
        if (hrinfoType !== 'operations') {
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
          if (doc['body-html']) {
            const blocksFromHTML = convertFromHTML(doc['body-html']);
            const contentState = ContentState.createFromBlockArray(
              blocksFromHTML.contentBlocks,
              blocksFromHTML.entityMap
            );
            this.state.editorState = EditorState.createWithContent(contentState);
          }
        }
        else {
          if (doc.launch_date) {
            const launchDate = new Date(parseInt(doc.launch_date, 10) * 1000);
            const day = ("0" + launchDate.getDate()).slice(-2);
            const month = ("0" + (launchDate.getMonth() + 1)).slice(-2);
            doc.launch_date = launchDate.getFullYear() + '-' + month + '-' + day;
          }
        }
        let state = {
          doc: doc
        };
        this.setState(state);
      }
    }

    render () {
      const { editorState } = this.state;
      const newProps = {
        handleInputChange: this.handleInputChange,
        doc: this.state.doc,
        editorState,
        onEditorStateChange: this.onEditorStateChange,
        handleSelectChange: this.handleSelectChange,
        handleSubmit: this.handleSubmit,
        handleDelete: this.handleDelete,
        isValid: this.isValid,
        status: this.state.status,
        hrinfoType,
        label
      };
      return <Component {...this.props} {...newProps} />;
    }
  }
}

export default withForm;
