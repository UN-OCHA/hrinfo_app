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
import {FreeText, FreeTextSettings} from '../widgets/FreeText';
import {HidContactsWidget, HidContactsWidgetSettings} from '../widgets/HidContactsWidget';
import {ReliefwebDynamicContent, ReliefwebDynamicContentSettings} from '../widgets/ReliefwebDynamicContent';
import {ReliefwebStaticContent, ReliefwebStaticContentSettings} from '../widgets/ReliefwebStaticContent';
import {StaticMenu, StaticMenuSettings} from '../widgets/StaticMenu';

class SelectWidget extends React.Component {

  state = {
    widgetTypes: {
      'DynamicContent': DynamicContent,
      'OchaProducts': OchaProducts,
      'StaticContent': StaticContent,
      'FreeText': FreeText,
      'HidContactsWidget': HidContactsWidget,
      'ReliefwebDynamicContent': ReliefwebDynamicContent,
      'ReliefwebStaticContent' : ReliefwebStaticContent,
      'StaticMenu': StaticMenu
    },
    isSettingsOpen: {
      DynamicContent: false,
      OchaProducts: false,
      StaticContent: false,
      FreeText: false,
      HidContactsWidget: false,
      ReliefwebDynamicContent: false,
      ReliefwebStaticContent: false,
      StaticMenu: false
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
              <ListItem>
                <Button onClick={(s) => {this.openSettings('FreeText')}}>Free Text</Button>
              </ListItem>
              <ListItem>
                <Button onClick={(s) => {this.openSettings('HidContactsWidget')}}>Contacts from HID</Button>
              </ListItem>
              <ListItem>
                <Button onClick={(s) => {this.openSettings('ReliefwebDynamicContent')}}>Dynamic Content from Reliefweb</Button>
              </ListItem>
              <ListItem>
                <Button onClick={(s) => {this.openSettings('ReliefwebStaticContent')}}>Static Content from Reliefweb</Button>
              </ListItem>
              <ListItem>
                <Button onClick={(s) => {this.openSettings('StaticMenu')}}>Static Menu</Button>
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
          title=''
          {...this.state.addWidgetOptions.widgetSettings}
        />
        <OchaProductsSettings
          open={this.state.isSettingsOpen['OchaProducts']}
          handleClose={() => { this.closeSettings('OchaProducts') }}
          handleSubmit={this.handleWidgetSelection}
          addWidgetSetting={this.addWidgetSetting}
          title=''
          {...this.state.addWidgetOptions.widgetSettings}
        />
        <StaticContentSettings
          open={this.state.isSettingsOpen['StaticContent']}
          handleClose={() => { this.closeSettings('StaticContent') }}
          handleSubmit={this.handleWidgetSelection}
          addWidgetSetting={this.addWidgetSetting}
          title=''
          {...this.state.addWidgetOptions.widgetSettings}
        />
        <FreeTextSettings
          open={this.state.isSettingsOpen['FreeText']}
          handleClose={() => { this.closeSettings('FreeText') }}
          handleSubmit={this.handleWidgetSelection}
          addWidgetSetting={this.addWidgetSetting}
          title=''
          {...this.state.addWidgetOptions.widgetSettings}
        />
        <HidContactsWidgetSettings
          open={this.state.isSettingsOpen['HidContactsWidget']}
          handleClose={() => { this.closeSettings('HidContactsWidget') }}
          handleSubmit={this.handleWidgetSelection}
          addWidgetSetting={this.addWidgetSetting}
          title=''
          {...this.state.addWidgetOptions.widgetSettings}
        />
        <ReliefwebDynamicContentSettings
          open={this.state.isSettingsOpen['ReliefwebDynamicContent']}
          handleClose={() => { this.closeSettings('ReliefwebDynamicContent') }}
          handleSubmit={this.handleWidgetSelection}
          addWidgetSetting={this.addWidgetSetting}
          title=''
          {...this.state.addWidgetOptions.widgetSettings}
        />
        <ReliefwebStaticContentSettings
          open={this.state.isSettingsOpen['ReliefwebStaticContent']}
          handleClose={() => { this.closeSettings('ReliefwebStaticContent') }}
          handleSubmit={this.handleWidgetSelection}
          addWidgetSetting={this.addWidgetSetting}
          title=''
          {...this.state.addWidgetOptions.widgetSettings}
        />
        <StaticMenuSettings
          open={this.state.isSettingsOpen['StaticMenu']}
          handleClose={() => { this.closeSettings('StaticMenu') }}
          handleSubmit={this.handleWidgetSelection}
          addWidgetSetting={this.addWidgetSetting}
          title=''
          {...this.state.addWidgetOptions.widgetSettings}
        />
      </div>
    );
  }
}

export default SelectWidget;