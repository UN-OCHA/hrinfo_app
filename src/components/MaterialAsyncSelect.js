/* eslint-disable react/prop-types */

import React from 'react';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import CircularProgress from '@material-ui/core/CircularProgress';
import { components } from 'react-select';
import AsyncSelect from 'react-select/async';

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
  	return components.DropdownIndicator && (
    	<components.DropdownIndicator {...props}>
			<Clear color="primary" fontSize="inherit" style={{cursor: 'pointer'}}/>
    	</components.DropdownIndicator>
  	);
}

const LoadingIndicator = (props) => {
  	return (
    	<CircularProgress size={20}/>
  	);
}

function SelectWrapped(props) {
  const { classes, ...other } = props;
  return (
	<AsyncSelect
    className=""
    classNamePrefix=""
    components={{
      Option: Option,
      DropdownIndicator: DropdownIndicator,
	    ClearIndicator: ClearIndicator,
	    IndicatorSeparator: null,
	    LoadingIndicator: LoadingIndicator,
	    Placeholder: () => {return (null);}
    }}
    styles={customStyles}
    noOptionsMessage={() => <Typography>{'Type at least one character to see results'}</Typography>}
    loadingMessage={() => <Typography>{'Loading...'}</Typography>}
    isClearable={true}
    isMulti={props.isMulti}
    getOptionValue={(option) => { if (props.getOptionValue) { return props.getOptionValue(option) } else { return option.id } }}
    getOptionLabel={(option) => { if (props.getOptionLabel) {return props.getOptionLabel(option)} else {return option.label}}}
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

class MaterialAsyncSelect extends React.Component {
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
	              loadOptions: this.props.loadOptions,
                getOptionLabel: this.props.getOptionLabel,
                getOptionValue: this.props.getOptionValue,
				        value: this.props.value,
                cacheOptions: this.props.cacheOptions ? this.props.cacheOptions : true
	            },
	          }}
	        />
	    );
  }
}

export default MaterialAsyncSelect;
