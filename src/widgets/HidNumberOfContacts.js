import React from 'react';
import {Link} from "react-router-dom";
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

class HidNumberOfContacts extends React.Component {

  render() {
    return <div>
      <Typography component="h2" variant="h1" align="center">{this.props.list ? this.props.list.count : 0} contacts</Typography>
      <Typography align = "right">
        <Button component={Link} to="/operations/2784/contacts">View all contacts</Button>
      </Typography>
    </div>;
  }
}


export {HidNumberOfContacts};
