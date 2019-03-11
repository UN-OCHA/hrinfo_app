import React from 'react';
import renderHTML from 'react-render-html';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import {Link} from 'react-router-dom';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import Chip from '@material-ui/core/Chip';
import moment from 'moment';

import DownloadButton from './DownloadButton';

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
    padding: 5,
    width: 400,
    height: 400
  },
  gridImage: {
    maxWidth: 300,
    height: 'auto',
  },
  gridLink: {
    display: 'block'
  }
};

class Item extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      filesOpen: false
    };

    this.renderBadges = this.renderBadges.bind(this);
    this.openFiles = this.openFiles.bind(this);
  }

  openFiles () {
    this.setState({
      filesOpen: !this.state.filesOpen
    });
  }

  renderBadges () {
    const item = this.props.item;
    const attributes = [
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
      if (item[a] && Array.isArray(item[a])) {
        for (let i = 0; i < item[a].length; i++) {
          if (item[a][i]) {
            badges.push(<Chip key={a + '_' + item[a][i].id} label={item[a][i].label} color="primary" />);
          }
        }
      }
      else {
        if (item[a]) {
          badges.push(<Chip key={a} label={item[a]} color="primary" />);
        }
      }
    });
    return badges;
  }

  render() {
    const { classes, item } = this.props;
    let image = '';
    if (item.type === 'users') {
      image = item.picture ? item.picture : 'https://www.humanitarianresponse.info/sites/www.humanitarianresponse.info/files/media-icons/default/application-octet-stream.png';
    }
    else {
      image = item.files && item.files[0] && item.files[0].file.preview !== 'https://www.humanitarianresponse.info/' ? item.files[0].file.preview : 'https://www.humanitarianresponse.info/sites/www.humanitarianresponse.info/files/media-icons/default/application-octet-stream.png';
    }
    if (this.props.viewMode === 'full') {
      return (
        <Card elevation={0}>
          <CardContent>
            <Typography gutterBottom variant="h2">{item.label ? item.label : item.name}</Typography>
            {this.renderBadges()}
            <Typography align="center">
              <img src={image} alt={item.label} className={classes.cover} title={item.label} /><br />
              <DownloadButton item={item} />
            </Typography>
            {this.props.viewMode === 'full' ? <Typography component="p">{item['body-html'] ? renderHTML(item['body-html']) : ''}</Typography> : ''}
          </CardContent>
          <CardActions>
            {this.props.viewMode === 'search' ? <Button component={Link} variant='outlined' color='primary' to={'/' + item.type + '/' + item.id}>View more</Button> : '' }&nbsp;
            {item.type !== 'users' ? <Button variant='outlined' color='primary' href={ 'https://www.humanitarianresponse.info/node/' + item.id }>View in HR.info</Button> : ''}
          </CardActions>
        </Card>
      );
    }
    else if (this.props.viewMode === 'search') {
      return (
        <Card>
          <CardMedia
            className={classes.gridImage}
            image={image}
            title={item.label}
          />
          <CardContent>
            <Typography component="p">{item['body-html'] ? renderHTML(item['body-html']) : ''}</Typography>
          </CardContent>
          <CardActions>
            {this.props.viewMode === 'search' ? <Button component={Link} variant='outlined' color='primary' to={'/' + item.type + '/' + item.id}>View more</Button> : '' }&nbsp;
            {item.type !== 'users' ? <Button variant='outlined' color='primary' href={ 'https://www.humanitarianresponse.info/node/' + item.id }>View in HR.info</Button> : ''}
          </CardActions>
        </Card>
      );
    }
    else if (this.props.viewMode === 'grid') {
      let image = '';
      if (item.type === 'users') {
        image = item.picture ? item.picture : 'https://i2.wp.com/humanitarian.id/img/default-avatar.png?ssl=1';
      }
      else {
        image = item.files ? item.files[0].file.preview : 'https://www.humanitarianresponse.info/sites/www.humanitarianresponse.info/files/media-icons/default/application-octet-stream.png';
      }
      return (
        <GridListTile key={item.id} className={classes.gridList}>
          <Link to={'/' + item.type + '/' + item.id} align='center' className={classes.gridLink}>
            <img src={image} alt={item.label ? item.label : item.name} className={classes.gridImage} />
          </Link>
          <GridListTileBar title={item.label ? item.label : item.name} />
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

export default withStyles(styles)(Item);
