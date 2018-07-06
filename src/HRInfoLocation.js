import React from 'react';
import Select from 'react-select';
import HRInfoAPI from './HRInfoAPI';

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
    params.sort = 'label';
    params['filter[admin_level]'] = this.props.level;
    if (this.props.parent) {
      params['filter[parent]'] = this.props.parent;
    }

    return this.hrinfoAPI
      .getAll('locations', params)
      .then(elts => {
        this.setState({
          items: elts,
          status: 'ready'
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
        items: []
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
    if (this.props.value && typeof this.props.value === 'object' && this.state.status === 'initial') {
      this.setState({
        val: this.props.value,
        status: 'ready'
      });
    }
  }

  render() {
    return (
        <Select
          id="locations"
          name="locations"
          onChange={this.handleChange}
          options={this.state.items}
          getOptionValue={(option) => { return option.id }}
          getOptionLabel={(option) => { return option.label}}
          value={this.state.val}
          className={this.props.className} />
    );
  }
}

export default HRInfoLocation;
