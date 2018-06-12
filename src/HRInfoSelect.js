import React from 'react';
import Select from 'react-select';

class HRInfoSelect extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      items: []
    };
    this.getUrl = this.getUrl.bind(this);
    this.fetchNextPage = this.fetchNextPage.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  getUrl (type, operation) {
    let url = 'https://www.humanitarianresponse.info/en/api/v1.0/' + type + '?sort=label';
    if (type !== 'document_types' && type !== 'infographic_types') {
      url += '&fields=id,label,operation';
    }
    if (operation) {
      url += '&filter[operation]=' + operation;
    }
    url += '&page=';
    return url;
  }

  fetchNextPage (url, page, type, operationLabel) {
    return fetch(url + page)
        .then(results => {
            return results.json();
        }).then(data => {
          let pushed = [];
          let items = this.state.items;
          if (type === 'document_types' || type === 'infographic_types') {
            data.data.forEach(function (elt) {
              if (elt.parent.length === 1) {
                elt.label = elt.parent[0].label + " > " + elt.label;
                pushed.push(elt);
              }
              else {
                pushed.push(elt);
              }
            });
          }
          else if (type === 'bundles' || type === 'offices') {
            data.data.forEach(function (elt) {
              elt.label = elt.label + " (" + operationLabel + ")";
              pushed.push(elt);
            });
          }
          else {
            pushed = data.data;
            pushed = pushed.map(function (val) {
              val.type = type;
              return val;
            });
          }
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
          if (data.next) {
            const nextPage = page + 1;
            return this.fetchNextPage(url, nextPage, type);
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

  componentDidMount() {
    if (this.props.spaces) {
      const that = this;
      this.props.spaces.forEach(function (space) {
        if (space.type === 'operations') {
          const url = that.getUrl(that.props.type, space.id);
          that.fetchNextPage(url, 1, that.props.type, space.label);
        }
      });
    }
    else {
      const url = this.getUrl(this.props.type);
      this.fetchNextPage(url, 1, this.props.type);
    }
    if (this.props.type === 'spaces') {
      const url2 = this.getUrl('operations');
      this.fetchNextPage(url2, 1, 'operations');
    }
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if ((this.props.type === 'document_types' || this.props.type === 'infographic_types') && this.props.value) {
      for (let i = 0; i < this.state.items.length; i++) {
        if (this.state.items[i].id === parseInt(this.props.value.id, 10)) {
          this.props.value.label = this.state.items[i].label;
        }
      }
    }
    if (JSON.stringify(prevProps.spaces) !== JSON.stringify(this.props.spaces)) {
      this.setState({
        items: []
      });
      const that = this;
      this.props.spaces.forEach(function (space) {
        if (space.type === 'operations') {
          const url = that.getUrl(that.props.type, space.id);
          that.fetchNextPage(url, 1, that.props.type, space.label);
        }
      });
    }
  }

  render() {
    return (
        <Select
          isMulti={this.props.isMulti}
          id={this.props.type}
          name={this.props.type}
          onChange={this.handleChange}
          options={this.state.items}
          getOptionValue={(option) => { return option.id }}
          getOptionLabel={(option) => { return option.label}}
          value={this.props.value} />
    );
  }
}

export default HRInfoSelect;
