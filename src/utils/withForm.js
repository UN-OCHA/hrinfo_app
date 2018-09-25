import React from 'react';
import { EditorState, ContentState, convertFromHTML } from 'draft-js';
import {stateToHTML} from 'draft-js-export-html';
import moment from 'moment';
import HRInfoAPI from '../api/HRInfoAPI';

const withForm = function withForm(Component, hrinfoType, label) {
  return class extends React.Component {
    constructor (props) {
      super(props);

      this.state = {
        doc: {
          label: '',
          language: {}
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
      doc[name] = selected;

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
      let isValid = false;
      if (this.isValid(doc.language) &&
        this.isValid(doc.label)) {
        if (hrinfoType === 'operations') {
          isValid = true;
        }
        if (hrinfoType === 'documents' &&
          this.isValid(doc.spaces) &&
          this.isValid(doc.document_type) &&
          this.isValid(doc.publication_date) &&
          this.isValid(doc.files) &&
          this.isValid(doc.organizations)
        ) {
          isValid = true;
        }
        if (hrinfoType === 'infographics' &&
          this.isValid(doc.spaces) &&
          this.isValid(doc.infographic_type) &&
          this.isValid(doc.publication_date) &&
          this.isValid(doc.files) &&
          this.isValid(doc.organizations)
        ) {
          isValid = true;
        }
        if (hrinfoType === 'events' &&
          this.isValid(doc.spaces) &&
          this.isValid(doc.category) &&
          this.isValid(doc.date)) {
          isValid = true;
        }
        if (hrinfoType === 'assessments' &&
          this.isValid(doc.spaces) &&
          this.isValid(doc.status) &&
          this.isValid(doc.bundles) &&
          this.isValid(doc.date) &&
          this.isValid(doc.organizations) &&
          this.isValid(doc.locations) &&
          this.isValid(doc.population_types) &&
          this.isValid(doc.report) &&
          this.isValid(doc.data) &&
          this.isValid(doc.language)) {
          isValid = true;
        }
        if (hrinfoType === 'offices' &&
          this.isValid(doc.spaces) &&
          this.isValid(doc.address)) {
          isValid = true;
        }
      }
      return isValid;
    }

    async postFieldCollections (docid, field_collections) {
      for (const fc of field_collections) {
        let body = {
          file: fc.file,
          language: fc.language,
          host_entity: docid
        };
        if (fc.item_id) {
          body.item_id = fc.item_id;
        }
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
      let field_collections = [];
      let body = JSON.stringify(this.state.doc);
      body = JSON.parse(body);
      body.published = isDraft ? 0 : 1;
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
          //body.category = body.category.value;
          if (body.address && body.address.country && typeof body.address.country === 'object') {
            body.address.country = body.address.country.pcode;
          }
          if (!Array.isArray(body.date)) {
            body.date = [body.date];
          }
          if (body.date && body.date.value) {
            body.date.value = moment(body.date.value).format('YYYY-MM-DD HH:mm:ss');
          }
          if (body.date && body.date.value2) {
            body.date.value2 = moment(body.date.value2).format('YYYY-MM-DD HH:mm:ss');
          }
          if (body.date && body.date.timezone_db) {
            body.date.timezone_db = body.date.timezone_db.value;
          }
          if (body.date && body.date.timezone) {
            body.date.timezone = body.date.timezone.value;
          }
          if (body.contacts) {
            body.contacts = body.contacts.map(function (c) {
              return {cid: c.id};
            });
          }
          if (body.agenda) {
            body.agenda = body.agenda.map(function (a) {
              return a.id;
            });
          }
          if (body.meeting_minutes) {
            body.meeting_minutes = body.meeting_minutes.map(function (a) {
              return a.id;
            });
          }
        }
        if (hrinfoType === 'assessments') {
          let date = {};
          if (body.date && body.date.value_from) {
            date.from = moment(body.date.value_from).format('YYYY-MM-DD HH:mm:ss');
          }
          if (body.date && body.date.value_to) {
            if (body.date.value_to === (new Date(0, 0, 0))) {
              date.to = undefined;
            }
            else {
              date.to = moment(body.date.value_to).format('YYYY-MM-DD HH:mm:ss');
            }
          }
          if (body.date && body.date.timezone) {
            date.timezone = body.date.timezone.value;
          }
          if (body.date && body.date.rrule) {
            body.frequency = body.date.rrule.split(";")[0].split("=")[1];
          }
          body.date = date;
          if (body.unit_measurement) {
            let unit_measurement = [];
            body.unit_measurement.forEach((um) => {
              unit_measurement.push(um.label);
            });
            body.unit_measurement = unit_measurement;
          }
          if (body.collection_method) {
            let collection_method = [];
            body.collection_method.forEach((cm) => {
              collection_method.push(cm.label);
            });
            body.collection_method = collection_method;
          }
          if (body.geographic_level) {
            body.geographic_level = body.geographic_level.label;
          }
          if (body.status) {
            body.status = body.status.label;
          }
          if (body.report && body.report.accessibility[0]) {
            body.report.accessibility = body.report.accessibility[0].label;
            if (body.report.instructions[0]) {
              body.report.instructions = body.report.instructions[0];
            }
            else {
              delete body.report.instructions;
            }
            if (body.report.url[0]) {
              body.report.url = body.report.url[0];
            }
            else {
              delete body.report.url;
            }
          }
          if (body.data && body.data.accessibility[0]) {
            body.data.accessibility = body.data.accessibility[0].label;
            if (body.data.instructions[0]) {
              body.data.instructions = body.data.instructions[0];
            }
            else {
              delete body.data.instructions;
            }
            if (body.data.url[0]) {
              body.data.url = body.data.url[0];
            }
            else {
              delete body.data.url;
            }
          }
          if (body.questionnaire && body.questionnaire.accessibility[0]) {
            body.questionnaire.accessibility = body.questionnaire.accessibility[0].label;
            if (body.questionnaire.instructions[0]) {
              body.questionnaire.instructions = body.questionnaire.instructions[0];
            }
            else {
              delete body.questionnaire.instructions;
            }
            if (body.questionnaire.url[0]) {
              body.questionnaire.url = body.questionnaire.url[0];
            }
            else {
              delete body.questionnaire.url;
            }
          }
        }
        if (hrinfoType === 'offices') {
          if (body.address && body.address.country) {
            body.address.country = body.address.country.pcode;
          }
        }
        body.operation = [];
        body.space     = [];
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
        const selectFields = ['organizations', 'bundles', 'offices', 'disasters', 'themes', 'participating_organizations', 'population_types'];
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
      console.log('-------------------', body);
      // this.hrinfoAPI
      //   .save(hrinfoType, body)
      //   .then(doc => {
      //     if (hrinfoType === 'documents' || hrinfoType === 'infographics') {
      //       return this.postFieldCollections(doc.id, field_collections);
      //     }
      //     else {
      //       return doc.id;
      //     }
      //   })
      //   .then(docid => {
      //     this.props.history.push('/' + hrinfoType + '/' + docid);
      //   })
      //   .catch(err => {
      //     this.props.setAlert('danger', 'There was an error uploading your ' + label);
      //   });
    }

    async componentDidMount() {
      if (this.props.match.params.id) {
        const doc = await this.hrinfoAPI.getItem(hrinfoType, this.props.match.params.id);
        let state = {};
        if (hrinfoType !== 'operations' && hrinfoType !== 'organizations') {
          doc.spaces = [];
          doc.operation.forEach(function (op) {
            if (op) {
              doc.hasOperation = true;
              op.type = "operations";
              doc.spaces.push(op);
            }
          });
          if (doc.space) {
            doc.space.forEach(function (sp) {
              if (sp) {
                sp.type = "spaces";
                doc.spaces.push(sp);
              }
            });
          }
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
        state.doc = doc;
        this.setState(state);
      }
    }

    componentWillUnmount() {
      this.setState({});
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
