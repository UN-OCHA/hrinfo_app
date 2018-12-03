import React from 'react';
import { translate } from 'react-i18next';
import lodash from 'lodash';
import HRInfoLocation from './HRInfoLocation';
import HRInfoAPI from '../api/HRInfoAPI';

import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardActions from "@material-ui/core/CardActions/CardActions";
import IconButton from "@material-ui/core/IconButton/IconButton";

class HRInfoLocations extends React.Component {

  state = {
    locations: [[]],
    inputNumber: 1,
    status: 'initial'
  };
  hrinfoAPI = new HRInfoAPI();

  getRow = (number) => {
    const locations1 = this.state.locations[number][0] ? (
      <HRInfoLocation level="1" parent={this.state.locations[number][0].id} row={number} onChange={this.handleChange} value={this.state.locations[number][1]}/>
    ) : '';

    const locations2 = this.state.locations[number][1] ? (
      <HRInfoLocation level="2" parent={this.state.locations[number][1].id} row={number} onChange={this.handleChange} value={this.state.locations[number][2]}/>
    ) : '';

    const locations3 = this.state.locations[number][2] ? (
      <HRInfoLocation level="3" parent={this.state.locations[number][2].id} row={number} onChange={this.handleChange} value={this.state.locations[number][3]}/>
    ) : '';

    return (
      <Card key={number} className="card-container">
        <CardContent>
          <HRInfoLocation level="0" onChange={this.handleChange} row={number} value={this.state.locations[number][0]}/>
          {locations1}
          {locations2}
          {locations3}
        </CardContent>
        <CardActions>
          {this.state.inputNumber > 1 ?
            <IconButton color="primary" onClick={(e) => this.removeLocation(number)}>
              <i className="icon-trash" />
            </IconButton>
            : ''}
        </CardActions>
      </Card>
    );
  };

  handleChange = (row, level, selected) => {
    let state = {};
    state['locations'] = lodash.cloneDeep(this.state.locations);
    for (let i = Number(level); i < 4; i++) {
      state["locations"][row][i] = '';
    }
    if (selected && selected.id) {
      state["locations"][row][level] = selected;
    }
    state['status'] = 'ready';
    this.setState(state);
    if (this.props.onChange !== undefined) {
      this.props.onChange(state['locations']);
    }
  };

  removeLocation = (number) => {
    this.setState((prevState, props) => {
      prevState.locations.splice(number, 1);
      return {
        locations: prevState.locations,
        inputNumber: prevState.inputNumber - 1
      }
    });
  };

  onAddBtnClick = (event) => {
    let locations = lodash.cloneDeep(this.state.locations);
    for (let i = 0; i < this.state.inputNumber + 1; i++) {
      if (!locations[i]) {
        locations[i] = [];
      }
    }
    this.setState({
      inputNumber: this.state.inputNumber + 1,
      locations: locations,
      status: 'ready'
    });
  };

  getInitialLocation = (loc) => {
    const that = this;
    return this.hrinfoAPI
      .getItem('locations', loc.id)
      .then(function (data) {
        let promises = [];
        data.parents.forEach(function (parent) {
          // We're getting the id from the url stored in the parent array
          promises.push(that.hrinfoAPI.getItem('locations', parent.split("/", 8)[7]));
        });
        return Promise.all(promises);
      });
  };

  getInitialLocations = () => {
    const that = this;
    let locations = [];
    if (this.props.isMulti) {
      let allPromises = [];
      let inputNumber = 0;
      this.props.value.forEach(function (loc, index) {
        inputNumber++;
        allPromises.push(that
          .getInitialLocation(loc)
          .then(function (values) {
            locations.push(values.reverse());
          }));
      });
      Promise.all(allPromises)
        .then(function () {
          if (inputNumber === 0) {
            inputNumber = 1;
            locations = [{}];
          }
          that.setState({
            status: 'ready',
            locations: locations,
            inputNumber: inputNumber
          });
          if (that.props.onChange) {
            that.props.onChange(locations);
          }
        });
    }
    else {
      this.getInitialLocation(this.props.value)
        .then(function (values) {
          locations.push(values.reverse());
          that.setState({
            status: 'ready',
            locations: locations
          });
          if (that.props.onChange) {
            that.props.onChange(locations);
          }
        });
    }
  };

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.props.value && this.state.status === 'initial') {
      this.getInitialLocations();
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (JSON.stringify(nextProps.value) !== JSON.stringify(this.props.value) ||
      JSON.stringify(this.state.locations) !== JSON.stringify(nextState.locations) ||
      this.state.inputNumber !== nextState.inputNumber) {
      return true;
    }
    return false;
  }

  render () {
    const { t } = this.props;
    let rows = [];
    for (let i = 0; i < this.state.inputNumber; i++) {
      rows.push(this.getRow(i));
    }
    return (
      <div>
        {rows}
        {this.props.isMulti ?
          <Button variant="outlined" onClick={this.onAddBtnClick}>
            <i className="icon-map-pin" /> &nbsp; {t('add_another')}
          </Button> : '' }
      </div>
    );
  }
}

export default translate('forms')(HRInfoLocations);
