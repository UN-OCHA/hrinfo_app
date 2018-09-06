import React from 'react';
import {NavLink} from 'react-router-dom';
import Paper from '@material-ui/core/Paper';
import MenuList from '@material-ui/core/MenuList';
import MenuItem from '@material-ui/core/MenuItem';

import withSpace from '../utils/withSpace';

class SpaceManagePage extends React.Component {

    render() {
      const doc = this.props.doc;
      if (this.props.doc) {
        return (
          <Paper>
            <MenuList>
              <MenuItem>
                <NavLink to={'/' + doc.type + 's/' + doc.id + '/manage/people'} className="link">People</NavLink>
              </MenuItem>
            </MenuList>
          </Paper>
        );
      }
      else {
        return '';
      }
    }
}

export default withSpace(SpaceManagePage, {});
