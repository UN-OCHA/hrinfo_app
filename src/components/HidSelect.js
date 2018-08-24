import React from 'react';
import MaterialSelect from '../components/MaterialSelect';
import HidAPI from '../api/HidAPI';

class HidSelect extends React.Component {
  state = {
    items: []
  };

  hidAPI = new HidAPI();

  getOptions = (type) => {
    let params = {};
    params.sort = 'label';
    params.offset = 0;
    params.limit = 50;
    params.sort = 'label';
    params.type = type;
    return this.hidAPI
      .get('list', params)
      .then(data => {
        this.setState({
          items: data.data
        });
      })
      .catch(function(err) {
        console.log("Fetch error: ", err);
      });
  };

  componentDidMount() {
    this.getOptions(this.props.type);
  }

  render() {
    return (
        <MaterialSelect
          isMulti={this.props.isMulti}
          id={this.props.type}
          name={this.props.type}
          onChange={this.props.onChange}
          options={this.state.items}
          value={this.props.value} />
    );
  }
}

export default HidSelect;
