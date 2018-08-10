import React from 'react';
import MaterialAsyncSelect from '../components/MaterialAsyncSelect';
import HRInfoAPI from '../api/HRInfoAPI';

class HRInfoAsyncSelect extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      items: []
    };
    this.hrinfoAPI = new HRInfoAPI();
    this.getOptions = this.getOptions.bind(this);
  }

  getOptions (input) {
    const type = this.props.type;
    let params = {};
    if (type === 'organizations') {
      params.search = input;
    }
    else {
      params['filter[label][value]'] = input;
      params['filter[label][operator]'] = 'CONTAINS';
    }
    params.fields = this.props.fields ? this.props.fields : 'id,label,acronym';
    params.sort = 'label';
    params.range = 10;
    return this.hrinfoAPI
      .get(type, params)
      .then(data => {
		  let fullLabels = [];
		  data.data.forEach(function (elt) {
			  if (type === 'organizations' && elt.acronym) {
				  elt.label = elt.label + ' (' + elt.acronym + ')';
			  }
        if (type === 'bundles' && elt.operation) {
          elt.label = elt.label + ' (' + elt.operation[0].label + ')';
        }
			  fullLabels.push(elt);
		  });
		  return fullLabels;
      }).catch(function(err) {
          console.log("Fetch error: ", err);
      });
  }

  render() {
    return (
      <MaterialAsyncSelect
        isMulti={this.props.isMulti}
        loadOptions={this.getOptions}
        onChange={this.props.onChange}
        value={this.props.value}
        className={this.props.className}
        />
    );
  }
}

export default HRInfoAsyncSelect;
