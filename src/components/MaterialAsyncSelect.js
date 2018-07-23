/* eslint-disable react/prop-types */

import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import CircularProgress from '@material-ui/core/CircularProgress';
import { components } from 'react-select';
import AsyncSelect from 'react-select/lib/Async';

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
      components={{
        Option: Option,
        DropdownIndicator: DropdownIndicator,
		ClearIndicator: ClearIndicator,
		IndicatorSeparator: null,
		LoadingIndicator: LoadingIndicator,
		Placeholder: () => {return (null);}
      }}
	  noOptionsMessage={() => <Typography>{'No results found (type at least one character)'}</Typography>}
	  loadingMessage={() => <Typography>{'Loading...'}</Typography>}
      styles={customStyles}
      isClearable={true}
	  isMulti
	  getOptionValue={(option) => { return option.id }}
      getOptionLabel={(option) => { return option.label}}
	  value={props.value}
      {...other}
    />
  );
}

const ITEM_HEIGHT = 48;

const styles = theme => ({
  root: {
    flexGrow: 1,
    height: 200
  },
  chip: {
    margin: theme.spacing.unit / 4
  }
});

const customStyles = {
  control: () => ({
    display: "flex",
    alignItems: "center",
    border: 0,
    height: "auto",
    background: "transparent",
    "&:hover": {
      boxShadow: "none"
    }
  }),
  menu: () => ({
    backgroundColor: "white",
    boxShadow: "1px 2px 6px #888888", // should be changed as material-ui
    position: "absolute",
    left: 0,
    top: `calc(100% + 1px)`,
    width: "100%",
    zIndex: 2,
    maxHeight: ITEM_HEIGHT * 4.5
  }),
  menuList: () => ({
    maxHeight: ITEM_HEIGHT * 4.5,
    overflowY: "auto"
  }),
  multiValueLabel: (base) => ({
	  ...base,
	  whiteSpace: "normal"
  })
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
				  value: this.props.value
	            },
	          }}
	        />
	    );
  }
}

export default withStyles(styles)(MaterialAsyncSelect);
