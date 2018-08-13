import React from 'react';
import PropTypes from 'prop-types';
import {Link} from "react-router-dom";
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';

import withSpace from '../utils/withSpace';

const styles = theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing.unit * 3,
    overflowX: 'auto',
  },
  table: {
    minWidth: 700,
  },
  fab: {
    position: 'fixed',
    bottom: theme.spacing.unit * 2,
    right: theme.spacing.unit * 2,
    color: 'white'
  }
});


class OfficesPage extends React.Component {

    render() {
      const { classes, content } = this.props;
      console.log(content);

      return (
        <div>
          <Paper className={classes.root}>
            <Table className={classes.table}>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Phones</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Location</TableCell>
                  <TableCell>Venue</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {content.data.map(n => {
                  let venue = '';
                  if (n.address) {
                    if (n.address.thoroughfare) {
                      venue += n.address.thoroughfare + ',';
                    }
                    if (n.address.locality) {
                      venue += n.address.locality;
                    }
                  }
                  return (
                    <TableRow key={n.id}>
                      <TableCell component="th" scope="row">
                        <Link to={'/offices/' + n.id}>{n.label}</Link>
                      </TableCell>
                      <TableCell>TODO</TableCell>
                      <TableCell>{n.email ? n.email : ''}</TableCell>
                      <TableCell>{n.location ? n.location.label : ''}</TableCell>
                      <TableCell>{venue}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </Paper>
          {this.props.doc && this.props.hasPermission('add', 'office', this.props.doc) ?
            <Link to="/offices/new">
              <Button variant="fab" color="secondary" aria-label="Add" className={classes.fab}>
                <AddIcon />
              </Button>
            </Link> : '' }
        </div>
      );
    }
}

OfficesPage.propTypes = {
  classes: PropTypes.object.isRequired,
  content: PropTypes.object.isRequired
};

export default withSpace(withStyles(styles)(OfficesPage), { contentType: 'offices', contentLabel: 'Offices', sort: 'label'});
