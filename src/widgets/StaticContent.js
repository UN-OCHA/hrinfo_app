import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import Button from '@material-ui/core/Button';

import HRInfoAsyncSelect from '../components/HRInfoAsyncSelect';
import HRInfoSelect from '../components/HRInfoSelect';
import Item from '../components/Item';
import HRInfoAPI from '../api/HRInfoAPI';

class StaticContent extends React.Component {
  state = {
    items: []
  };

  hrinfoAPI = new HRInfoAPI();

  render() {

    return (
      <div>
        Test
      </div>
    );
  }
}

class StaticContentSettings extends React.Component {

  render () {

    return (
      <Dialog
        fullScreen
        open={this.props.open}
        onClose={this.props.handleClose}
        >
          <DialogTitle id="scroll-dialog-title">Settings</DialogTitle>
          <DialogContent>
            <FormControl required fullWidth margin="normal">
              <FormLabel>Documents</FormLabel>
              <HRInfoAsyncSelect type="documents" isMulti={true} onChange={(s) => this.props.addWidgetSetting('documents', s)} fields='id,label,files' />
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


export {StaticContentSettings, StaticContent};
