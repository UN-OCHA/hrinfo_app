/* eslint-disable react/prop-types */

import React from 'react';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import Select, { components } from 'react-select';

import KeyboardArrowDown from '@material-ui/icons/KeyboardArrowDown';
import Clear from '@material-ui/icons/Clear';

class Option extends React.Component {
  	handleClick = event => {
    	this.props.selectOption(this.props.data, event);
  	};

  	render() {
    	const { children, isFocused, isSelected, onFocus } = this.props;

    	return (
      		<MenuItem
        		onFocus={onFocus}
        		selected={isFocused}
        		onClick={this.handleClick}
        		component="div"
		        style={{
          			fontWeight: isSelected ? 500 : 400,
        		}}
            key={this.props.data.id}
      		>
        		{children}
      		</MenuItem>
    	);
  	}
}

const DropdownIndicator = (props) => {
  	return components.DropdownIndicator && (
    	<components.DropdownIndicator {...props}>
			<KeyboardArrowDown color="primary" style={{cursor: 'pointer'}}/>
    	</components.DropdownIndicator>
  	);
}

const ClearIndicator = (props) => {
  	return components.ClearIndicator && (
    	<components.DropdownIndicator {...props}>
			<Clear color="primary" fontSize="inherit" style={{cursor: 'pointer'}}/>
    	</components.DropdownIndicator>
  	);
}

function SelectWrapped(props) {
  const { classes, ...other } = props;
  return (
	<Select
      components={{
        Option: Option,
        DropdownIndicator: DropdownIndicator,
    		ClearIndicator: ClearIndicator,
    		IndicatorSeparator: null,
    		Placeholder: () => {return (null);}
      }}
      styles={customStyles}
  	  pageSize={2}
  	  noOptionsMessage={() => <Typography>{'No results found'}</Typography>}
      className=""
      classNamePrefix=""
      isClearable={true}
  	  isMulti={props.isMulti}
  	  getOptionValue={(option) => { if (props.getOptionValue) { return props.getOptionValue(option) } else { return option.id } }}
  	  getOptionLabel={(option) => { if (props.getOptionLabel) { return props.getOptionLabel(option) } else { return option.label } }}
  	  value={props.value}
      {...other}
    />
  );
}

const customStyles = {
  control: (provided, state) => ({
    ...provided,
    border: 0,
    boxShadow: 'none',
  }),
};

class MaterialSelect extends React.Component {
	constructor(props) {
      	super(props);
      	this.handleChange = this.handleChange.bind(this);
    }


  	handleChange (selectedOption) {
	  	if (this.props.onChange) {
	       	this.props.onChange(selectedOption);
	  	}
  	};

  	render() {
	    return (
	        <TextField
	          fullWidth
	          onChange={this.handleChange}
	          placeholder={this.props.placeholder}
	          name={this.props.id}
	          label={this.props.label}
	          InputLabelProps={{
	            shrink: true,
	          }}
	          InputProps={{
	            inputComponent: SelectWrapped,
	            inputProps: {
	              isMulti: this.props.isMulti,
	              instanceId: this.props.id,
	              id: this.props.id,
	              simpleValue: true,
	              options: this.props.options,
				        value: this.props.value || "",
                getOptionValue: this.props.getOptionValue,
                getOptionLabel: this.props.getOptionLabel
	            },
	          }}
	        />
	    );
  }
}

export default MaterialSelect;
