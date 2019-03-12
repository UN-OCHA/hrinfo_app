import React from 'react';
import lodash from 'lodash';
import Dashboard, { addWidget } from 'react-dazzle';

import withSpace from '../utils/withSpace';
import SelectWidget from '../components/SelectWidget';

import FTSApi from '../api/FTSApi';
import HidApi from '../api/HidAPI';
import HdxAPI from '../api/HdxAPI';

import {DynamicContent} from '../widgets/DynamicContent';
import {ReliefwebDynamicContent} from '../widgets/ReliefwebDynamicContent';
import {FTSWidget} from '../widgets/FTS';
import {HidNumberOfContacts} from '../widgets/HidNumberOfContacts';
import {HdxNumberOfDatasets} from '../widgets/HdxNumberOfDatasets';
import {DigitalSitrepHighlights} from '../widgets/DigitalSitrepHighlights';
import {DigitalSitrepFigures} from '../widgets/DigitalSitrepFigures';

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
  hdxApi = new HdxAPI();

  state = {
    status: 'initial',
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
          content: {value: 'reports', label: 'Reports'},
          number: '5'
        }
      },
      ReliefwebJobs: {
        title: "Reliefweb Jobs",
        type: ReliefwebDynamicContent,
        props: {
          content: {value: 'jobs', label: 'Jobs'},
          number: '5'
        }
      },
      ReliefwebTrainings: {
        title: 'Reliefweb Trainings',
        type: ReliefwebDynamicContent,
        props: {
          content: {value: 'training', label: 'Trainings'},
          number: '5'
        },
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
        },
      },
      HdxNumber: {
        title: 'Datasets in HDX',
        type: HdxNumberOfDatasets,
        props: { }
      },
      DigitalSitrepHighlights: {
        title: 'Highlights from the Digital Situation Report',
        type: DigitalSitrepHighlights,
        props: { }
      },
      DigitalSitrepFigures: {
        title: 'Key Figures from the Digital Situation Report',
        type: DigitalSitrepFigures,
        props: { }
      }
    },
    layout: this.layout,
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

  /**
   * Closes a widget without setting layout
   */
  onWidgetClose = () => {
    this.setState({
      editedWidget: null
    });
  }

  async componentDidUpdate() {
    if (this.props.doc && this.props.doc.type === 'operation' && this.state.status === 'initial') {
      const doc = this.props.doc;
      let widgets = lodash.cloneDeep(this.state.widgets);
      let layout = lodash.cloneDeep(this.state.layout);

      widgets.DigitalSitrepHighlights.props.slug = this.props.doc.label.toLowerCase();
      layout.rows[0].columns[0].widgets = [{key: 'DigitalSitrepHighlights'}];

      const space = {id: this.props.doc.id, type: this.props.doc.type + 's', label: this.props.doc.label, value: this.props.label};
      widgets.LatestDocuments.props.space = space;
      widgets.LatestInfographics.props.space = space;
      widgets.UpcomingEvents.props.space = space;
      widgets.LatestAssessments.props.space = space;
      widgets.ReliefwebUpdates.props.country = { value: this.props.doc.label };
      widgets.ReliefwebTrainings.props.country = { value: this.props.doc.label };
      layout.rows[0].columns[1].widgets = [{key: 'LatestDocuments'},
        {key: 'LatestInfographics'},
        {key: 'UpcomingEvents'},
        {key: 'LatestAssessments'},
        {key: 'ReliefwebUpdates'},
        {key: 'ReliefwebTrainings'}
      ];

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
      widgets.DigitalSitrepFigures.props.slug = this.props.doc.label.toLowerCase();
      layout.rows[0].columns[2].widgets.push({key: 'DigitalSitrepFigures'});
      const lists = await this.hidApi.get('list', {type: 'operation', remote_id: doc.id});
      if (lists.data.length) {
        widgets.HidNumber.props.list = lists.data[0];
        widgets.HidNumber.props.doc = doc;
        layout.rows[0].columns[2].widgets.push({key: 'HidNumber'});
      }

      const datasets = await this.hdxApi.get({ q: 'groups:' + doc.country.iso3.toLowerCase(), rows: 0});
      if (datasets.count) {
        widgets.HdxNumber.props.result = datasets;
        widgets.HdxNumber.props.doc = doc;
        layout.rows[0].columns[2].widgets.push({key: 'HdxNumber'});
      }

      widgets.ReliefwebJobs.props.country = { value: this.props.doc.label };
      layout.rows[0].columns[2].widgets.push({key: 'ReliefwebJobs'});
      this.setState({
        widgets: widgets,
        layout: layout,
        status: 'ready'
      });
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (JSON.stringify(this.props) !== JSON.stringify(nextProps) || JSON.stringify(this.state) !== JSON.stringify(nextState)) {
      return true;
    }
    return false;
  }

  render() {

    if (this.props.doc) {
      return (
        <React.Fragment>
          <div className="container">
            <Dashboard
              frameComponent={CustomFrame}
              widgets={this.state.widgets}
              layout={this.state.layout}
              editable={this.props.isEditable}
              onAdd={this.onAdd}
              onRemove={this.onRemove}
              onMove={this.onMove}
              onEdit={this.onEdit}
              className='container' />
          </div>
          {this.props.isEditable ?
            <SelectWidget
              layout={this.state.tempLayout}
              rowIndex={this.state.rowIndex}
              columnIndex={this.state.columnIndex}
              isModalOpen={this.state.isModalOpen}
              onRequestClose={this.handleClose}
              onWidgetSelect={this.handleWidgetSelection}
              editedWidget={this.state.editedWidget}
              onWidgetClose={this.onWidgetClose} /> : ''}
      </React.Fragment>);
    }
    else {
      return '';
    }
  }
}

export default withSpace(SpacePage, {});
