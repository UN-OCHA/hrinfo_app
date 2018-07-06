import React from 'react';
import Select from 'react-select';
import HRInfoAPI from './HRInfoAPI';

class HRInfoSelect extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      items: []
    };
    this.hrinfoAPI = new HRInfoAPI();
    this.getOptions = this.getOptions.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  getOptions (type, operationId, operationLabel) {
    let params = {};
    params.sort = 'label';
    if (type !== 'document_types' && type !== 'infographic_types') {
      params.fields = 'id,label,operation';
    }
    if (operationId) {
      params['filter[operation]'] = operationId;
    }
    return this.hrinfoAPI
      .getAll(type, params)
      .then(elts => {
        let pushed = [];
        let items = this.state.items;
        if (type === 'document_types' || type === 'infographic_types') {
          elts.forEach(function (elt) {
            if (elt.parent.length === 1) {
              elt.label = elt.parent[0].label + " > " + elt.label;
              pushed.push(elt);
            }
            else {
              pushed.push(elt);
            }
          });
        }
        else if (type === 'bundles' || type === 'offices') {
          elts.forEach(function (elt) {
            elt.label = elt.label + " (" + operationLabel + ")";
            pushed.push(elt);
          });
        }
        else {
          pushed = elts;
          pushed = pushed.map(function (val) {
            val.type = type;
            return val;
          });
        }
        this.setState({
          items: items.concat(pushed).sort(function (a, b) {
            if (a.label < b.label) {
              return -1;
            }
            if (a.label > b.label) {
              return 1;
            }
            return 0;
          })
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
    if (this.props.spaces) {
      const that = this;
      this.props.spaces.forEach(function (space) {
        if (space.type === 'operations') {
          that.getOptions(that.props.type, space.id, space.label);
        }
      });
    }
    else {
      this.getOptions(this.props.type);
    }
    if (this.props.type === 'spaces') {
      this.getOptions('operations');
    }
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if ((this.props.type === 'document_types' || this.props.type === 'infographic_types') && this.props.value) {
      for (let i = 0; i < this.state.items.length; i++) {
        if (this.state.items[i].id === parseInt(this.props.value.id, 10)) {
          this.props.value.label = this.state.items[i].label;
        }
      }
    }
    if (JSON.stringify(prevProps.spaces) !== JSON.stringify(this.props.spaces)) {
      this.setState({
        items: []
      });
      const that = this;
      this.props.spaces.forEach(function (space) {
        if (space.type === 'operations') {
          that.getOptions(that.props.type, space.id, space.label);
        }
      });
    }
  }

  render() {
    return (
        <Select
          isMulti={this.props.isMulti}
          id={this.props.type}
          name={this.props.type}
          onChange={this.handleChange}
          options={this.state.items}
          getOptionValue={(option) => { return option.id }}
          getOptionLabel={(option) => { return option.label}}
          value={this.props.value} />
    );
  }
}

export default HRInfoSelect;
