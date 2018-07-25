import React from 'react';
import Item from '../components/Item';
import HRInfoAPI from '../api/HRInfoAPI';

class ItemPage extends React.Component {

    constructor(props) {
      super(props);

      this.state = {
        doc: null
      };
      this.hrinfoAPI = new HRInfoAPI();
    }

    async componentDidMount() {
      if (this.props.match.params.id) {
        let type = this.props.match.url.replace(this.props.match.params.id, '');
        type = type.replace('/', '');
        type = type.replace('/', '');
        const doc = await this.hrinfoAPI.getItem(type, this.props.match.params.id)
          .then(doc => {
            doc.type = type;
            return doc;
          });
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
