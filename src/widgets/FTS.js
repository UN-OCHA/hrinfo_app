import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import C3Chart from 'react-c3js';
import 'c3/c3.css';
import lodash from 'lodash';

import MaterialSelect from '../components/MaterialSelect';
import FTSApi from '../api/FTSApi';

class FTSWidget extends React.Component {

  state = {
    flowData: {}
  };

  ftsApi = new FTSApi();

  getFundingFromFlow = (data) => {
    let out = [], names = [], fundings = [], unmets = [];
    if (data.report3 && data.requirements) {
      //out.current_requirements = data.report1.fundingTotals.total;
      //out.funding = data.report1.pledgeTotals.total + data.report1.fundingTotals.total;
      names.push('x');
      fundings.push('funded');
      unmets.push('unmet');
      if (data.report3.fundingTotals.objects.length && data.report3.fundingTotals.objects[0].singleFundingObjects) {
        const fundingObjects = data.report3.fundingTotals.objects[0].singleFundingObjects;
        for (let i = 0; i < fundingObjects.length; i++) {
          if (fundingObjects[i].name !== 'Not specified') {
            names.push(fundingObjects[i].name);
            fundings.push(fundingObjects[i].totalFunding);
          }
        }
      }
      if (data.requirements) {
        const requirements = data.requirements.objects;
        for (let i = 0; i < requirements.length; i++) {
          let index = 0;
          for (let j = 0; j < names.length; j++) {
            if (names[j] === requirements[i].name) {
              index = j;
            }
          }
          unmets[index] = requirements[i].revisedRequirements - fundings[index];
        }
      }
      if (this.props.cluster) {
        let index = 0;
        for (let i = 0; i < names.length; i++) {
          if (this.props.cluster.name === names[i]) {
            index = i;
          }
        }
        out.push(['funded', fundings[index]]);
        out.push(['unmet', unmets[index]]);
      }
      else {
        out = [
          names,
          fundings,
          unmets
        ];
      }
    }
    else {
      out.push(['funded', parseInt(data.incoming.fundingTotal, 10)]);
      out.push(['unmet', parseInt(this.props.appeal.revisedRequirements, 10) - parseInt(data.incoming.fundingTotal, 10)]);
    }
    return out;
  }

  setChartStatus = async () => {
    const params = {};
    params.planId = this.props.appeal.id;
    if (this.props.groupBy) {
      params.groupby = this.props.groupBy.id
    }
    if (this.props.cluster) {
      params.groupby = 'cluster';
    }
    await this
      .ftsApi
      .getFlow(params)
      .then(data => {
        this.setState({
          flowData: data.data,
          chartData: this.getFundingFromFlow(data.data)
        });
      });
  }

  async componentDidMount() {
    await this.setChartStatus();
  }

  async componentDidUpdate(prevProps, prevState, snapshot) {
    if (!lodash.isEqual(prevProps, this.props)) {
      await this.setChartStatus();
    }
  }

  render() {
    const { chartData } = this.state;
    if (chartData) {
      let data = {
        columns: chartData,
        groups: [['funded', 'unmet']],
        type: this.props.type ? this.props.type.id : 'line',
        colors: {
          funded: '#002856',
          unmet: '#FFED1A'
        },
        names: {
          funded: 'Funded',
          unmet: 'Unmet Requirements'
        }
      };
      let axis = {};
      if (this.props.groupBy && this.props.groupBy.id) {
        data.x = 'x';
        axis.x = {
          type: 'category'
        };
        axis.y = {
          tick: {
            values: []
          }
        };
        axis.rotated = true;
      }
      const tooltip = {
        format: {
          value: function (v, r, id) { return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(v); }
        }
      };
      return (
        <div><C3Chart data={data} axis={axis} tooltip={tooltip} /></div>
      );
    }
    else {
      return '';
    }
  }
}

class FTSSettings extends React.Component {

  ftsApi = new FTSApi();

  state = {
    appeals: [],
    types: [
      {id: 'pie', label: 'Pie'},
      {id: 'bar', label: 'Bar'},
      {id: 'donut', label: 'Donut'}
    ],
    clusters: [],
    groupBy: [
      {id: 'organization', label: 'Organization'},
      {id: 'cluster', label: 'Cluster'}
    ]
  };

  componentDidMount () {
    let appeals = [];
    this
      .ftsApi
      .getAppeals(2018)
      .then (data => {
        appeals = data.data;
        this.setState({
          appeals: appeals
        });
      });
  }

  setAppeal = (s) => {
    const params = {
      planId: s.id,
      groupBy: 'cluster'
    };
    this
      .ftsApi
      .getFlow(params)
      .then(data => {
        this.setState({
          clusters: data.data.requirements.objects
        });
      });
    this.props.addWidgetSetting('appeal', s);
  };

  render () {

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
            <FormControl required fullWidth margin = "normal">
              <FormLabel>Appeal</FormLabel>
              <MaterialSelect
                id       = "appeal"
                value    = {this.props.appeal}
                options  = {this.state.appeals}
                getOptionLabel = {(option) => { return option.name }}
                onChange = {this.setAppeal}/>
            </FormControl>
            <FormControl required fullWidth margin = "normal">
              <FormLabel>Type</FormLabel>
              <MaterialSelect
                id       = "type"
                value    = {this.props.type}
                options  = {this.state.types}
                onChange = {(s) => {this.props.addWidgetSetting('type', s)}}/>
            </FormControl>
            <FormControl required fullWidth margin = "normal">
              <FormLabel>Cluster</FormLabel>
              <MaterialSelect
                id       = "cluster"
                value    = {this.props.cluster}
                options  = {this.state.clusters}
                getOptionLabel = {(option) => { return option.name }}
                onChange = {(s) => {this.props.addWidgetSetting('cluster', s)}}/>
            </FormControl>
            <FormControl required fullWidth margin = "normal">
              <FormLabel>Group By</FormLabel>
              <MaterialSelect
                id       = "groupBy"
                value    = {this.props.groupBy}
                options  = {this.state.groupBy}
                onChange = {(s) => {this.props.addWidgetSetting('groupBy', s)}}/>
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.props.handleClose} color="primary">
              Cancel
            </Button>
            <Button onClick={(evt) => {this.props.handleSubmit()}} color="primary">
              Save
            </Button>
          </DialogActions>
      </Dialog>
    );
  }
}


export {FTSSettings, FTSWidget};
