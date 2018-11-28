import React from 'react';

import MaterialAsyncSelect from '../components/MaterialAsyncSelect';
import HidAPI from '../api/HidAPI';

class HidContacts extends React.Component {
  state = {
    contacts: [],
    status: 'initial'
  };

  hidAPI = new HidAPI();

  getOptions = (input) => {
    let params = {};
    params.limit = 10;
    params.offset = 0;
    params.sort = 'name';
    params.q = input;
    return this.hidAPI
      .get('user', params)
      .then(data => {
        return data.data;
      });
  };

  handleChange = (selectedOption) => {
    this.setState({
      contacts: selectedOption
    });
    if (this.props.onChange) {
      this.props.onChange(selectedOption);
    }
  };

  componentDidUpdate (prevProps, prevState, snapshot) {
    const that = this;
    if (this.state.status === 'initial') {
      if (this.props.value) {
        if (this.props.isMulti) {
          let promises = [];
          this.props.value.forEach(function (v) {
            promises.push(that.hidAPI.getItem('user', v));
          });
          this._asyncRequest = Promise.all(promises).then((values) => {
            this._asyncRequest = null;
            this.setState({
              contacts: values,
              status: 'loaded'
            });
          });
        }
        else {
          this.setState({
            contacts: that.props.value,
            status: 'loaded'
          });
        }
      }
      else {
        this.setState({
          status: 'loaded'
        });
      }
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    console.log('should component update');
    console.log(JSON.stringify(this.state.contacts));
    console.log(nextState.contacts);
    if (JSON.stringify(this.state.contacts) !== JSON.stringify(nextState.contacts)) {
      return true;
    }
    return false;
  }

  render() {
    console.log('re rendering hid contacts');
    return (
      <MaterialAsyncSelect
        isMulti={this.props.isMulti}
        loadOptions={this.getOptions}
        value={this.state.contacts}
        className={this.props.className}
        onChange={this.handleChange}
        getOptionLabel={(option) => {return option.name}}
        getOptionValue={(option) => {return option.id}}
        />
    );
  }
}

export default HidContacts;
