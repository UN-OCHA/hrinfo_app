import React from 'react';
import { Async } from 'react-select'

class HRInfoOrganizations extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      items: [],
      value: ''
    };
    this.getUrl = this.getUrl.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.getOptions = this.getOptions.bind(this);
  }

  getUrl (input) {
    return 'https://www.humanitarianresponse.info/en/api/v1.0/organizations?filter[label][value]=' + input + '&filter[label][operator]=STARTS_WITH&fields=id,label,acronym&sort=label&range=10';
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
          return {
            options: fullLabels
          };
        }).catch(function(err) {
            console.log("Fetch error: ", err);
        });
  }

  handleChange (selectedOption) {
    console.log(selectedOption);
    this.setState({
      value: selectedOption
    });
    if (this.props.onChange) {
      this.props.onChange(selectedOption);
    }
  }

  render() {
    return (
      <Async
        name="organizations"
        value={this.state.value}
        loadOptions={this.getOptions}
        autoload={false}
        onChange={this.handleChange}
        multi={true}
        filterOptions={false}
        />
    );
  }
}

export default HRInfoOrganizations;
