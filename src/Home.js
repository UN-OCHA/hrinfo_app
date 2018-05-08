import React from 'react';

class Home extends React.Component {

    render() {
      return (
        <div>
          Welcome {this.props.user.name}, you are logged in
        </div>
      );
    }
}

export default Home;
