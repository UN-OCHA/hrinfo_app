import React from 'react';
import AsyncSelect from 'react-select/lib/Async';

class HidContacts extends React.Component {
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
    return 'https://api.humanitarian.id/api/v2/user?limit=10&offset=0&sort=name&q=' + input + '&access_token=' + this.props.token;
  }

  getOptions (input) {
    return fetch(this.getUrl(input))
        .then(results => {
          return results.json();
        }).then(data => {
          return data;
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
        getOptionLabel={(option) => { return option.name}}
        onChange={this.handleChange}
        value={this.props.value}
        className={this.props.className}
        />
    );
  }
}

export default HidContacts;
