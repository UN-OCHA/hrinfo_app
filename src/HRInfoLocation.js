import React from 'react';
import Select from 'react-select';

class HRInfoLocation extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      items: [],
      val: {},
      status: 'initial'
    };
    this.setBaseUrl = this.setBaseUrl.bind(this);
    this.fetchNextPage = this.fetchNextPage.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  setBaseUrl () {
    this.baseUrl = 'https://www.humanitarianresponse.info/en/api/v1.0/locations?fields=id,label,pcode&sort=label&filter[admin_level]=' + this.props.level;
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
          else {
            this.setState({
              status: 'ready'
            });
          }
        }).catch(function(err) {
            console.log("Fetch error: ", err);
        });
  }

  handleChange (selectedOption) {
    this.setState({
      val: selectedOption
    });
    if (this.props.onChange) {
      this.props.onChange(this.props.row, this.props.level, selectedOption);
    }
  }

  componentDidMount() {
    this.setBaseUrl(this.props.level);
    this.fetchNextPage(1);
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    const that = this;
    if (prevProps.parent !== this.props.parent) {
      this.setState({
        items: []
      });
      this.setBaseUrl(this.props.level);
      this.fetchNextPage(1);
    }
    if (this.props.value && typeof this.props.value === 'string' && this.state.status === 'initial') {
      if (this.state.items.length) {
        this.state.items.forEach(function (item) {
          if (item.pcode === that.props.value) {
            that.setState({
              val: item,
              status: 'ready'
            });
          }
        });
      }
    }
    if (this.props.value && typeof this.props.value === 'object' && this.state.status === 'initial') {
      this.setState({
        val: this.props.value,
        status: 'ready'
      });
    }
  }

  render() {
    return (
        <Select
          id="locations"
          name="locations"
          onChange={this.handleChange}
          options={this.state.items}
          getOptionValue={(option) => { return option.id }}
          getOptionLabel={(option) => { return option.label}}
          value={this.state.val}
          className={this.props.className} />
    );
  }
}

export default HRInfoLocation;
