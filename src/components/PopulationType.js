import React from 'react';
import MaterialSelect from './MaterialSelect';

class PopulationType extends React.Component {

  state = {
    options: [
      { value: 1045, label: 'Adolescents'},
      { value: 1035, label: 'All affected population' },
      { value: 1047, label: 'Babies'},
      { value: 1046, label: 'Boys'},
      { value: 1050, label: 'Camp population'},
      { value: 1029, label: 'Children'},
      { value: 1048, label: 'Children under 5'},
      { value: 1038, label: 'Conflict affected population'},
      { value: 1030, label: 'Displaced population'},
      { value: 1031, label: 'Elderly'},
      { value: 1032, label: 'Families who have lost primary caregiver'},
      { value: 1044, label: 'Girls'},
      { value: 1033, label: 'Host communities'},
      { value: 1049, label: 'IDPs'},
      { value: 1040, label: 'Lactating women'},
      { value: 1025, label: 'Marginalised groups'},
      { value: 1034, label: 'Men'},
      { value: 1026, label: 'Other'},
      { value: 1027, label: 'Pastoralists'},
      { value: 1055, label: 'People living with HIV'},
      { value: 1056, label: 'People with disabilities'},
      { value: 1041, label: 'Post partum women (up to 6 weeks)'},
      { value: 1042, label: 'Pregnant women'},
      { value: 1053, label: 'Refugees'},
      { value: 1052, label: 'Returnees'},
      { value: 1037, label: 'Teachers'},
      { value: 1028, label: 'Women'},
    ]
  };

  render() {
    return (
        <MaterialSelect
          id        = "populationType"
          name      = "populationType"
          onChange  = {this.props.onChange}
          options   = {this.state.options}
          value     = {this.props.value}
          className = {this.props.className} />
    );
  }
}

export default PopulationType;
