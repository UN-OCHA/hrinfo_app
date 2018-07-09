import React from 'react';
import AsyncSelect from 'react-select/lib/Async';
import HidAPI from './HidAPI';

class HidContacts extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      contacts: [],
      status: 'initial'
    };
    this.hidAPI = new HidAPI();
    this.handleChange = this.handleChange.bind(this);
    this.getOptions = this.getOptions.bind(this);
  }

  getOptions (input) {
    let params = {};
    params.limit = 10;
    params.offset = 0;
    params.sort = 'name';
    params.q = input;
    return this.hidAPI
      .get('user', params);
  }

  handleChange (selectedOption) {
    let out = [];
    selectedOption.forEach(function (option) {
      out.push(option.id);
    });
    this.setState({
      contacts: selectedOption
    });
    if (this.props.onChange) {
      this.props.onChange(out);
    }
  }

  async componentDidUpdate (prevProps, prevState, snapshot) {
    const that = this;
    if (this.state.status === 'initial') {
      if (this.props.value) {
        let promises = [];
        this.props.value.forEach(function (v) {
          promises.push(that.hidAPI.getItem('user', v));
        });
        let out = await Promise.all(promises);
        this.setState({
          contacts: out,
          status: 'loaded'
        });
      }
      else {
        this.setState({
          status: 'loaded'
        });
      }
    }
  }

  render() {
    return (
      <AsyncSelect
        isMulti
        loadOptions={this.getOptions}
        getOptionValue={(option) => { return option.id }}
        getOptionLabel={(option) => { return option.name}}
        onChange={this.handleChange}
        value={this.state.contacts}
        className={this.props.className}
        />
    );
  }
}

export default HidContacts;
