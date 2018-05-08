import React from 'react';
import Select from 'react-select';
import 'react-select/dist/react-select.css';

class HRInfoLocation extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      items: []
    };
    this.setBaseUrl = this.setBaseUrl.bind(this);
    this.fetchNextPage = this.fetchNextPage.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  setBaseUrl () {
    this.baseUrl = 'https://www.humanitarianresponse.info/en/api/v1.0/locations?fields=id,label&sort=label&filter[admin_level]=' + this.props.level;
    if (this.props.parent) {
      this.baseUrl += '&filter[parent]=' + this.props.parent;
    }
    this.baseUrl += '&page=';
  }

  fetchNextPage (page) {
    return fetch(this.baseUrl + page)
        .then(results => {
            return results.json();
        }).then(data => {
          let items = this.state.items;
          this.setState({
            items: items.concat(data.data)
          });
          if (data.next) {
            const nextPage = page + 1;
            return this.fetchNextPage(nextPage);
          }
        }).catch(function(err) {
            console.log("Fetch error: ", err);
        });
  }

  handleChange (selectedOption) {
    if (this.props.onChange) {
      this.props.onChange(this.props.row, this.props.level, selectedOption);
    }
  }

  componentDidMount() {
    this.setBaseUrl(this.props.level);
    this.fetchNextPage(1);
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevProps.parent !== this.props.parent) {
      this.setState({
        items: []
      });
      this.setBaseUrl(this.props.level);
      this.fetchNextPage(1);
    }
  }

  render() {
    return (
        <Select id="locations" name="locations" onChange={this.handleChange} options={this.state.items} valueKey="id" labelKey="label" value={this.props.value} className="col-sm-3" />
    );
  }
}

export default HRInfoLocation;
