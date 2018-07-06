import React from 'react';
import {Container, Row, Col, Nav, NavItem, NavLink} from 'reactstrap';
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
        let groupParams = {};
        groupParams['filter[operation]'] = this.props.match.params.id;
        groupParams.sort = 'label';
        this.setState({
          doc: await this.hrinfoAPI.getItem('operations', this.props.match.params.id),
          groups: await this.hrinfoAPI.getAll('bundles', groupParams)
        });
      }
    }

    render() {
      if (this.state.doc) {
        const op = this.state.doc;
        let groupsList = '';
        groupsList = this.state.groups.map(function (group) {
          return <li key={group.id}><a href={'/groups/' + group.id}>{group.label}</a></li>;
        });
        return (
          <Container>
            <Row>
              <Col sm="3">
                <h1>{op.label}</h1>
                <h2>Groups</h2>
                <ul>{groupsList}</ul>
              </Col>
              <Col>
                <Nav tabs>
                  <NavItem>
                    <NavLink href={'/operations/' + op.id + '/contacts'}>Contacts</NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink href="#">Events</NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink href="#">Documents</NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink disabled href="#">Maps/Infographics</NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink disabled href="#">Datasets</NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink disabled href="#">Offices</NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink disabled href="#">Assessments</NavLink>
                  </NavItem>
                </Nav>
              </Col>
            </Row>
          </Container>
        );
      }
      else {
        return null;
      }
    }
}

export default OperationPage;
