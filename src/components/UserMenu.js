import React from 'react';
import PropTypes from 'prop-types';
import {NavLink} from "react-router-dom";
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import Divider from '@material-ui/core/Divider';
import Button from '@material-ui/core/Button';
import Avatar from '@material-ui/core/Avatar';

class UserMenu extends React.Component {
  state = {
    anchorEl: null
  };

  toggleMenu = (event) => {
    if (this.state.anchorEl) {
      this.setState({anchorEl: null});
    } else {
      this.setState({anchorEl: event.currentTarget});
    }
  }

  handleLogout = () => {
    this.toggleMenu();
    this.props.handleLogout();
  }

  render () {
    return (
      <React.Fragment>
        <Button aria-owns={Boolean(this.state.anchorEl) ? 'menu-appbar' : null}
          aria-haspopup="true"
          onClick={this.toggleMenu}
          color="primary"
          variant="fab"
          mini
          classes={{flat: 'flat'}}>
          { this.props.user.picture ? (<Avatar src={this.props.user.picture}></Avatar>) : (<Avatar>{this.props.user.name.substring(0,1)}</Avatar>)}
        </Button>
        <Menu id="menu-appbar"
          anchorEl={this.state.anchorEl}
          anchorOrigin={{
                            vertical: 'top',
                            horizontal: 'right'
                        }}
          transformOrigin={{
                            vertical: 'top',
                            horizontal: 'right'
                        }}
          open={Boolean(this.state.anchorEl)}
          onClose={this.toggleMenu}>
            <MenuItem onClick={this.toggleMenu}>
                <NavLink to={'/users/' + this.props.user.id} className="link">Profile</NavLink>
            </MenuItem>
            <MenuItem onClick={this.toggleMenu}>
                <NavLink to={'/admin'} className="link">Admin</NavLink>
            </MenuItem>
            <MenuItem onClick={this.toggleMenu}>
                <a href="mailto:info@humanitarianresponse.info" className="link">Feedback</a>
            </MenuItem>
            <Divider/>
            <MenuItem onClick={this.handleLogout}>Logout</MenuItem>
        </Menu>
      </React.Fragment>
    );
  }
}

UserMenu.propTypes = {
  user: PropTypes.object.isRequired,
  handleLogout: PropTypes.func.isRequired
};

export default UserMenu;
