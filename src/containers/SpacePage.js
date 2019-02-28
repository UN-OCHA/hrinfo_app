import React from 'react';
import lodash from 'lodash';
import PropTypes from 'prop-types';
import Dashboard, { addWidget } from 'react-dazzle';
import {Link} from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';

import withSpace from '../utils/withSpace';
import SelectWidget from '../components/SelectWidget';

import FTSApi from '../api/FTSApi';
import HidApi from '../api/HidAPI';

import {DynamicContent} from '../widgets/DynamicContent';
import {ReliefwebDynamicContent} from '../widgets/ReliefwebDynamicContent';
import {FTSWidget} from '../widgets/FTS';
import {HidNumberOfContacts} from '../widgets/HidNumberOfContacts';

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

  layout = {
    rows: [{
      columns: [{
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
  };

  ftsApi = new FTSApi();
  hidApi = new HidApi();

  state = {
    widgets: {
      LatestDocuments: {
        title: "Latest Documents",
        type: DynamicContent,
        props: {
          content: {value: 'documents', label: 'Documents'},
          number: '5',
        }
      },
      LatestInfographics: {
        title: "Latest Infographics",
        type: DynamicContent,
        props: {
          content: {value: 'infographics', label: 'Infographics'},
          number: '5'
        }
      },
      UpcomingEvents: {
        title: "Upcoming Events",
        type: DynamicContent,
        props: {
          content: {value: 'events', label: 'Events'},
          number: '5'
        }
      },
      LatestAssessments: {
        title: "Latest Assessments",
        type: DynamicContent,
        props: {
          content: {value: 'assessments', label: 'Assessments'},
          number: '5'
        }
      },
      ReliefwebUpdates: {
        title: "Reliefweb Updates",
        type: ReliefwebDynamicContent,
        props: {
          number: '5'
        }
      },
      FTSFunding: {
        title: 'Funding from FTS',
        type: FTSWidget,
        props: {
          type: {id: 'pie', label: 'Pie'}
        }
      },
      HidNumber: {
        title: 'Contacts in HID',
        type: HidNumberOfContacts,
        props: {
          list: { count: 256 }
        },
      }
    },
    layout: this.layout,
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
    console.log(widgets);
    this.setState({
      widgets: widgets,
      editedWidget: null
    }, () => {
      that.setState({
        layout: addWidget(this.state.tempLayout, this.state.rowIndex, this.state.columnIndex, name)
      });
    });
  }

  /**
   * Closes a widget without setting layout
   */
  onWidgetClose = () => {
    this.setState({
      editedWidget: null
    });
  }

  async componentDidUpdate() {
    if (this.props.doc) {
      const doc = this.props.doc;
      let widgets = lodash.cloneDeep(this.state.widgets);
      let layout = lodash.cloneDeep(this.state.layout);

      const space = {id: this.props.doc.id, type: this.props.doc.type + 's', label: this.props.doc.label, value: this.props.label};
      widgets.LatestDocuments.props.space = space;
      widgets.LatestInfographics.props.space = space;
      widgets.UpcomingEvents.props.space = space;
      widgets.LatestAssessments.props.space = space;
      widgets.ReliefwebUpdates.props.country = { value: this.props.doc.label };
      layout.rows[0].columns[1].widgets = [{key: 'LatestDocuments'}, {key: 'LatestInfographics'}, {key: 'UpcomingEvents'}, {key: 'LatestAssessments'}, {key: 'ReliefwebUpdates'}];

      const appeals = await this.ftsApi.getAppeals(2018);
      let currentAppeal = {};
      appeals.data.forEach(function (appeal) {
        if (appeal.locations[0].iso3 === doc.country.iso3) {
          currentAppeal = appeal;
        }
      });
      if (currentAppeal) {
        widgets.FTSFunding.props.appeal = currentAppeal;
        layout.rows[0].columns[2].widgets = [{key: 'FTSFunding'}];
      }
      const lists = await this.hidApi.get('list', {type: 'operation', remote_id: doc.id});
      if (lists.data.length) {
        widgets.HidNumber.props.list = lists.data[0];
        layout.rows[0].columns[2].widgets.push({key: 'HidNumber'});
      }
      this.setState({widgets: widgets, layout: layout});
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (JSON.stringify(this.props) !== JSON.stringify(nextProps) || JSON.stringify(this.state) !== JSON.stringify(nextState)) {
      return true;
    }
    return false;
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
              editedWidget={this.state.editedWidget}
              onWidgetClose={this.onWidgetClose} /> : ''}
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
