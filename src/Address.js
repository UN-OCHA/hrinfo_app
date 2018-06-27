import React from 'react';
import { Input, FormGroup, Row, Col, Label } from 'reactstrap';
import HRInfoLocation from './HRInfoLocation';

class Address extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      val: {},
      status: 'initial'
    };
    this.getUrl = this.getUrl.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.getOptions = this.getOptions.bind(this);
    this.setCountry = this.setCountry.bind(this);
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

  setCountry (row, level, selectedOption) {
    let val = this.state.val;
    val['country'] = selectedOption;
    this.setState({
      val: val
    });
    if (this.props.onChange) {
      this.props.onChange(val);
    }
  }

  handleChange (event) {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    let val = this.state.val;
    val[name] = value;
    this.setState({
      val: val
    });
    if (this.props.onChange) {
      this.props.onChange(val);
    }
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.props.value && Object.keys(this.props.value).length && this.state.status === 'initial') {
      this.setState({
        val: this.props.value,
        status: 'ready'
      });
    }
  }

  render() {
    return (
      <div>
        <Row>
          <Col>
            <FormGroup>
              <Label for="country">Country</Label>
              <HRInfoLocation level="0" value={this.state.val.country} onChange={this.setCountry} />
            </FormGroup>
          </Col>
        </Row>
        <Row>
          <Col>
            <FormGroup>
              <Label for="thoroughfare">Address 1</Label>
              <Input type="text" name="thoroughfare" value={this.state.val.thoroughfare} onChange={this.handleChange} />
            </FormGroup>
          </Col>
        </Row>
        <Row>
          <Col>
            <FormGroup>
              <Label for="premise">Address 2</Label>
              <Input type="text" name="premise" value={this.state.val.premise} onChange={this.handleChange} />
            </FormGroup>
          </Col>
        </Row>
        <Row>
          <Col>
            <FormGroup>
              <Label for="postal_code">Postal code</Label>
              <Input type="text" name="postal_code" value={this.state.val.postal_code} onChange={this.handleChange} />
            </FormGroup>
          </Col>
          <Col>
            <FormGroup>
              <Label for="locality">City</Label>
              <Input type="text" name="locality" value={this.state.val.locality} onChange={this.handleChange} />
            </FormGroup>
          </Col>
        </Row>
      </div>

    );
  }
}

export default Address;
