import React from 'react';
import {Link} from 'react-router-dom';

class Admin extends React.Component {

    render() {
      return (
        <div>
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

export default Admin;
