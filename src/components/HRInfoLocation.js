import React from 'react';
import MaterialSelect from '../components/MaterialSelect';
import HRInfoAPI from '../api/HRInfoAPI';

class HRInfoLocation extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      items: [],
      val: {},
      status: 'initial'
    };
    this.hrinfoAPI = new HRInfoAPI();
    this.getOptions = this.getOptions.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  getOptions () {
    let params = {};
    params.fields = 'id,label,pcode';
    params.sort   = 'label';
    params['filter[admin_level]'] = this.props.level;
    if (this.props.parent) {
      params['filter[parent]'] = this.props.parent;
    }

    return this.hrinfoAPI
      .getAll('locations', params)
      .then(elts => {
        this.setState({
          items  : elts,
        });
      }).catch(function(err) {
          console.log("Fetch error: ", err);
      });
  }

  handleChange (selectedOption) {
    this.setState({
      val: selectedOption
    });
    if (this.props.onChange) {
      this.props.onChange(this.props.row, this.props.level, selectedOption);
    }
  }

  componentDidMount() {
    this.getOptions();
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    const that = this;
    if (prevProps.parent !== this.props.parent) {
      this.setState({
        items: [],
        val: ""
      });
      this.getOptions();
    }
    if (this.props.value && typeof this.props.value === 'string' && this.state.status === 'initial') {
      if (this.state.items.length) {
        this.state.items.forEach(function (item) {
          if (item.pcode === that.props.value) {
            that.setState({
              val: item,
              status: 'ready'
            });
          }
        });
      }
    }
    if (this.props.value && typeof this.props.value === 'object' && this.state.val !== this.props.value) {
      this.setState({
        val: this.props.value,
        status: 'ready'
      });
    }
  }

  render() {
    if (this.state.items.length > 0) {
      return (
        <MaterialSelect
          id="locations"
          name="locations"
          onChange={this.handleChange}
          options={this.state.items}
          value={this.state.val}
          getOptionValue={(option) => {return option.pcode}}
          getOptionLabel={(option) => {return option.label}}
          className={this.props.className}/>
      );
    }
    else {
      return ('');
    }
  }
}

export default HRInfoLocation;
