import React from 'react';
import lodash from 'lodash';
import List from '@material-ui/core/List';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

import DigitalSitrepAPI from '../api/DigitalSitrepAPI';
import MaterialSelect from '../components/MaterialSelect';
import Item from '../components/Item';

class DigitalSitrepHighlights extends React.Component {

  state = {
    highlights: []
  };

  dsAPI = new DigitalSitrepAPI();

  async updateData () {
    const params = {
      "fields.slug": this.props.slug
    };
    const data = await this.dsAPI.get(params);
    const highlights = [];
    data.includes.Entry.forEach(function (entry) {
      if  (entry.fields.keyMessage) {
        highlights.push(entry.fields.keyMessage);
      }
    });
    this.setState({highlights: highlights});
  }

  async componentDidMount() {
    this.updateData();
  }

  async componentDidUpdate(prevProps, prevState, snapshot) {
    if (JSON.stringify(prevProps) !== JSON.stringify(this.props)) {
      this.updateData();
    }
  }

  render() {
    const highlights = this.state.highlights;
    return (
      <div>
        {highlights ?
        <ul>
            {highlights.map(function (highlight) {
              return (
                <li>{highlight}</li>
              );
            })}
        </ul> : '' }
      </div>
    );
  }
}

export { DigitalSitrepHighlights };
