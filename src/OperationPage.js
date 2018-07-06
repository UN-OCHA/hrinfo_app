import React from 'react';
import {Container, Row, Col, Nav, NavItem, NavLink} from 'reactstrap';
import HRInfoAPI from './HRInfoAPI';

class OperationPage extends React.Component {

    constructor(props) {
      super(props);

      this.state = {
        doc: null
      };
      this.hrinfoAPI = new HRInfoAPI();
    }

    async componentDidMount() {
      if (this.props.match.params.id) {
        const doc = await this.hrinfoAPI.getItem('operations', this.props.match.params.id);
        this.setState({
          doc: doc
        });
      }
    }

    async componentDidUpdate () {
      if (this.state.doc.id && this.state.doc.id !== this.props.match.params.id) {
        const doc = await this.hrinfoAPI.getItem('operations', this.props.match.params.id);
        this.setState({
          doc: doc,
          canEdit: this.canEdit(doc)
        });
      }
    }

    render() {
      if (this.state.doc) {
        const op = this.state.doc;
        return (
          <Container>
            <Row>
              <Col sm="3">
                <h1>{op.label}</h1>
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
