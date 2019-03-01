import React from 'react';
import {Link} from "react-router-dom";
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

class HdxNumberOfDatasets extends React.Component {

  render() {
    return <div>
      <Typography component="h2" variant="h1" align="center">{this.props.result ? this.props.result.count : 0} datasets</Typography>
      <Typography align = "right">
        <Button component={Link} to={'/operations/' + this.props.doc.id + '/datasets'}>View all datasets</Button>
      </Typography>
    </div>;
  }
}


export {HdxNumberOfDatasets};
