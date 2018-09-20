import React from 'react';
import MaterialSelect from '../components/MaterialSelect';
import HRInfoAPI from '../api/HRInfoAPI';

class HRInfoSelect extends React.Component {
  state = {
    items: []
  };

  hrinfoAPI = new HRInfoAPI();

  getOptions = (type, operationId, operationLabel) => {
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
          console.log("27");
          elts.forEach(function (elt) {
            elt.value = elt.label;
            if (elt.parent.length === 1) {
              console.log("31");
              elt.label = elt.parent[0].label + " > " + elt.label;
              pushed.push(elt);
            }
            else {
              console.log("36");
              pushed.push(elt);
            }
          });
        }
        else if (type === 'bundles' || type === 'offices') {
          console.log("40");
          elts.forEach(function (elt) {
            elt.label = elt.label + " (" + operationLabel + ")";
            elt.value = elt.label;
            pushed.push(elt);
          });
        }
        else {
          let user = JSON.parse(localStorage.getItem('hid-user'));
          console.log("50", user.hrinfo);
          if ((type === 'spaces' || type === 'operations' || type === 'bundles') && user.hrinfo.roles.indexOf('administrator') === -1) {
            console.log("53", elts, user.hrinfo.spaces);
            elts.forEach(function (elt) {
              if (user.hrinfo.spaces && user.hrinfo.spaces[elt.id] && user.hrinfo.spaces[elt.id].indexOf('manager') !== -1) {
                pushed.push(elt);
              }
            });
          }
          else {
            console.log("61", elts);
            pushed = elts;
          }
          pushed = pushed.map(function (val) {
            val.type = type;
            val.value = val.label;
            return val;
          });
        }
        console.log(type, pushed);
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
  };

  componentDidMount() {
    if (this.props.options) {
      this.setState({
        items: this.props.options
      });
    }
    else
    {
      if (this.props.spaces) {
        const that = this;
        if (Array.isArray(this.props.spaces)) {
          this.props.spaces.forEach(function (space) {
            if (space.type === 'operations') {
              that.getOptions(that.props.type, space.id, space.label);
            }
          });
        }
        else {
          this.getOptions(this.props.type, this.props.spaces.id, this.props.spaces.label);
        }
      }
      else {
        this.getOptions(this.props.type);
      }
      if (this.props.type === 'spaces') {
        this.getOptions('operations');
      }
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
        <MaterialSelect
          isMulti={this.props.isMulti}
          id={this.props.type}
          name={this.props.type}
          onChange={this.props.onChange}
          options={this.state.items}
          value={this.props.value} />
    );
  }
}

export default HRInfoSelect;
