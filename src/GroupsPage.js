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
import HRInfoAPI from './HRInfoAPI';

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

    constructor(props) {
      super(props);

      this.state = {
        doc: null,
        groups: []
      };
      this.hrinfoAPI = new HRInfoAPI();
    }

    async componentDidMount() {
      if (this.props.match.params.id) {
        const doc = await this.hrinfoAPI.getItem('operations', this.props.match.params.id);
        let groupParams = {};
        groupParams['filter[operation]'] = this.props.match.params.id;
        groupParams.sort = 'label';
        const groups = await this.hrinfoAPI.getAll('bundles', groupParams);
        this.setState({
          doc: doc,
          groups: groups,
        });
        this.props.setGroup(doc);
        const breadcrumb = [
          {
            href: '/operations/' + doc.id,
            label: doc.label
          },
          {
            href: '/operations/' + doc.id + '/groups',
            label: 'Groups'
          }
        ];
        this.props.setBreadcrumb(breadcrumb);
      }
    }

    componentWillUnmount() {
      this.props.setGroup(null);
      this.props.setBreadcrumb([]);
    }

    render() {
      const { classes } = this.props;

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
              {this.state.groups.map(n => {
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
};

export default withStyles(styles)(GroupsPage);
