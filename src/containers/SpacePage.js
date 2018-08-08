import React from 'react';
import Dashboard, { addWidget } from 'react-dazzle';

import {OchaProducts} from '../widgets/OchaProducts';
import {DynamicContent } from '../widgets/DynamicContent';
import {StaticContent} from '../widgets/StaticContent';
import withSpace from '../utils/withSpace';
import SelectWidget from '../components/SelectWidget';

import 'react-dazzle/lib/style/style.css';

class SpacePage extends React.Component {

  state = {
    widgetTypes: {
      'DynamicContent': DynamicContent,
      'OchaProducts': OchaProducts,
      'StaticContent': StaticContent
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
    tempLayout: null,
    rowIndex: null,
    columnIndex: null,
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
      tempLayout: layout,
      rowIndex: rowIndex,
      columnIndex: columnIndex
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
  handleWidgetSelection = (name, widget) => {
    const that = this;

    let widgets = this.state.widgets;
    widgets[name] = widget;
    this.setState({
      widgets: widgets,
    }, () => {
      that.setState({
        layout: addWidget(this.state.tempLayout, this.state.rowIndex, this.state.columnIndex, name)
      });
    });
  }

  render() {

    return (
      <div>
        <Dashboard
          widgets={this.state.widgets}
          layout={this.state.layout}
          editable={true}
          onAdd={this.onAdd}
          onRemove={this.onRemove}
          onMove={this.onMove} />
        <SelectWidget
          layout={this.state.tempLayout}
          rowIndex={this.state.rowIndex}
          columnIndex={this.state.columnIndex}
          isModalOpen={this.state.isModalOpen}
          onRequestClose={this.handleClose}
          onWidgetSelect={this.handleWidgetSelection} />
    </div>);
  }
}

export default withSpace(SpacePage, {});
