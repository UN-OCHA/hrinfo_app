import React from 'react';
import List from '@material-ui/core/List';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

import ReliefwebAPI from '../api/ReliefwebAPI';
import ReliefwebSelect from '../components/ReliefwebSelect';
import Item from '../components/Item';

class ReliefwebDynamicContent extends React.Component {

  state = {
    documents: []
  };

  reliefwebAPI = new ReliefwebAPI();

  handleChange = (event, value) => {
    this.setState({ value });
  };

  async componentDidMount() {
    const props = this.props;
    const params = {
      appname: 'hrinfo',
      offset: 0,
      limit: this.props.number ? this.props.number : 10,
      preset: 'latest',
    };
    let index = 0;
    Object.keys(props).forEach(function (key) {
      if (key !== 'title' && key !== 'number') {
        params['filter[conditions][' + index + '][field]'] = key;
        params['filter[conditions][' + index + '][value]'] = props[key].value;
      }
    });
    this.setState({
      documents: await this.reliefwebAPI.get(params)
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
                <Item item={doc} viewMode='link' />
              );
            })}
        </List> : '' }
      </div>
    );
  }
}

class ReliefwebDynamicContentSettings extends React.Component {

  render () {

    return (
      <Dialog
          fullScreen
          open={this.props.open}
          onClose={this.props.handleClose}
        >
          <DialogTitle id="scroll-dialog-title">Settings</DialogTitle>
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
            <FormControl fullWidth margin="normal">
              <FormLabel>Country</FormLabel>
              <ReliefwebSelect type="country" onChange={(s) => this.props.addWidgetSetting('country', s)} value={this.props.country} />
            </FormControl>
            <FormControl fullWidth margin="normal">
              <FormLabel>Document type</FormLabel>
              <ReliefwebSelect type="format" onChange={(s) => this.props.addWidgetSetting('format', s)} value={this.props.format} />
            </FormControl>
            <FormControl fullWidth margin="normal">
              <FormLabel>Disaster Type</FormLabel>
              <ReliefwebSelect type="disaster_type" onChange={(s) => this.props.addWidgetSetting('disaster_type', s)} value={this.props.disaster_type} />
            </FormControl>
            <FormControl fullWidth margin="normal">
              <FormLabel>Theme</FormLabel>
              <ReliefwebSelect type="theme" onChange={(s) => this.props.addWidgetSetting('theme', s)} value={this.props.theme} />
            </FormControl>
            <FormControl fullWidth margin="normal">
              <FormLabel>Language</FormLabel>
              <ReliefwebSelect type="language" onChange={(s) => this.props.addWidgetSetting('language', s)} value={this.props.language} />
            </FormControl>
            <FormControl fullWidth margin="normal">
              <FormLabel>Organisation</FormLabel>
              <ReliefwebSelect type="source" onChange={(s) => this.props.addWidgetSetting('source', s)} value={this.props.source} />
            </FormControl>
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

export { ReliefwebDynamicContent, ReliefwebDynamicContentSettings };
