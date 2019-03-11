import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { translate } from 'react-i18next';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import Button from '@material-ui/core/Button';
import KeyboardArrowDown from '@material-ui/icons/KeyboardArrowDown';

const styles = theme => ({
  appBarButton: {
    color: 'white'
  }
});

class LanguageMenu extends React.Component {
  state = {
    anchor: null
  };

  toggleMenu = (event) => {
    if (this.state.anchor) {
      this.setState({anchor: null});
    } else {
      this.setState({anchor: event.currentTarget});
    }
  };

  render () {
    const {classes, i18n} = this.props;
    return (
      <React.Fragment>
        <Button className={classes.appBarButton} onClick={this.toggleMenu}>{i18n.languages[0]} <KeyboardArrowDown /> </Button>
        <Menu id="language-menu" anchorEl={this.state.anchor} onClose={this.toggleMenu} open={Boolean(this.state.anchor)}>
          <MenuItem key='en' onClick={() => {this.toggleMenu(); i18n.changeLanguage('en'); }}>EN</MenuItem>
          <MenuItem key='fr' onClick={() => {this.toggleMenu(); i18n.changeLanguage('fr'); }}>FR</MenuItem>
          <MenuItem key='es' onClick={() => {this.toggleMenu(); i18n.changeLanguage('es'); }}>ES</MenuItem>
        </Menu>
      </React.Fragment>
    )
  }
}

export default translate('common')(withStyles(styles)(LanguageMenu));
