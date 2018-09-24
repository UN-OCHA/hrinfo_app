import React from 'react';
import PropTypes from 'prop-types';
import Dashboard, { addWidget } from 'react-dazzle';
import {Link} from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';

import withSpace from '../utils/withSpace';
import SelectWidget from '../components/SelectWidget';

import 'react-dazzle/lib/style/style.css';

const CustomFrame = ({title, editable, children, onRemove, onEdit }) => {
  return (
      <div className="defaultWidgetFrame">
        <div className="defaultWidgetFrameHeader">
            <span className="title">{title}</span>
            {editable &&<a className="remove" onClick={() => {onRemove();}} ><i className="icon-trash" /></a>}
            {editable &&<a className="remove" onClick={() => {onEdit();}} ><i className="icon-edit" /></a>}
        </div>
        {children}
    </div>
  );
};

const styles = theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing.unit * 3,
    overflowX: 'auto',
  }
});

class SpacePage extends React.Component {

  state = {
    widgets: {
    },
    layout: {
      rows: [{
        columns: [{
          className: 'layout-sidebar',
          widgets: [],
        }, {
          className: 'layout-header',
          widgets: []
        }, {
          className: 'layout-first-column',
          widgets: []
        }, {
          className: 'layout-second-column',
          widgets: []
        }, {
          className: 'layout-footer',
          widgets: []
        }],
      }]
    },
    isEditable: false,
    isModalOpen: false,
    tempLayout: null,
    rowIndex: null,
    columnIndex: null,
    editedWidget: null,
  };

  /**
   * When a widget is removed, the layout should be set again.
   */
  onRemove = (layout) => {
    this.setState({
      layout: layout,
    });
  }

  onEdit = (widgetKey) => {
    const editedWidget = {
      widget: this.state.widgets[widgetKey],
      key: widgetKey
    };
    this.setState({
      editedWidget: editedWidget
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
      tempLayout: layout,
      rowIndex: rowIndex,
      columnIndex: columnIndex,
      editedWidget: null
    });
  }

  handleClose = ()  => {
    this.setState({
      isModalOpen: false
    });
  }

  setEditable = () => {
    const editable = this.state.isEditable;
    this.setState({
      isEditable: !editable
    });
  }

  /**
   * When user selects a widget from the modal dialog, this will be called.
   * By calling the 'addWidget' method, the widget could be added to the previous requested location.
   */
  handleWidgetSelection = (name, widget) => {
    const that = this;

    let widgets = this.state.widgets;
    widgets[name] = widget;
    this.setState({
      widgets: widgets,
      editedWidget: null
    }, () => {
      that.setState({
        layout: addWidget(this.state.tempLayout, this.state.rowIndex, this.state.columnIndex, name)
      });
    });
  }

  render() {
    const {classes} = this.props;

    if (this.props.doc) {
      return (
        <Paper className={classes.root}>
          <Typography align = "right">
            {this.props.hasPermission('edit', this.props.doc) ?
              <Button component={Link} to={'/' + this.props.doc.type + 's/' + this.props.doc.id + '/edit'}><i className="icon-edit" /></Button> : ''}
            {this.props.hasPermission('customize', this.props.doc) ?
              <Button onClick={this.setEditable}><i className="icon-eye" /></Button> : '' }
            {this.props.hasPermission('customize', this.props.doc) && (this.props.doc.type === 'operation' || this.props.doc.type === 'group') ?
              <Button component={Link} to={'/' + this.props.doc.type + 's/' + this.props.doc.id + '/manage'}><i className="icon-wheel" /></Button> : '' }
          </Typography>
          <div className="container">
            <Dashboard
              frameComponent={CustomFrame}
              widgets={this.state.widgets}
              layout={this.state.layout}
              editable={this.state.isEditable}
              onAdd={this.onAdd}
              onRemove={this.onRemove}
              onMove={this.onMove}
              onEdit={this.onEdit}
              className='container' />
          </div>
          {this.state.isEditable ?
            <SelectWidget
              layout={this.state.tempLayout}
              rowIndex={this.state.rowIndex}
              columnIndex={this.state.columnIndex}
              isModalOpen={this.state.isModalOpen}
              onRequestClose={this.handleClose}
              onWidgetSelect={this.handleWidgetSelection}
              editedWidget={this.state.editedWidget} /> : ''}
      </Paper>);
    }
    else {
      return '';
    }
  }
}

SpacePage.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withSpace(withStyles(styles)(SpacePage), {});
