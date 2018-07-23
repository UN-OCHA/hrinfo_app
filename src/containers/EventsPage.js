import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import {Link} from "react-router-dom";
import BigCalendar from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';

import {Filters, FilterChips} from './Filters';
import withSpace from './withSpace';

BigCalendar.momentLocalizer(moment);

function Event({ event }) {
  return (
    <span>
      <div><strong>{event.label}</strong></div>
      {event.address && event.address.thoroughfare + ', ' + event.address.locality}
    </span>
  )
}

const styles = theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing.unit * 3,
    overflowX: 'auto',
  },
  calendar: {
    height: "100vh"
  },
  fab: {
    position: 'fixed',
    bottom: theme.spacing.unit * 2,
    right: theme.spacing.unit * 2,
    color: 'white'
  }
});


class EventsPage extends React.Component {

    render() {
      const { classes, content, onRangeChange, toggleDrawer, drawerState, contentType, spaceType, filters, removeFilter} = this.props;
      const events = [];

      content.data.forEach(function (event) {
        event.start = new Date(event.date[0].value);
        if (event.date[0].value2 === event.date[0].value) {
          event.end = new Date(moment(event.date[0].value).add(1, "hours"));
        }
        else {
          event.end = new Date(event.date[0].value2);
        }
        events.push(event);
      });

      return (
        <div>
          <Filters
            contentType={contentType}
            spaceType={spaceType}
            filters={filters}
            setFilter={this.props.setFilter}
            toggleDrawer={toggleDrawer}
            drawerState={drawerState}
            doc={this.props.doc} />
          <Paper className={classes.root}>
            <Typography align="right">
              <Button onClick={toggleDrawer}><i className="icon-filter" /></Button>
            </Typography>
            <Typography variant="subheading">
              <FilterChips filters={filters} removeFilter={removeFilter} />
            </Typography>
            <BigCalendar
              events={events}
              className={classes.calendar}
              titleAccessor='label'
              components={{
                event: Event
              }}
              onRangeChange={onRangeChange}
            />
          </Paper>
          <Link to="/events/new">
            <Button variant="fab" color="secondary" aria-label="Add" className={classes.fab}>
              <AddIcon />
            </Button>
          </Link>
        </div>
      );
    }
}

EventsPage.propTypes = {
  classes: PropTypes.object.isRequired,
  content: PropTypes.object.isRequired
};

export default withSpace(withStyles(styles)(EventsPage), {contentType: 'events', contentLabel: 'Events', sort: '-date'});
