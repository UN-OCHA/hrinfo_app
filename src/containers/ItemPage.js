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
        const doc = await this.hrinfoAPI.getItem(type, this.props.match.params.id);
        doc.type = type;
        this.setState({
          doc: doc
        });
      }
    }

    async componentDidUpdate () {
      if (this.state.doc && this.state.doc.id && this.state.doc.id !== this.props.match.params.id) {
        const doc = await this.getDocument();
        this.setState({
          doc: doc,
          canEdit: this.canEdit(doc)
        });
      }
    }

    render() {
      if (this.state.doc && this.state.doc.id) {
        return (
          <Paper>
              {this.props.hasPermission('edit', this.state.doc) ?
                <Typography align = "right">
                  <Button component={Link} to={'/' + this.state.doc.type + '/' + this.state.doc.id + '/clone'}><i className="icon-copy" title="Clone" /></Button>
                  <Button component={Link} to={'/' + this.state.doc.type + '/' + this.state.doc.id + '/edit'}><i className="icon-edit" title="Edit" /></Button>
                </Typography> : ''}
            <Item item={this.state.doc} viewMode="full" user={this.props.user} />
          </Paper>
        );
      }
      else {
        return (<Paper>Not found !</Paper>);
      }
    }
}

export default ItemPage;
