import React from 'react';

class Admin extends React.Component {

    render() {
      return (
        <div>
          <p>What would you like to do ?</p>
          <ul>
            <li><a href="/documents/new">Add a document</a></li>
            <li><a href="/infographics/new">Add a map/infographic</a></li>
            <li><a href="/events/new">Add a new event</a></li>
          </ul>
        </div>
      );
    }
}

export default Admin;
