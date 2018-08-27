import React from 'react';
import MaterialAsyncSelect from '../components/MaterialAsyncSelect';
import HidAPI from '../api/HidAPI';

class HidAsyncSelect extends React.Component {

  hidAPI = new HidAPI();

  getOptions = (input) => {
    let params = {};
    params.offset = 0;
    params.limit = 50;
    params.sort = 'label';
    params.type = this.props.type;
    params.name = input;
    return this.hidAPI
      .get('list', params)
      .then(data => {
        return data.data;
      })
      .catch(function(err) {
        console.log("Fetch error: ", err);
      });
  };

  render() {
    return (
      <MaterialAsyncSelect
        isMulti={this.props.isMulti}
        loadOptions={this.getOptions}
        onChange={this.props.onChange}
        value={this.props.value}
        className={this.props.className}
        getOptionValue={(option) => {return option._id}}
        getOptionLabel={(option) => {return option.name}}
        />
    );
  }
}

export default HidAsyncSelect;
