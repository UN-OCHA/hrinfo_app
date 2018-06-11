import React from 'react';
import { CardDeck } from 'reactstrap';
import Item from './Item';

class SearchPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      items: {},
      searchTerms: ''
    };
    this.getUrl = this.getUrl.bind(this);
    this.getItems = this.getItems.bind(this);
    this.getAllItems = this.getAllItems.bind(this);
  }

  getUrl (type, input) {
    return 'https://www.humanitarianresponse.info/en/api/v1.0/' + type + '?filter[label][value]=' + input + '&filter[label][operator]=CONTAINS&sort=label&range=10';
  }

  getItems (type, input) {
    return fetch(this.getUrl(type, input))
        .then(results => {
            return results.json();
        }).then(data => {
          var out = {};
          data.data.forEach(function (item) {
            item.type = type;
          });
          out[type] = data.data;
          return out;
        }).catch(function(err) {
            console.log("Fetch error: ", err);
        });
  }

  getAllItems (input) {
    const that = this;
    const types = [
      'documents',
      'infographics'
    ];
    let promises = [];
    types.forEach(function (type) {
      promises.push(that.getItems(type, input));
    });
    return Promise
      .all(promises)
      .then(values => {
        let out = {};
        values.forEach(function (items) {
          out = Object.assign(items, out);
        });
        return out;
      });
  }

  async componentDidMount() {
    if (this.props.searchTerms) {
      const items = await this.getAllItems(this.props.searchTerms);
      this.setState({
        items: items
      });
    }
  }

  async componentDidUpdate() {
    if (this.props.searchTerms && this.props.searchTerms !== this.state.searchTerms) {
      const items = await this.getAllItems(this.props.searchTerms);
      this.setState({
        items: items,
        searchTerms: this.props.searchTerms
      });
    }
  }

  render() {
    const that = this;
    let items = [];
    let decks = [];
    let boxes = [];
    if (this.state.items) {
      let index = 0;
      const types = [
        'documents',
        'infographics'
      ];
      types.forEach(function (type) {
        if (that.state.items[type]) {
          that.state.items[type].forEach(function (item) {
            items.push(<Item item={item} viewMode="search" />);
            index++;
            if (index === 3) {
              decks.push(<CardDeck>{items}</CardDeck>);
              index = 0;
              items = [];
            }
          });
          boxes.push(<div className="bg-white p-3 my-3"><h2>{type.charAt(0).toUpperCase() + type.slice(1)}</h2>{decks}</div>);
          decks = [];
        }
      });
      return (
        <div>
          {boxes}
        </div>
      );
    }
    else {
      return null;
    }
  }
}

export default SearchPage;
