import React from 'react';
import PropTypes from 'prop-types';
import Dashboard, { addWidget } from 'react-dazzle';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Modal from '@material-ui/core/Modal';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Button from '@material-ui/core/Button';

import {OchaProducts, OchaProductsSettings} from '../widgets/OchaProducts';
import {DynamicContent, DynamicContentSettings } from '../widgets/DynamicContent';
import withSpace from '../utils/withSpace';

import 'react-dazzle/lib/style/style.css';

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
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
    isSettingsOpen: {},
    addWidgetOptions: null
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
      isSettingsOpen: false,
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
        <Modal
          aria-labelledby="simple-modal-title"
          aria-describedby="simple-modal-description"
          open={this.state.isModalOpen}
          onClose={this.handleClose}
        >
          <div style={getModalStyle()} className={classes.paper}>
            <Typography variant="title" id="modal-title">
              Add a widget
            </Typography>
            <Typography variant="subheading" id="simple-modal-description">
              <List>
                <ListItem>
                  <Button onClick={(s) => {this.openSettings('OchaProducts')}}>Ocha Products</Button>
                </ListItem>
                <ListItem>
                  <Button onClick={(s) => {this.openSettings('DynamicContent')}}>Dynamic Content</Button>
                </ListItem>
              </List>
            </Typography>
          </div>
        </Modal>
        <DynamicContentSettings
          open={this.state.isSettingsOpen['DynamicContent']}
          handleClose={() => {this.closeSettings('DynamicContent')}}
          handleSubmit={this.handleWidgetSelection}
          addWidgetSetting={this.addWidgetSetting}
          style={getModalStyle()}
        />
        <OchaProductsSettings
          open={this.state.isSettingsOpen['OchaProducts']}
          handleClose={() => { this.closeSettings('OchaProducts') }}
          handleSubmit={this.handleWidgetSelection}
          addWidgetSetting={this.addWidgetSetting}
          style={getModalStyle()}
        />
    </div>);
  }
}

SpacePage.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withSpace(withStyles(styles)(SpacePage), {});
