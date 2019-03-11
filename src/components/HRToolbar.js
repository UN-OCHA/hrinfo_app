import React from 'react';
import {Link} from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import EditIcon from '@material-ui/icons/Edit';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import VisibilityIcon from '@material-ui/icons/Visibility';
import SettingsIcon from '@material-ui/icons/Settings';

const styles = theme => ({
  grow: {
    flexGrow: 1
  },
});

class HRToolbar extends React.Component {

  render() {
    const {item, contentType, goBack, classes} = this.props;
    const clonables = ['documents', 'infographics', 'asessments', 'events'];
    const spaces = ['operation', 'disaster', 'office', 'bundle', 'organization'];
    let editType = item.type;
    if (spaces.indexOf(item.type) !== -1) {
      editType = item.type + 's';
    }
    const cloneButton = this.props.hasPermission('edit', item) && clonables.indexOf(item.type) !== -1 ? (
      <Button component={Link} to={'/' + item.type + '/' + item.id + '/clone'} color="secondary"><FileCopyIcon /></Button>
    ) : '';
    const editButton = this.props.hasPermission('edit', item) ? (
      <Button component={Link} to={'/' + editType + '/' + item.id + '/edit'} color="secondary"><EditIcon /></Button>
    ) : '';
    const eyeButton = this.props.hasPermission('customize', item) && spaces.indexOf(item.type) !== -1 ? (
      <Button onClick={this.props.setEditable} color="secondary"><VisibilityIcon /></Button>
    ) : '';
    const wheelButton = this.props.hasPermission('customize', item) && (item.type === 'operation' || item.type === 'group') ? (
      <Button component={Link} to={'/' + item.type + 's/' + item.id + '/manage'} color="secondary"><SettingsIcon /></Button>
    ) : '';
    if (!contentType.slug) {
      return (
        <Toolbar>
          <Button onClick={goBack} color="secondary"><ArrowBackIcon /></Button>
          <div className={classes.grow}></div>
          {cloneButton}
          {editButton}
          {eyeButton}
          {wheelButton}
          <Divider />
        </Toolbar>
      );
    }
    else {
      return (
        <Toolbar>
          <Button onClick={goBack} color="secondary"><ArrowBackIcon /></Button>
          <Divider />
        </Toolbar>
      );
    }
  }
}

export default withStyles(styles)(HRToolbar);
