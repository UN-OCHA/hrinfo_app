import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import TextField from '@material-ui/core/TextField';

import MaterialSelect from '../components/MaterialSelect';
import HRInfoAsyncSelect from '../components/HRInfoAsyncSelect';
import Item from '../components/Item';

class StaticContent extends React.Component {

  render() {
    const {items} = this.props;

    return (
      <div>
        {items ?
        <List>
            {items.map(function (item) {
              return (
                <Item item={item} viewMode='link' key={item.id} />
              );
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

class StaticContentSettings extends React.Component {
  state = {
    items: [],
    inputNumber: 1
  };

  getRow = (number) => {
    return (
      <FormControl key={number} fullWidth margin="normal">
        <FormLabel>Content</FormLabel>
        <HRInfoAsyncSelect type={this.props.content.value} onChange={this.addItem} value={this.state.items[number]} fields='id,label,files,date' />
      </FormControl>
    );
  }

  onAddBtnClick = (event) => {
    this.setState({
      inputNumber: this.state.inputNumber + 1
    });
  }

  addItem = (item) => {
    let items = this.state.items;
    items.push(item);
    this.setState({
      items: items
    });
    this.props.addWidgetSetting('items', items);
  }

  render () {
    let rows = [];
    if (this.props.content) {
      for (let i = 0; i < this.state.inputNumber; i++) {
        rows.push(this.getRow(i));
      }
    }

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
          <FormControl required fullWidth margin="normal">
            <FormLabel>Content Type</FormLabel>
            <MaterialSelect options={contentTypes} id="contentTypes" onChange={(s) => this.props.addWidgetSetting('content', s)} value={this.props.content} />
          </FormControl>
          {this.props.content ?
            <div>
              {rows}
              <Button variant="outlined" onClick={this.onAddBtnClick}>
                <i className="icon-document" /> &nbsp; Add another
              </Button>
            </div>: ''}
          </DialogContent>
          <DialogActions>
            <Button onClick={this.props.handleClose} color="primary">
              Cancel
            </Button>
            <Button onClick={(evt) => {this.props.handleSubmit()}} color="primary">
              Save
            </Button>
          </DialogActions>
      </Dialog>
    );
  }
}


export {StaticContentSettings, StaticContent};
