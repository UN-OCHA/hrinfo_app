import React from 'react';
import Item from './Item';

class ItemPage extends React.Component {

    constructor(props) {
      super(props);

      this.state = {
        doc: null
      };
    }

    getDocument () {
      const that = this;
      let type = this.props.match.url.replace(this.props.match.params.id, '');
      type = type.replace('\/', '');
      return fetch("https://www.humanitarianresponse.info/api/v1.0" + this.props.match.url)
          .then(results => {
              return results.json();
          }).then(data => {
            let out = data.data[0];
            out.type = type.replace('/', '');
            return out;
          }).catch(function(err) {
              console.log("Fetch error: ", err);
              that.props.setAlert('danger', 'Could not fetch document');
          });
    }

    async componentDidMount() {
      if (this.props.match.params.id) {
        const doc = await this.getDocument();
        this.setState({
          doc: doc
        });
      }
    }

    async componentDidUpdate () {
      if (this.state.doc.id && this.state.doc.id !== this.props.match.params.id) {
        const doc = await this.getDocument();
        this.setState({
          doc: doc,
          canEdit: this.canEdit(doc)
        });
      }
    }

    render() {
      if (this.state.doc) {
        return (<Item item={this.state.doc} viewMode="full" user={this.props.user} />);
      }
      else {
        return null;
      }
    }
}

export default ItemPage;
