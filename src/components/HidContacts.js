import React from 'react';

import MaterialAsyncSelect from '../components/MaterialAsyncSelect';
import HidAPI from '../api/HidAPI';

class HidContacts extends React.Component {
  state = {
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
    if (this.props.onChange) {
      this.props.onChange(selectedOption);
    }
  };

  componentDidUpdate (prevProps, prevState, snapshot) {
    const that = this;
    if (this.props.value && this.props.isMulti) {
      let promises = [];
      this.props.value.forEach(function (v) {
        if (typeof v === 'string') {
          promises.push(that.hidAPI.getItem('user', v));
        }
      });
      if (promises.length) {
        this._asyncRequest = Promise.all(promises).then((values) => {
          this._asyncRequest = null;
          this.handleChange(values);
        });
      }
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (JSON.stringify(this.props.value) !== JSON.stringify(nextProps.value)) {
      return true;
    }
    return false;
  }

  render() {
    return (
      <MaterialAsyncSelect
        isMulti={this.props.isMulti}
        loadOptions={this.getOptions}
        value={this.props.value}
        className={this.props.className}
        onChange={this.handleChange}
        getOptionLabel={(option) => {return option.name}}
        getOptionValue={(option) => {return option.id}}
        />
    );
  }
}

export default HidContacts;
