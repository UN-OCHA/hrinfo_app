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

import MaterialAsyncSelect from '../components/MaterialAsyncSelect';
import Item from '../components/Item';
import ReliefwebAPI from '../api/ReliefwebAPI';

class ReliefwebStaticContent extends React.Component {

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

class ReliefwebStaticContentSettings extends React.Component {
  state = {
    items: [],
    inputNumber: 1
  };

  reliefwebAPI = new ReliefwebAPI();

  getOptions = (input) => {
    const params = {
      appname: 'hrinfo',
      offset: 0,
      limit: 10,
      preset: 'latest',
      'query[value]': input
    };
    return this
      .reliefwebAPI
      .get(params)
      .then(data => {
        return data.data;
      });
  }

  getRow = (number) => {
    return (
      <FormControl key={number} fullWidth margin="normal">
        <FormLabel>Document</FormLabel>
        <MaterialAsyncSelect
          loadOptions={this.getOptions}
          onChange={(item) => {this.addItem(number, item)}}
          value={this.state.items[number]}
          getOptionLabel={(option) => {return option.fields.title}}
          />
      </FormControl>
    );
  }

  onAddBtnClick = (event) => {
    this.setState({
      inputNumber: this.state.inputNumber + 1
    });
  }

  addItem = (number, item) => {
    let items = this.state.items;
    items[number] = item;
    this.setState({
      items: items
    });
    this.props.addWidgetSetting('items', items);
  }

  render () {
    let rows = [];
    for (let i = 0; i < this.state.inputNumber; i++) {
      rows.push(this.getRow(i));
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
            <div>
              {rows}
              <Button variant="outlined" onClick={this.onAddBtnClick}>
                <i className="icon-document" /> &nbsp; Add another
              </Button>
            </div>
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


export {ReliefwebStaticContentSettings, ReliefwebStaticContent};
