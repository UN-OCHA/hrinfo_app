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

  render () {
    const { classes, space, open, onClose} = this.props;

    return space ? (
      <Drawer
        open={open}
        onClose={onClose}>
        <List>
          {tileData.map(tile => (
            menus[space.type].indexOf(tile.href) !== -1 ?
              <ListItem color="secondary" button key={tile.label}>
                <ListItemIcon>{<MailIcon />}</ListItemIcon>
                <ListItemText color="secondary">
                  <Link color="secondary" to={'/' + space.type + 's/' + space.id + '/' + tile.href} key={tile.label}>{tile.label}</Link>
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
    ) : '';
  }
}

SpaceMenu.propTypes = {
  classes: PropTypes.object.isRequired,
  space: PropTypes.object.isRequired,
};

export default withStyles(styles)(SpaceMenu);
