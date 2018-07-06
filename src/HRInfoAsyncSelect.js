import React from 'react';
import AsyncSelect from 'react-select/lib/Async';
import HRInfoAPI from './HRInfoAPI';

class HRInfoAsyncSelect extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      items: []
    };
    this.hrinfoAPI = new HRInfoAPI(this.props.token);
    this.handleChange = this.handleChange.bind(this);
    this.getOptions = this.getOptions.bind(this);
  }

  getOptions (input) {
    const type = this.props.type;
    let params = {};
    params.search = input;
    params.fields = 'id,label,acronym';
    params.sort = 'label';
    params.range = 10;
    return this.hrinfoAPI
      .get(type, params)
      .then(data => {
        if (type === 'organizations') {
          let fullLabels = [];
          data.data.forEach(function (org) {
            if (org.acronym) {
              org.label = org.label + ' (' + org.acronym + ')';
            }
            fullLabels.push(org);
          });
          return fullLabels;
        }
        else {
          return data.data;
        }
      }).catch(function(err) {
          console.log("Fetch error: ", err);
      });
  }

  handleChange (selectedOption) {
    if (this.props.onChange) {
      this.props.onChange(selectedOption);
    }
  }

  render() {
    return (
      <AsyncSelect
        isMulti
        loadOptions={this.getOptions}
        getOptionValue={(option) => { return option.id }}
        getOptionLabel={(option) => { return option.label}}
        onChange={this.handleChange}
        value={this.props.value}
        className={this.props.className}
        />
    );
  }
}

export default HRInfoAsyncSelect;
