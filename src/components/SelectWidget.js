import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Button from '@material-ui/core/Button';

import {OchaProducts, OchaProductsSettings} from '../widgets/OchaProducts';
import {DynamicContent, DynamicContentSettings } from '../widgets/DynamicContent';
import {StaticContent, StaticContentSettings} from '../widgets/StaticContent';

class SelectWidget extends React.Component {

  state = {
    widgetTypes: {
      'DynamicContent': DynamicContent,
      'OchaProducts': OchaProducts,
      'StaticContent': StaticContent
    },
    isSettingsOpen: {
      DynamicContent: false,
      OchaProducts: false,
      StaticContent: false
    },
    addWidgetOptions: {
      widgetSettings: {}
    }
  };

  /**
   * When user selects a widget from the modal dialog, this will be called.
   * By calling the 'addWidget' method, the widget could be added to the previous requested location.
   */
  handleWidgetSelection = () => {
    const {widgetName, widgetSettings} = this.state.addWidgetOptions;
    const randomName = widgetName + '-' + Math.random().toString(36).substring(7);

    this.closeSettings(widgetName);

    const widget = {
      type: this.state.widgetTypes[widgetName],
      title: widgetSettings.title ? widgetSettings.title : '',
      props: widgetSettings
    };
    this.props.onWidgetSelect(randomName, widget);
  }

  addWidgetSetting = (key, value) => {
    let addWidgetOptions = this.state.addWidgetOptions;
    if (value.target) {
      addWidgetOptions.widgetSettings[key] = value.target.value;
    }
    else {
      addWidgetOptions.widgetSettings[key] = value;
    }
    this.setState({
      addWidgetOptions
    });
  }

  openSettings = (widgetName) => {
    let addWidgetOptions = this.state.addWidgetOptions;
    addWidgetOptions.widgetName = widgetName;
    addWidgetOptions.widgetSettings = {};
    let isSettingsOpen = this.state.isSettingsOpen;
    isSettingsOpen[widgetName] = true;
    this.props.onRequestClose();
    this.setState({
      isSettingsOpen,
      addWidgetOptions
    });
  }

  closeSettings = (widgetName) => {
    let isSettingsOpen = this.state.isSettingsOpen;
    isSettingsOpen[widgetName] = false;
    this.setState({
      isSettingsOpen
    });
  }

  render() {

    return (
      <div>
        <Dialog
          fullScreen
          open={this.props.isModalOpen}
          onClose={this.props.onRequestClose}
        >
          <DialogTitle id="scroll-dialog-title">Choose a Widget</DialogTitle>
          <DialogContent>
            <List>
              <ListItem>
                <Button onClick={(s) => {this.openSettings('OchaProducts')}}>Ocha Products</Button>
              </ListItem>
              <ListItem>
                <Button onClick={(s) => {this.openSettings('DynamicContent')}}>Dynamic Content from HRInfo</Button>
              </ListItem>
              <ListItem>
                <Button onClick={(s) => {this.openSettings('StaticContent')}}>Static Content from HRInfo</Button>
              </ListItem>
            </List>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.props.onRequestClose} color="primary">
              Cancel
            </Button>
          </DialogActions>
        </Dialog>
        <DynamicContentSettings
          open={this.state.isSettingsOpen['DynamicContent']}
          handleClose={() => {this.closeSettings('DynamicContent')}}
          handleSubmit={this.handleWidgetSelection}
          addWidgetSetting={this.addWidgetSetting}
          {...this.state.addWidgetOptions.widgetSettings}
        />
        <OchaProductsSettings
          open={this.state.isSettingsOpen['OchaProducts']}
          handleClose={() => { this.closeSettings('OchaProducts') }}
          handleSubmit={this.handleWidgetSelection}
          addWidgetSetting={this.addWidgetSetting}
        />
        <StaticContentSettings
          open={this.state.isSettingsOpen['StaticContent']}
          handleClose={() => { this.closeSettings('StaticContent') }}
          handleSubmit={this.handleWidgetSelection}
          addWidgetSetting={this.addWidgetSetting}
        />
      </div>
    );
  }
}

export default SelectWidget;
