import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import Modal from '@material-ui/core/Modal';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import Button from '@material-ui/core/Button';

import HRInfoSelect from '../components/HRInfoSelect';
import Item from '../components/Item';
import HRInfoAPI from '../api/HRInfoAPI';

function TabContainer(props) {
  return (
    <Typography component="div" style={{ padding: 8 * 3 }}>
      {props.children}
    </Typography>
  );
}

TabContainer.propTypes = {
  children: PropTypes.node.isRequired,
};

const styles = theme => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
  },
  gridList: {
    width: 1000,
    height: 900,
  },
});

class OchaProductsSimple extends React.Component {
  state = {
    value: 0,
    sitrep: null,
    bulletin: null,
    snapshot: null,
    dashboard: null,
  };

  hrinfoAPI = new HRInfoAPI();

  handleChange = (event, value) => {
    this.setState({ value });
  };

  async componentDidMount() {
    this.setState({
      sitrep: await this.hrinfoAPI.getItem('documents', 168093),
      bulletin: await this.hrinfoAPI.getItem('documents', 167895),
      snapshot: await this.hrinfoAPI.getItem('infographics', 167219),
      dashboard: await this.hrinfoAPI.getItem('infographics', 157839),
    });
  }

  render() {
    const { classes } = this.props;
    const { value, sitrep, bulletin, snapshot, dashboard } = this.state;

    return (
      <div className={classes.root}>
        <AppBar position="static">
          <Tabs value={value} onChange={this.handleChange}>
            <Tab label="Response Planning" />
            <Tab label="OCHA Products" />
          </Tabs>
        </AppBar>
        {value === 0 && <TabContainer>Response Planning</TabContainer>}
        {value === 1 && <TabContainer>
          <GridList>
            {sitrep ? <Item item={sitrep} viewMode='grid' /> : '' }
            {bulletin ? <Item item={bulletin} viewMode="grid" /> : '' }
            {snapshot ? <Item item={snapshot} viewMode="grid" /> : '' }
            {dashboard ? <Item item={dashboard} viewMode="grid" /> : '' }
          </GridList></TabContainer>}
      </div>
    );
  }
}

OchaProductsSimple.propTypes = {
  classes: PropTypes.object.isRequired,
};

const settingsStyles = theme => ({
  paper: {
    position: 'absolute',
    width: theme.spacing.unit * 50,
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing.unit * 4,
  },
});

class SettingsModal extends React.Component {

  render () {
    const { classes } = this.props;

    return (
      <Modal
          aria-labelledby="simple-modal-title"
          aria-describedby="simple-modal-description"
          open={this.props.open}
          onClose={this.props.handleClose}
        >
          <div style={this.props.style} className={classes.paper}>
            <FormControl required fullWidth margin="normal">
              <FormLabel>Operation(s) / Webspace(s)</FormLabel>
              <HRInfoSelect type="spaces" onChange={(s) => this.props.addWidgetSetting('space', s)} />
            </FormControl>
            <Button color="primary" variant="contained" onClick={(evt) => {this.props.handleSubmit()}}>Add Widget</Button>
          </div>
      </Modal>
    );
  }
}

SettingsModal.propTypes = {
  classes: PropTypes.object.isRequired,
};

const OchaProductsSettings = withStyles(settingsStyles)(SettingsModal);
const OchaProducts = withStyles(styles)(OchaProductsSimple);


export {OchaProductsSettings, OchaProducts};
