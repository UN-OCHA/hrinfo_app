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
import withSpace from './withSpace';

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


class GroupsPage extends React.Component {
    render() {
      const { classes, content } = this.props;

      return (
        <Paper className={classes.root}>
          <Table className={classes.table}>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Lead Agencies</TableCell>
                <TableCell>Partners</TableCell>
                <TableCell>Cluster coordinators</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {content.data.map(n => {
                return (
                  <TableRow key={n.id}>
                    <TableCell component="th" scope="row">
                      <Link to={'/groups/' + n.id}>{n.label}</Link>
                    </TableCell>
                    <TableCell>{n.type}</TableCell>
                    <TableCell>
                      {n.lead_agencies ? n.lead_agencies.map(l => {
                        return (
                          <span>{l.label}<br /></span>
                        );
                      }) : ''
                    }</TableCell>
                    <TableCell>
                      {n.partners ? n.partners.map(l => {
                        return (
                          <span>{l.label}<br /></span>
                        );
                      }) : ''
                    }</TableCell>
                    <TableCell>
                      {n.cluster_coordinators ? n.cluster_coordinators.map(l => {
                        return (
                          <span>{l.name}<br /></span>
                        );
                      }) : ''
                    }
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Paper>
      );
    }
}

GroupsPage.propTypes = {
  classes: PropTypes.object.isRequired,
  content: PropTypes.object.isRequired
};

export default withSpace(withStyles(styles)(GroupsPage), {contentType: 'bundles', contentLabel: 'Groups', sort: 'label'});
