import React from 'react';
import MaterialSelect from '../components/MaterialSelect';
import ReliefwebAPI from '../api/ReliefwebAPI';

class ReliefwebSelect extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      items: []
    };
    this.reliefwebAPI = new ReliefwebAPI();
    this.getOptions = this.getOptions.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.user = JSON.parse(localStorage.getItem('hid-user'));;
  }

  getOptions (type) {
    return this
      .reliefwebAPI
      .getFilter(type)
      .then(elts => {
        this.setState({
          items: elts
        });
      }).catch(function(err) {
          console.log("Fetch error: ", err);
      });
  }

  handleChange (selectedOption) {
    if (this.props.onChange) {
      this.props.onChange(selectedOption);
    }
  }

  componentDidMount() {
    this.getOptions(this.props.type);
  }

  render() {
    return (
        <MaterialSelect
          isMulti={this.props.isMulti}
          id={this.props.type}
          name={this.props.type}
          getOptionLabel={(option) => {return option.value}}
          onChange={this.handleChange}
          options={this.state.items}
          value={this.props.value} />
    );
  }
}

export default ReliefwebSelect;
