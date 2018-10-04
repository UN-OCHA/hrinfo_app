import React from 'react';
import renderHTML from 'react-render-html';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import {Link} from 'react-router-dom';
import { translate, Trans } from 'react-i18next';

import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import Menu from '@material-ui/core/Menu';
import ListItem from '@material-ui/core/ListItem';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemText from '@material-ui/core/ListItemText';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';

import moment from 'moment';

const styles = {
  card: {
    display: 'flex',
  },
  details: {
    display: 'flex',
    flexDirection: 'column',
  },
  content: {
    flex: '1 0 auto',
  },
  cover: {
    width: 200,
    height: 283,
  },
  playIcon: {
    height: 38,
    width: 38,
  },
  gridList: {
    padding: 5
  },
  gridImage: {
    width: 400,
    height: 280,
  },
  buttons: {
    padding: 10
  }
};

class Item extends React.Component {

    constructor(props) {
      super(props);

      this.state = {
        anchorProject : null,
        filesOpen     : false
      };

      this.renderBadges = this.renderBadges.bind(this);
      this.openFiles = this.openFiles.bind(this);
      this.openFilesMenu              = this.openFilesMenu.bind(this);
      this.closeFilesMenu             = this.closeFilesMenu.bind(this);
    }

    openFilesMenu = event => {
      this.setState({
        anchorProject: event.currentTarget
      });
    };

    /** Close Mini Menu **/
    closeFilesMenu = () => {
      this.setState({ anchorProject: null });
    };

    openFiles () {
      this.setState({
        filesOpen: !this.state.filesOpen
      });
    }

    renderBadges () {
      const { t, i18n } = this.props;
      const item = this.props.item;
      const attributes = [
        'document_type',
        'infographic_type',
        'publication_date',
        'operation',
        'space',
        'organizations',
        'bundles',
        'locations',
        'themes',
        'offices',
        'disasters'
      ];
      let badges = [];
      attributes.forEach(function (a) {
        let values = [];
        if (item[a] && Array.isArray(item[a])) {
          for (let i = 0; i < item[a].length; i++) {
            if (item[a][i]) {
              values.push(
                <Typography key={a + '_' + item[a][i].id}>{item[a][i].label}</Typography>
              );
            }
          }
          if (values.length > 0) {
            badges.push(
              <ListItem key={a}>
                <Typography variant="subheading" color="textSecondary">
                  {t(a === 'bundles' ? 'groups' : a === 'offices' ? 'coordination_hubs' : a)}
                  {values}
                </Typography>
              </ListItem>
            );
          }
        }
        else if (item[a] && typeof item[a] === 'object') {
          badges.push(
            <ListItem key={a}>
              <Typography variant="subheading" color="textSecondary">
                {t(a === 'infographic_type' ? 'map_type' : a)}
                <Typography key={a + '_' + item[a].id}>{item[a].label}</Typography>
              </Typography>
            </ListItem>
          );
        }
        else if (item[a]) {
          if ((new Date(item[a])).toDateString() !== 'Invalid Date') {
            let date = new Date(item[a]);
            badges.push(
              <ListItem key={a}>
                <Typography variant="subheading" color="textSecondary">
                  {t(a)}
                  <Typography key={a}>{date.toUTCString().substring(5, 16)}</Typography>
                </Typography>
              </ListItem>);
          }
          else {
            badges.push(<ListItem key={a}>{item[a]}</ListItem>);
          }
        }
      });
      return badges;
    }

    render() {
      const { classes, item, t, i18n } = this.props;
      const { anchorProject } = this.state;
      const fileToDownload = [];
      if (item.files && Array.isArray(item.files) && item.files[0].file && item.files[0].file.fid) {
        for (let i = 0; i < item.files.length; i++) {
          fileToDownload.push(
            <MenuItem key={item.files[i].file.fid}>
              <a href={item.files[i].file.url} target="_blank">
                {item.files[i].file.filename}
              </a>
            </MenuItem>
          );
        }
      }
      let image = '';
      if (item.type === 'users') {
        image = item.picture ? item.picture : 'https://www.humanitarianresponse.info/sites/www.humanitarianresponse.info/files/media-icons/default/application-octet-stream.png';
      }
      else {
        image = item.files && item.files[0] && item.files[0].file.preview !== 'https://www.humanitarianresponse.info/' ? item.files[0].file.preview : 'https://www.humanitarianresponse.info/sites/www.humanitarianresponse.info/files/media-icons/default/application-octet-stream.png';
      }
      if (this.props.viewMode === 'full' || this.props.viewMode === 'search') {
        return (
          <Card className={classes.card}>
            <CardMedia
              className={classes.cover}
              image={image}
              title="Card Image"
            />
            <div className={classes.details}>
              <CardContent>
                <Typography gutterBottom variant="headline" component="h2">{item.label ? item.label : item.name}</Typography>
                                                                            {/* Why use item['body-html'} ? this gives me an error */}
                {this.props.viewMode === 'full' ? <Typography component="p">{item['body-html'] ? renderHTML(item['body']) : ''}</Typography> : ''}
              </CardContent>
              <CardActions>
                {this.props.viewMode === 'search' ?
                    <Button component={Link} variant='outlined' color='primary' to={'/' + item.type + '/' + item.id}>
                      View more
                    </Button>: '' }&nbsp;
                {item.type !== 'users' ?
                  <div>
                    <div className={classes.buttons}>
                      <Button variant='outlined' color='primary' href={ 'https://www.humanitarianresponse.info/node/' + item.id }>View in HR.info</Button>
                    </div>
                      {fileToDownload.length !== 0 ?
                        <div className={classes.buttons}>
                          <Button aria-owns = {anchorProject ? 'MiniMenuGlobal' : null}
                                  variant   = "outlined"
                                  color     = "primary"
                                  component = "span"
                                  onClick   = {this.openFilesMenu}>
                            Download
                          </Button>
                          <Menu id       = "MiniMenuGlobal"
                                anchorEl = {anchorProject}
                                open     = {Boolean(anchorProject)}
                                onClose  = {this.closeFilesMenu}
                          >
                            {fileToDownload}
                          </Menu>
                        </div> : ''}
                  </div>
                  : ''}
              </CardActions>
            </div>
            <List>
              {this.renderBadges()}
            </List>
          </Card>
        );
      }
      else if (this.props.viewMode === 'grid') {
        return (
          <GridListTile key={item.id} className={classes.gridList}>
            <Link to={'/' + item.type + '/' + item.id}>
              <img src={item.files ? item.files[0].file.preview : 'https://www.humanitarianresponse.info/sites/www.humanitarianresponse.info/files/media-icons/default/application-octet-stream.png'} alt={item.label} className={classes.gridImage} />
              <GridListTileBar
                title={item.label}
              />
            </Link>
          </GridListTile>
        );
      }
      else if (this.props.viewMode === 'link') {
        if (item.type === 'users') {
          return (
            <ListItem key={item.id}>
              <ListItemText>
                <Link to={'/' + item.type + '/' + item.id}><Typography variant="headline" component="h2">{item.name}</Typography></Link>
                {item.organization ? <Typography component="p">{item.organization.name}</Typography> : ''}
                {item.job_title ? <Typography component="p">{item.job_title}</Typography> : ''}
                {item.email ? <Typography component="p">{item.email}</Typography> : ''}
                {item.phone_number ? <Typography component="p">{item.phone_number}</Typography> : ''}
              </ListItemText>
            </ListItem>
          );
        }
        else if (item.type === 'reports') {
          return (
            <ListItem key={item.id}>
              <a href={'https://reliefweb.int/node/' + item.id} target="_blank"><ListItemText primary={item.fields.title} /></a>
            </ListItem>
          );
        }
        else {
          return (
            <ListItem key={item.id}>
              <Link to={'/' + item.type + '/' + item.id}><ListItemText primary={item.label} /></Link>
              {item.type === 'events' ? moment(item.date[0].value).format('DD/MM/YYYY') : ''}
            </ListItem>
          );
        }
      }
    }
}

Item.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(translate('forms')(Item));
