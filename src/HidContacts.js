import React from 'react';
import AsyncSelect from 'react-select/lib/Async';

class HidContacts extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      contacts: [],
      status: 'initial'
    };
    this.getUrl = this.getUrl.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.getOptions = this.getOptions.bind(this);
  }

  getUrl (input) {
    return 'https://api.humanitarian.id/api/v2/user?limit=10&offset=0&sort=name&q=' + input;
  }

  getOptions (input) {
    const token = this.props.token;
    return fetch(this.getUrl(input), {
          headers: {
            'Authorization': 'Bearer ' + token
          }
        })
        .then(results => {
          return results.json();
        }).then(data => {
          return data;
        }).catch(function(err) {
          console.log("Fetch error: ", err);
        });
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
    if (this.state.status === 'initial') {
      if (this.props.value) {
        const token = this.props.token;
        let promises = [];
        this.props.value.forEach(function (v) {
          promises.push(
            fetch('https://api.humanitarian.id/api/v2/user/' + v, {
              headers: {
                'Authorization': 'Bearer ' + token
              }
            })
            .then(results => {
              return results.json();
            })
            .then(data => {
              return data;
            })
          );
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
