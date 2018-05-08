import React from 'react';
import Select from 'react-select';
import 'react-select/dist/react-select.css';

class HRInfoSelect extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      items: [],
      value: ''
    };
    this.setBaseUrl = this.setBaseUrl.bind(this);
    this.fetchNextPage = this.fetchNextPage.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  setBaseUrl () {
    this.baseUrl = 'https://www.humanitarianresponse.info/en/api/v1.0/' + this.props.type + '?sort=label';
    if (this.props.type !== 'document_types') {
      this.baseUrl += '&fields=id,label';
    }
    if (this.props.operation) {
      this.baseUrl += '&filter[operation]=' + this.props.operation;
    }
    this.baseUrl += '&page=';
  }

  fetchNextPage (page) {
    return fetch(this.baseUrl + page)
        .then(results => {
            return results.json();
        }).then(data => {
          let pushed = [];
          let items = this.state.items;
          if (this.props.type === 'document_types') {
            data.data.forEach(function (elt) {
              if (elt.parent.length === 1) {
                elt.label = elt.parent[0].label + " > " + elt.label;
                pushed.push(elt);
              }
              else {
                pushed.push(elt);
              }
            });
            this.setState({
              items: items.concat(pushed).sort(function (a, b) {
                if (a.label < b.label) {
                  return -1;
                }
                if (a.label > b.label) {
                  return 1;
                }
                return 0;
              })
            });
          }
          else {
            pushed = data.data;
            this.setState({
              items: items.concat(pushed)
            });
          }
          if (data.next) {
            const nextPage = page + 1;
            return this.fetchNextPage(nextPage);
          }
        }).catch(function(err) {
            console.log("Fetch error: ", err);
        });
  }

  handleChange (selectedOption) {
    this.setState({
      value: selectedOption
    });
    if (this.props.onChange) {
      this.props.onChange(selectedOption);
    }
  }

  componentDidMount() {
    this.setBaseUrl();
    this.fetchNextPage(1);
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevProps.operation !== this.props.operation) {
      this.setState({
        items: [],
        value: ''
      });
      this.setBaseUrl();
      this.fetchNextPage(1);
    }
  }

  render() {
    return (
        <Select multi={this.props.multi} id={this.props.type} name={this.props.type} onChange={this.handleChange} options={this.state.items} valueKey="id" labelKey="label" value={this.state.value} />
    );
  }
}

export default HRInfoSelect;
