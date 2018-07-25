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
});


class OfficesPage extends React.Component {

    render() {
      const { classes, content } = this.props;
      console.log(content);

      return (
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
      );
    }
}

OfficesPage.propTypes = {
  classes: PropTypes.object.isRequired,
  content: PropTypes.object.isRequired
};

export default withSpace(withStyles(styles)(OfficesPage), { contentType: 'offices', contentLabel: 'Offices', sort: 'label'});
