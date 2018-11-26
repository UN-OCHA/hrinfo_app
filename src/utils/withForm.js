import React from 'react';
import { EditorState, ContentState, convertFromHTML } from 'draft-js';
import {stateToHTML} from 'draft-js-export-html';
import moment from 'moment';
import 'moment-timezone';
import HRInfoAPI from '../api/HRInfoAPI';

const withForm = function withForm(Component, hrinfoType, label, isClone = false) {
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
          doc[name].forEach(function (val) {
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
      let htmlOptions = {
        blockRenderers: {
          'atomic': (block) => {
            let key = block.getEntityAt(0);
            let type = editorState.getCurrentContent().getEntity(key).type;
            if (type === 'EMBEDDED_LINK') {
              let url = editorState.getCurrentContent().getEntity(key).getData().src;
              let width = editorState.getCurrentContent().getEntity(key).getData().width;
              let height = editorState.getCurrentContent().getEntity(key).getData().height;
              return '<div><iframe src="'+url+'" width="' + width + '" height="' + height + '" frameborder="0" allow="encrypted-media" allowfullscreen></iframe></div>';
            }
          },
        },
      };
      let html = stateToHTML(editorState.getCurrentContent(), htmlOptions);
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
            that.props.history.push('/home');
            that.props.setAlert('success', label + ' deleted successfully');
          }).catch(function(err) {
            that.props.history.push('/home');
            that.props.setAlert('danger', 'There was an error deleting your ' + label);
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
      if (this.isValid(doc.label)) {
        if (hrinfoType === 'operations' || hrinfoType === 'organizations') {
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
          this.isValid(doc.date) &&
          this.isValid(doc.organizations) &&
          this.isValid(doc.locations) &&
          this.isValid(doc.population_types) &&
          this.isValid(doc.language)) {
          isValid = true;
        }
        if (hrinfoType === 'offices' &&
          this.isValid(doc.spaces) &&
          this.isValid(doc.address)) {
          isValid = true;
        }
        if (hrinfoType === 'bundles' &&
          this.isValid(doc.type) &&
          this.isValid(doc.hid_access) &&
          this.isValid(doc.operation)) {
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
      if (hrinfoType !== 'organizations') {
        body.published = isDraft ? 0 : 1;
      }
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
          body.date.forEach(function (d) {
            if (d && d.value) {
              d.value = moment(d.value).utc().format('YYYY-MM-DD HH:mm:ss');
            }
            if (d && d.value2) {
              d.value2 = moment(d.value2).utc().format('YYYY-MM-DD HH:mm:ss');
            }
            if (d && d.timezone_db) {
              d.timezone_db = d.timezone_db.value;
            }
            if (d && d.timezone) {
              d.timezone = d.timezone.value;
            }
          });
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
          if (body.date && body.date.value) {
            date.value = moment(body.date.value).format('YYYY-MM-DD HH:mm:ss');
          }
          if (body.date && body.date.value2) {
            if (body.date.value2 === (new Date(0, 0, 0))) {
              date.value2 = undefined;
            }
            else {
              date.value2 = moment(body.date.value2).format('YYYY-MM-DD HH:mm:ss');
            }
          }
          if (body.date && body.date.timezone) {
            date.timezone = body.date.timezone.value;
          }
          body.date = date;
          if (body.unit_measurement) {
            let unit_measurement = [];
            body.unit_measurement.forEach((um) => {
              unit_measurement.push(um.label.toLowerCase());
            });
            body.unit_measurement = unit_measurement;
          }
          if (body.collection_method) {
            let collection_method = [];
            body.collection_method.forEach((cm) => {
              collection_method.push(cm.label.toLowerCase());
            });
            body.collection_method = collection_method;
          }
          if (body.geographic_level) {
            body.geographic_level = body.geographic_level.label;
          }
          if (body.status) {
            body.status = body.status.label;
          }
          if (body.report && body.report.accessibility) {
            body.report.accessibility = body.report.accessibility.label;
            if (body.report.file && typeof body.report.file === 'object') {
              body.report.file = body.report.file.id;
            }
            else {
              delete body.report.file;
            }
            if (body.report.url.length === 0) {
              delete body.report.url;
            }
            if (body.report.instructions.length === 0) {
              delete body.report.instructions;
            }
          }
          if (body.data && body.data.accessibility) {
            body.data.accessibility = body.data.accessibility.label;
            if (body.data.file && typeof body.data.file === 'object') {
              body.data.file = body.data.file.id;
            }
            else {
              delete body.data.file;
            }
            if (body.data.url.length === 0) {
              delete body.data.url;
            }
            if (body.data.instructions.length === 0) {
              delete body.data.instructions;
            }
          }
          if (body.questionnaire && body.questionnaire.accessibility) {
            body.questionnaire.accessibility = body.questionnaire.accessibility.label;
            if (body.questionnaire.file && typeof body.questionnaire.file === 'object') {
              body.questionnaire.file = body.questionnaire.file.id;
            }
            else {
              delete body.questionnaire.file;
            }
            if (body.questionnaire.url.length === 0) {
              delete body.questionnaire.url;
            }
            if (body.questionnaire.instructions.length === 0) {
              delete body.questionnaire.instructions;
            }
          }
        }
        if (hrinfoType === 'offices') {
          if (body.address && body.address.country && typeof body.address.country === 'object') {
            body.address.country = body.address.country.pcode;
          }
        }
        if (hrinfoType === 'organizations') {
          body.type = body.type.id;
          delete body.language;
          delete body.hasOperation;
        }
        if (hrinfoType !== 'organizations') {
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
          if (body.space.length === 0) {
            delete body.space;
          }
          if (body.operation.length === 0) {
            delete body.operation;
          }
        }
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
          if (Object.keys(body.locations[0]).length > 0) {
            body.locations.forEach(function (location, index) {
              let last = 0;
              for (let j = 0; j < Object.keys(location).length; j++) {
                if (typeof location[j] === 'object') {
                  last = j;
                }
              }
              locations.push(parseInt(location[last].id, 10));
            });
          }
          body.locations = locations;
        }
        if (body.language && body.language.value === '' && body.language.label === '') {
          delete body.language;
        }
      }
      if (typeof body['body-html'] !== 'undefined') {
        delete body['body-html'];
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
          if (hrinfoType === 'bundles') {
            this.props.history.push('/groups/' + docid);
          }
          else {
            this.props.history.push('/' + hrinfoType + '/' + docid);
          }
          this.props.setAlert('success', 'Saved successfully');
        })
        .catch(err => {
          this.props.setAlert('danger', 'There was an error uploading your ' + label);
        });
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
          if (doc.status) {
            doc.status = {
              label: doc.status,
              value: doc.status
            };
          }
          if (doc.date && doc.date.from) {
            doc.date.value = doc.date.from;
            delete doc.date.from;
          }
          if (doc.date && doc.date.to) {
            doc.date.value2 = doc.date.to;
            delete doc.date.to;
          }
          if (doc.collection_method) {
            let collection_method_fetched = [];
            doc.collection_method.forEach((cm) => {
              if (cm) {
                collection_method_fetched.push({
                  value: cm[0].toUpperCase() + cm.slice(1),
                  label: cm[0].toUpperCase() + cm.slice(1)
                });
              }
            });
            doc.collection_method = collection_method_fetched;
          }
          if (doc.unit_measurement) {
            let unit_measurement_fetched = [];
            doc.unit_measurement.forEach((um) => {
              if (um) {
                unit_measurement_fetched.push({
                  value: um[0].toUpperCase() + um.slice(1),
                  label: um[0].toUpperCase() + um.slice(1)
                });
              }
            });
            doc.unit_measurement = unit_measurement_fetched;
          }
          if (doc.space) {
            doc.space.forEach(function (sp) {
              if (sp) {
                sp.type = "spaces";
                doc.spaces.push(sp);
              }
            });
          }
          if (!doc.language) {
            doc.language = {
              value: '',
              label: ''
            }
          }
          if (doc.locations) {
            let locations_fetched = [];
            for (let i = 0; i < doc.locations.length ; i++) {
              locations_fetched.push(await this.hrinfoAPI.getItem("locations", doc.locations[i].id));
            }
            doc.locations = locations_fetched;
          }
          if (doc['body-html']) {
            const blocksFromHTML = convertFromHTML(doc['body-html']);
            const contentState = ContentState.createFromBlockArray(
              blocksFromHTML.contentBlocks,
              blocksFromHTML.entityMap
            );
            this.state.editorState = EditorState.createWithContent(contentState);
          }
          if (doc.disasters) {
            doc.disasters.forEach((disaster) => {
              disaster.id = disaster.glide;
            });
          }
          if (isClone) {
            delete doc.id;
            delete doc.files;
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
};

export default withForm;
