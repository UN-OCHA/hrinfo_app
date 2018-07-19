import React from 'react';
import HRInfoLocation from './HRInfoLocation';
import HRInfoAPI from './HRInfoAPI';

import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';

class HRInfoLocations extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      locations: [[]],
      inputNumber: 1,
      status: 'initial'
    };
    this.hrinfoAPI = new HRInfoAPI();
    this.getRow = this.getRow.bind(this);
    this.onAddBtnClick = this.onAddBtnClick.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.getInitialLocations = this.getInitialLocations.bind(this);
    this.getInitialLocation = this.getInitialLocation.bind(this);
  }

  getRow (number) {
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
		</Card>
    );
  }

  handleChange (row, level, selected) {
    let state = {};
    state['locations'] = this.state.locations;
    for (let i = Number(level); i < 4; i++) {
      state["locations"][row][i] = '';
    }
    if (selected && selected.id) {
      state["locations"][row][level] = selected;
    }
    state['status'] = 'ready';
    this.setState(state);
    if (this.props.onChange) {
      this.props.onChange(state['locations']);
    }
  }

  onAddBtnClick (event) {
    let locations = this.state.locations;
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
  }

  getInitialLocation (loc) {
    const that = this;
    return this.hrinfoAPI
      .getItem('locations', loc.id)
      .then(function (data) {
        let promises = [];
        data.parents.forEach(function (parent) {
          promises.push(that.hrinfoAPI.getItem('locations', parent));
        });
        return Promise.all(promises);
      });
  }

  getInitialLocations () {
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
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.props.value && this.state.status === 'initial') {
      this.getInitialLocations();
    }
  }

  render () {
    let rows = [];
    for (let i = 0; i < this.state.inputNumber; i++) {
      rows.push(this.getRow(i));
    }
    return (
      <div>
        {rows}
        {this.props.isMulti ?
		<Button variant="outlined" onClick={this.onAddBtnClick}>
			<i className="icon-map-pin" /> &nbsp; Add another
		</Button> : '' }
      </div>
      );
  }
}

export default HRInfoLocations;
