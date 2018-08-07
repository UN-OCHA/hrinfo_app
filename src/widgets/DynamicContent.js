import React from 'react';
import { Link } from 'react-router-dom';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import moment from 'moment';

import MaterialSelect from '../components/MaterialSelect';
import HRInfoAsyncSelect from '../components/HRInfoAsyncSelect';
import HRInfoSelect from '../components/HRInfoSelect';
import EventCategorySelect from '../components/EventCategorySelect';
import HRInfoAPI from '../api/HRInfoAPI';

class DynamicContent extends React.Component {

  state = {
    documents: []
  };

  hrinfoAPI = new HRInfoAPI();

  handleChange = (event, value) => {
    this.setState({ value });
  };

  async componentDidMount() {
    const contentType = this.props.content ? this.props.content.value : 'documents';
    const props = this.props;
    const params = {};
    Object.keys(props).forEach(function (key) {
      if (key !== 'title' && key !== 'content' && key !== 'number') {
        let paramKey = key;
        if (key === 'space') {
          paramKey = props.space.type.substring(0, props.space.type.length - 1);
        }
        if (key === 'bundle' || key === 'office' || key === 'theme' || key === 'organization') {
          paramKey = key + 's';
        }
        params['filter[' + paramKey + ']'] = props[key].id;
      }
    });
    if (contentType === 'assessments') {
      params['sort'] = '-date';
    }
    else if (contentType === 'events') {
      params['filter[date][value]'] = new Date(moment()).toISOString();
      params['filter[date][operator]'] = '>';
      params['sort'] = 'date';
    }
    else {
      params['sort'] = '-publication_date';
    }
    params['range'] = this.props.number ? this.props.number : 10;
    this.setState({
      documents: await this.hrinfoAPI.get(contentType, params)
    });
  }

  render() {
    const { documents } = this.state;

    return (
      <div>
        {documents.data ?
        <List>
            {documents.data.map(function (doc) {
              return (
                <ListItem key={doc.id}>
                  <Link to={'/' + doc.type + '/' + doc.id}><ListItemText primary={doc.label} /></Link>
                  {doc.type === 'events' ? moment(doc.date[0].value).format('DD/MM/YYYY') : ''}
                </ListItem>);
            })}
        </List> : '' }
      </div>
    );
  }
}

const contentTypes = [
  {
    value: 'assessments',
    label: 'Assessments'
  },
  {
    value: 'documents',
    label: 'Documents',
  },
  {
    value: 'events',
    label: 'Events'
  },
  {
    value: 'infographics',
    label: 'Infographics',
  }
];

class DynamicContentSettings extends React.Component {

  render () {

    return (
      <Dialog
          fullScreen
          open={this.props.open}
          onClose={this.props.handleClose}
        >
          <DialogTitle id="scroll-dialog-title">Dynamic Content Settings</DialogTitle>
          <DialogContent>
            <FormControl required fullWidth margin = "normal">
              <FormLabel>Title</FormLabel>
              <TextField
                type     = "text"
                name     = "title"
                id       = "title"
                value    = {this.props.title}
                onChange = {(s) => {this.props.addWidgetSetting('title', s)}}/>
            </FormControl>
            <FormControl required fullWidth margin="normal">
              <FormLabel>Content Type</FormLabel>
              <MaterialSelect options={contentTypes} id="contentTypes" onChange={(s) => this.props.addWidgetSetting('content', s)} value={this.props.content} />
            </FormControl>
            <FormControl fullWidth margin="normal">
              <FormLabel>Operation / Webspace</FormLabel>
              <HRInfoSelect type="spaces" onChange={(s) => this.props.addWidgetSetting('space', s)} value={this.props.space} />
            </FormControl>
            <FormControl fullWidth margin="normal">
              <FormLabel>Cluster/Sector</FormLabel>
              <HRInfoAsyncSelect
                type     =  "bundles"
                onChange  =  {(s) => this.props.addWidgetSetting('bundle', s)}
                value =  {this.props.bundle}
                fields = 'id,label,operation.label'/>
            </FormControl>
            <FormControl fullWidth margin="normal">
              <FormLabel>Organization</FormLabel>
              <HRInfoAsyncSelect type="organizations"
                onChange={(s) => this.props.handleSelectChange('organization', s)}
                value={this.props.organization}/>
            </FormControl>
            {this.props.content && this.props.content.value === 'assessments' ?
              <FormControl fullWidth margin="normal">
                <FormLabel>Participating Organization</FormLabel>
                <HRInfoAsyncSelect type="organizations"
                  onChange={(s) => this.props.handleSelectChange('participating_organization', s)}
                  value={this.props.participating_organization}/>
              </FormControl> : '' }
            <FormControl fullWidth margin="normal">
              <FormLabel>Coordination hub</FormLabel>
              <HRInfoAsyncSelect
                type     =  "offices"
                onChange  =  {(s) => this.props.addWidgetSetting('office', s)}
                value =  {this.props.office}/>
            </FormControl>
            <FormControl fullWidth margin="normal">
              <FormLabel>Disaster</FormLabel>
              <HRInfoAsyncSelect
                type     =  "disasters"
                onChange  =  {(s) => this.props.addWidgetSetting('disaster', s)}
                value =  {this.props.disaster} />
            </FormControl>
            <FormControl fullWidth margin="normal">
              <FormLabel>Theme</FormLabel>
              <HRInfoSelect type="themes" onChange={(s) => this.props.addWidgetSetting('theme', s)} value={this.props.theme} />
            </FormControl>
            {this.props.content && this.props.content.value === 'documents' ?
              <FormControl fullWidth margin="normal">
                <FormLabel>Document Type</FormLabel>
                <HRInfoSelect type="document_types" onChange={(s) => this.props.addWidgetSetting('document_type', s)} value={this.props.document_type} />
              </FormControl> : ''
            }
            {this.props.content && this.props.content.value === 'infographics' ?
              <FormControl fullWidth margin="normal">
                <FormLabel>Infographic Type</FormLabel>
                <HRInfoSelect type="infographic_types" onChange={(s) => this.props.addWidgetSetting('infographic_type', s)} value={this.props.infographic_type} />
              </FormControl> : ''
            }
            {this.props.content && this.props.content.value === 'events' ?
              <FormControl fullWidth margin="normal">
                <FormLabel>Event Category</FormLabel>
                <EventCategorySelect value     = {this.props.category}
                                     onChange  = {(s) => this.props.addWidgetSetting('category', s)}/>
              </FormControl> : ''
            }
            <FormControl fullWidth margin = "normal">
              <FormLabel>Number of items</FormLabel>
              <TextField
                type     = "number"
                name     = "number"
                id       = "number"
                value    = {this.props.number}
                onChange = {(s) => {this.props.addWidgetSetting('number', s)}}/>
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.props.handleClose} color="primary">
              Cancel
            </Button>
            <Button onClick={(evt) => {this.props.handleSubmit()}} color="primary">
              Add Widget
            </Button>
          </DialogActions>
      </Dialog>
    );
  }
}

export { DynamicContent, DynamicContentSettings };
