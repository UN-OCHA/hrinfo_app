import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import {Link} from "react-router-dom";
import BigCalendar from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import Paper from '@material-ui/core/Paper';

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
  }
});


class EventsPage extends React.Component {

    render() {
      const { classes, content, onRangeChange} = this.props;
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


      console.log(events);

      return (
        <Paper className={classes.root}>
          <BigCalendar
            events={events}
            className={classes.calendar}
            titleAccessor='label'
            components={{
              event: Event
            }}
            onRangeChange={this.props.onRangeChange}
          />
        </Paper>
      );
    }
}

EventsPage.propTypes = {
  classes: PropTypes.object.isRequired,
  content: PropTypes.object.isRequired
};

export default withSpace(withStyles(styles)(EventsPage), {contentType: 'events', contentLabel: 'Events', sort: '-date'});
