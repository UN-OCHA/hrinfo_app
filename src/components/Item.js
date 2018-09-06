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
              badges.push(<ListItem key={a + '_' + item[a][i].id}>{item[a][i].label}</ListItem>);
            }
          }
        }
        else {
          if (item[a]) {
            badges.push(<ListItem key={a}>{item[a]}</ListItem>);
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
                {this.props.viewMode === 'full' ? <Typography component="p">{item['body-html'] ? renderHTML(item['body-html']) : ''}</Typography> : ''}
              </CardContent>
              <CardActions>
                {this.props.viewMode === 'search' ? <Button component={Link} variant='outlined' color='primary' to={'/' + item.type + '/' + item.id}>View more</Button> : '' }&nbsp;
                {item.type !== 'users' ? <Button variant='outlined' color='primary' href={ 'https://www.humanitarianresponse.info/node/' + item.id }>View in HR.info</Button> : ''}
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

export default withStyles(styles)(Item);
