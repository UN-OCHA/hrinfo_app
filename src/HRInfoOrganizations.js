import React from 'react';
import AsyncSelect from 'react-select/lib/Async';

class HRInfoOrganizations extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      items: []
    };
    this.getUrl = this.getUrl.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.getOptions = this.getOptions.bind(this);
  }

  getUrl (input) {
    return 'https://www.humanitarianresponse.info/en/api/v1.0/organizations?search=' + input + '&fields=id,label,acronym&sort=label&range=10';
  }

  getOptions (input) {
    return fetch(this.getUrl(input))
        .then(results => {
            return results.json();
        }).then(data => {
          let fullLabels = [];
          data.data.forEach(function (org) {
            if (org.acronym) {
              org.label = org.label + ' (' + org.acronym + ')';
            }
            fullLabels.push(org);
          });
          return fullLabels;
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

export default HRInfoOrganizations;
