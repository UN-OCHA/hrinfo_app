import React from 'react';

class Admin extends React.Component {

    render() {
      return (
        <div>
          <p>What would you like to do ?</p>
          <ul>
            <li><a href="/documents/new">Add a document</a></li>
          </ul>
        </div>
      );
    }
}

export default Admin;
