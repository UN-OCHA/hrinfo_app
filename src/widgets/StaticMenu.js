import React from 'react';
import {NavLink} from 'react-router-dom';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import MenuList from '@material-ui/core/MenuList';
import MenuItem from '@material-ui/core/MenuItem';

class StaticMenu extends React.Component {

  render() {
    const {items} = this.props;

    return (
      <div>
        {items ?
        <MenuList>
            {items.map(function (item) {
              return (
                <MenuItem key={item.link}>
                  {item.link.indexOf('http') === -1 ?
                    <NavLink to={item.link} className="link">{item.title}</NavLink> : <a href={item.link} target="_blank">{item.title}</a> }
                </MenuItem>
              );
            })}
        </MenuList> : '' }
      </div>
    );
  }
}

class StaticMenuSettings extends React.Component {
  state = {
    items: [{
      title: '',
      link: ''
    }],
    inputNumber: 1
  };

  getRow = (number) => {
    return (
      <Paper key={number}>
        <FormControl fullWidth margin="normal">
          <FormLabel>Menu Title</FormLabel>
          <TextField
            type     = "text"
            value    = {this.state.items[number].title}
            onChange = {(v) => {this.addItem(v, 'title', number)}} />
        </FormControl>
        <FormControl fullWidth margin="normal">
          <FormLabel>Menu Link</FormLabel>
          <TextField
            type     = "text"
            value    = {this.state.items[number].link}
            onChange = {(v) => {this.addItem(v, 'link', number)}} />
            <FormHelperText>
              If adding an internal link, please do NOT add https://www.humanitarianresponse.info at the beginning.
            </FormHelperText>
        </FormControl>
      </Paper>
    );
  }

  onAddBtnClick = (event) => {
    let items = this.state.items;
    items.push({
      title: '',
      link: ''
    });
    this.setState({
      inputNumber: this.state.inputNumber + 1,
      items: items
    });
  }

  addItem = (value, type, number) => {
    let items = this.state.items;
    if (!items[number]) {
      items[number] = {
        title: '',
        link: ''
      };
    }
    items[number][type] = value.target.value;
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
              Add Widget
            </Button>
          </DialogActions>
      </Dialog>
    );
  }
}


export {StaticMenuSettings, StaticMenu};
