import React from 'react';
import {Link} from 'react-router-dom';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

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
        return (
          <Paper>
            <Typography align = "right">
              {this.props.hasPermission('edit', this.state.doc) ?
                <Button component={Link} to={'/' + this.state.doc.type + '/' + this.state.doc.id + '/edit'}><i className="icon-edit" /></Button> : ''}
            </Typography>
            <Item item={this.state.doc} viewMode="full" user={this.props.user} />
          </Paper>
        );
      }
      else {
        return null;
      }
    }
}

export default ItemPage;
