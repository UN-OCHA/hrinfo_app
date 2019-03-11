import React from 'react';
import PropTypes from 'prop-types';
import {Link} from "react-router-dom";
import { withStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import MailIcon from '@material-ui/icons/Mail';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';

const styles = theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    overflow: 'hidden',
    backgroundColor: theme.palette.background.paper,
  },
  gridList: {
    width: 500,
    height: 450,
  },
  icon: {
    color: 'rgba(255, 255, 255, 0.54)',
  },
  center: {
    textAlign: 'center'
  },
});


const tileData = [
  {
    label: 'Groups',
    icon: 'icon-beaker',
    href: 'groups'
  },
  {
    label: 'Contacts',
    icon: 'icon-users',
    href: 'contacts'
  },
  {
    label: 'Events',
    icon: 'icon-calendar',
    href: 'events'
  },
  {
    label: 'Documents',
    icon: 'icon-documents',
    href: 'documents'
  },
  {
    label: 'Maps/Infographics',
    icon: 'icon-map-pin',
    href: 'infographics'
  },
  {
    label: 'Datasets',
    icon: 'icon-piechart',
    href: 'datasets'
  },
  {
    label: 'Offices',
    icon: 'icon-flag',
    href: 'offices'
  },
  {
    label: 'Assessments',
    icon: 'icon-folder',
    href: 'assessments'
  },
  {
    label: 'Disasters',
    icon: 'icon-beaker',
    href: 'disasters'
  }
];

const menus = {
  operation: ['groups', 'contacts', 'events', 'documents', 'infographics', 'datasets', 'offices', 'assessments', 'disasters'],
  group: ['contacts', 'events', 'documents', 'infographics', 'datasets', 'assessments'],
  organization: ['contacts', 'events', 'documents', 'infographics', 'datasets', 'assessments'],
  disaster: ['contacts', 'events', 'documents', 'infographics', 'assessments'],
  office: ['contacts', 'events', 'documents', 'infographics', 'assessments'],
  location: ['events', 'documents', 'infographics', 'assessments']
};

class SpaceMenu extends React.Component {

  state = {
    open: false
  };

  onClose = () => {
    this.setState({
      open: !this.state.open
    });
  };

  render () {
    const { classes, item} = this.props;
    const spaces = ['operation', 'disaster', 'office', 'bundle', 'organization'];

    return item && spaces.indexOf(item.type) !== -1 ? (
      <React.Fragment>
        <IconButton aria-label="Modules" onClick={this.onClose} color="secondary">
          <MenuIcon />
        </IconButton>
        <Drawer
          open={this.state.open}
          onClose={this.onClose}>
          <List>
            {tileData.map(tile => (
              menus[item.type].indexOf(tile.href) !== -1 ?
                <ListItem color="secondary" button key={tile.label}>
                  <ListItemIcon>{<MailIcon />}</ListItemIcon>
                  <ListItemText color="secondary">
                    <Link color="secondary" to={'/' + item.type + 's/' + item.id + '/' + tile.href} key={tile.label}>{tile.label}</Link>
                  </ListItemText>
                </ListItem> : ''
            ))}
          </List>
          <Divider />
          <List>
            {['Custom menu item 1', 'Custom menu item 2'].map((text, index) => (
              <ListItem button key={text}>
                <ListItemIcon>{index % 2 === 0 ? <InboxIcon /> : <MailIcon />}</ListItemIcon>
                <ListItemText primary={text} />
              </ListItem>
            ))}
          </List>
        </Drawer>
      </React.Fragment>
    ) : '';
  }
}

SpaceMenu.propTypes = {
  classes: PropTypes.object.isRequired,
  item: PropTypes.object.isRequired,
};

export default withStyles(styles)(SpaceMenu);
