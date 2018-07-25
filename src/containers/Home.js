import React from 'react';
import {Link} from 'react-router-dom';

class Home extends React.Component {

    render() {
      return (
        <div>
          <p>Welcome {this.props.user.name}, you are logged in</p>
          <p>What would you like to do ?</p>
          <ul>
            <li><Link to="/documents/new">Add a document</Link></li>
            <li><Link to="/infographics/new">Add a map/infographic</Link></li>
            <li><Link to="/events/new">Add a new event</Link></li>
          </ul>
        </div>
      );
    }
}

export default Home;
