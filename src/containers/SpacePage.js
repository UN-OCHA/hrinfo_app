import React from 'react';
import Dashboard, { addWidget } from 'react-dazzle';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Button from '@material-ui/core/Button';

import {OchaProducts, OchaProductsSettings} from '../widgets/OchaProducts';
import {DynamicContent, DynamicContentSettings } from '../widgets/DynamicContent';
import withSpace from '../utils/withSpace';

import 'react-dazzle/lib/style/style.css';

class SpacePage extends React.Component {

  state = {
    widgetTypes: {
      'DynamicContent': DynamicContent,
      'OchaProducts': OchaProducts
    },
    widgets: {
    },
    layout: {
      rows: [{
        columns: [{
          className: 'col-md-12',
          widgets: [],
        }],
      }],
    },
    isModalOpen: false,
    isSettingsOpen: {
      DynamicContent: false,
      OchaProducts: false
    },
    addWidgetOptions: {
      widgetSettings: {}
    }
  };

  /**
   * When a widget is removed, the layout should be set again.
   */
  onRemove = (layout) => {
    this.setState({
      layout: layout,
    });
  }

  /**
   * When a widget moved, this will be called. Layout should be given back.
   */
  onMove = (layout) => {
    this.setState({
      layout: layout,
    });
  }

  onAdd = (layout, rowIndex, columnIndex) => {
    this.setState({
      isModalOpen: true,
      addWidgetOptions: {
        layout,
        rowIndex,
        columnIndex
      }
    });
  };

  handleClose = ()  => {
    this.setState({
      isModalOpen: false
    });
  };

  /**
   * When user selects a widget from the modal dialog, this will be called.
   * By calling the 'addWidget' method, the widget could be added to the previous requested location.
   */
  handleWidgetSelection = () => {
    const {layout, rowIndex, columnIndex, widgetName, widgetSettings} = this.state.addWidgetOptions;
    const that = this;
    const randomName = widgetName + '-' + Math.random().toString(36).substring(7);
    const WidgetType = widgetName;

    let widgets = this.state.widgets;
    widgets[randomName] = {
      type: this.state.widgetTypes[widgetName],
      title: widgetSettings.title ? widgetSettings.title : '',
      props: widgetSettings
    };
    this.setState({
      widgets: widgets,
      isSettingsOpen: {
        OchaProducts: false,
        DynamicContent: false
      },
      isModalOpen: false
    }, () => {
      that.setState({
        layout: addWidget(layout, rowIndex, columnIndex, randomName)
      });
    });
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
    this.setState({
      isModalOpen: false,
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
    const { classes } = this.props;

    return (
      <div>
        <Dashboard
          widgets={this.state.widgets}
          layout={this.state.layout}
          editable={true}
          onAdd={this.onAdd}
          onRemove={this.onRemove}
          onMove={this.onMove} />
        <Dialog
          fullScreen
          open={this.state.isModalOpen}
          onClose={this.handleClose}
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
            </List>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleClose} color="primary">
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
    </div>);
  }
}

export default withSpace(SpacePage, {});
