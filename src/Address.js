import React from 'react';
import { Input, FormGroup, Row, Col, Label } from 'reactstrap';

class Address extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      items: []
    };
    this.getUrl = this.getUrl.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.getOptions = this.getOptions.bind(this);
  }

  getUrl (input) {
    return 'https://api.humanitarian.id/api/v2/user?limit=10&offset=0&sort=name&q=' + input + '&access_token=' + this.props.token;
  }

  getOptions (input) {
    return fetch(this.getUrl(input))
        .then(results => {
          return results.json();
        }).then(data => {
          return data;
        }).catch(function(err) {
          console.log("Fetch error: ", err);
        });
  }

  handleChange (selectedOption) {
    if (this.props.onChange) {
      this.props.onChange(selectedOption);
    }
  }

  render() {
    return (
      <div>
        <Row>
          <Col>
            <FormGroup>
              <Label for="address_1">Address 1</Label>
              <Input type="text" name="address_1" />
            </FormGroup>
          </Col>
        </Row>
        <Row>
          <Col>
            <FormGroup>
              <Label for="address_2">Address 2</Label>
              <Input type="text" name="address_2" />
            </FormGroup>
          </Col>
        </Row>
        <Row>
          <Col>
            <FormGroup>
              <Label for="postal_code">Postal code</Label>
              <Input type="text" name="postal_code" />
            </FormGroup>
          </Col>
          <Col>
            <FormGroup>
              <Label for="city">City</Label>
              <Input type="text" name="city" />
            </FormGroup>
          </Col>
        </Row>
      </div>

    );
  }
}

export default Address;
