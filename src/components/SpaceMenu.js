import React from 'react';
import PropTypes from 'prop-types';
import {Link} from "react-router-dom";
import { withStyles } from '@material-ui/core/styles';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';

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
  office: ['contacts', 'events', 'documents', 'infographics', 'assessments']
};

function TitlebarGridList(props) {
  const { classes, space } = props;

  return (
    <div className={classes.root}>
      <GridList cellHeight={80} className={classes.gridList}>
        {tileData.map(tile => (
          menus[space.type].indexOf(tile.href) !== -1 ?
            <Link to={'/' + space.type + 's/' + space.id + '/' + tile.href} key={tile.label}>
              <GridListTile key={tile.label} className={classes.center} onClick={props.handlePopover}>
                <h2 className={tile.icon} />
                <h5>{tile.label}</h5>
              </GridListTile>
            </Link> : ''
        ))}
      </GridList>
    </div>
  );
}

TitlebarGridList.propTypes = {
  classes: PropTypes.object.isRequired,
  space: PropTypes.object.isRequired,
};

export default withStyles(styles)(TitlebarGridList);
