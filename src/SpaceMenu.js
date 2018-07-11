import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import ListSubheader from '@material-ui/core/ListSubheader';
import IconButton from '@material-ui/core/IconButton';
import InfoIcon from '@material-ui/icons/Info';

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
    href: 'maps'
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

function TitlebarGridList(props) {
  const { classes, groupHref } = props;

  return (
    <div className={classes.root}>
      <GridList cellHeight={80} className={classes.gridList}>
        {tileData.map(tile => (
          <a href={groupHref + '/' + tile.href}>
            <GridListTile key={tile.label} className={classes.center}>
              <h2 className={tile.icon} />
              <h5>{tile.label}</h5>
            </GridListTile>
          </a>
        ))}
      </GridList>
    </div>
  );
}

TitlebarGridList.propTypes = {
  classes: PropTypes.object.isRequired,
  groupHref: PropTypes.object.isRequired,
};

export default withStyles(styles)(TitlebarGridList);
