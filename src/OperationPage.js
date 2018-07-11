import React from 'react';
import HRInfoAPI from './HRInfoAPI';

class OperationPage extends React.Component {

    constructor(props) {
      super(props);

      this.state = {
        doc: null,
        groups: []
      };
      this.hrinfoAPI = new HRInfoAPI();
    }

    async componentDidMount() {
      if (this.props.match.params.id) {
        const op = await this.hrinfoAPI.getItem('operations', this.props.match.params.id);
        this.setState({
          doc: op,
        });
        this.props.setGroup(op);
      }
    }

    componentWillUnmount() {
      this.props.setGroup(null);
    }

    render() {
      return ('');
    }
}

export default OperationPage;
