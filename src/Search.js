import React from 'react';
import AsyncSelect from 'react-select/lib/Async';

class Search extends React.Component {
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
    return 'https://www.humanitarianresponse.info/en/api/v1.0/documents?filter[label][value]=' + input + '&filter[label][operator]=CONTAINS&fields=id,label,acronym&sort=label&range=10';
  }

  getOptions (input) {
    return fetch(this.getUrl(input))
        .then(results => {
            return results.json();
        }).then(data => {
          return data.data;
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
        loadOptions={this.getOptions}
        getOptionValue={(option) => { return option.id }}
        getOptionLabel={(option) => { return option.label}}
        onChange={this.handleChange}
        className={this.props.className}
        placeholder={this.props.placeholder}
        />
    );
  }
}

export default Search;
