import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { Link } from 'react-router-dom';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import Modal from '@material-ui/core/Modal';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

import MaterialSelect from '../components/MaterialSelect';
import HRInfoSelect from '../components/HRInfoSelect';
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
    const params = {};
    params['filter[' + this.props.space.type.substring(0, this.props.space.type.length - 1) + ']'] = this.props.space.id;
    params['sort'] = '-publication_date';
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
              return (<ListItem key={doc.id}><Link to={'/documents/' + doc.id}><ListItemText primary={doc.label} /></Link></ListItem>);
            })}
        </List> : '' }
      </div>
    );
  }
}

const styles = theme => ({
  paper: {
    position: 'absolute',
    width: theme.spacing.unit * 50,
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing.unit * 4,
  },
});

const contentTypes = [
  {
    value: 'infographics',
    label: 'Infographics',
  },
  {
    value: 'documents',
    label: 'Documents',
  },
];

class SettingsModal extends React.Component {

  render () {
    const { classes } = this.props;

    return (
      <Modal
          aria-labelledby="simple-modal-title"
          aria-describedby="simple-modal-description"
          open={this.props.open}
          onClose={this.props.handleClose}
        >
          <div style={this.props.style} className={classes.paper}>
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
            <FormControl required fullWidth margin="normal">
              <FormLabel>Operation(s) / Webspace(s)</FormLabel>
              <HRInfoSelect type="spaces" onChange={(s) => this.props.addWidgetSetting('space', s)} />
            </FormControl>
            <FormControl required fullWidth margin = "normal">
              <FormLabel>Number of items</FormLabel>
              <TextField
                type     = "number"
                name     = "number"
                id       = "number"
                value    = {this.props.number}
                onChange = {(s) => {this.props.addWidgetSetting('number', s)}}/>
            </FormControl>
            <Button color="primary" variant="contained" onClick={(evt) => {this.props.handleSubmit()}}>Add Widget</Button>
          </div>
      </Modal>
    );
  }
}

SettingsModal.propTypes = {
  classes: PropTypes.object.isRequired,
};

const DynamicContentSettings = withStyles(styles)(SettingsModal);

export { DynamicContent, DynamicContentSettings };
