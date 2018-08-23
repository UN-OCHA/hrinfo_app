/* eslint-disable react/prop-types */

import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import CircularProgress from '@material-ui/core/CircularProgress';
import Button from '@material-ui/core/Button';
import { components } from 'react-select';
import AsyncSelect from 'react-select/lib/Async';

import InputAdornment from '@material-ui/core/InputAdornment';
import Search from '@material-ui/icons/Search';
import Clear from '@material-ui/icons/Clear';

import HRInfoAPI from '../api/HRInfoAPI';

const optionStyles = {
  button: {
    marginLeft: 'auto',
    marginRight: 0
  }
};

class Option extends React.Component {
  state = {
    isHover: false
  };

	handleClick = event => {
  	this.props.selectOption(this.props.data, event);
	};

	render() {
  	const { children, isFocused, isSelected, onFocus, classes, data } = this.props;
    let isHover = false;

  	return (
    		<MenuItem
      		onFocus={onFocus}
      		selected={isFocused}
      		onClick={this.handleClick}
      		component="div"
          onMouseEnter={(e) => this.setState({isHover: true})}
          onMouseLeave={(e) => this.setState({isHover: false})}
	        style={{
        			fontWeight: isSelected ? 500 : 400,
      		}}
    		>
      		{data.type === 'search' ? <Search /> : ''}
          {data.type === 'search' ? ' Search for ' : ''}
          {children}
          {this.state.isHover && data.type !== 'search' ? <Button variant="outlined" disabled className={classes.button}>Jump to</Button> : ''}
          {data.type === 'search' ? '...' : ''}
    		</MenuItem>
  	);
	}
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
      Option: withStyles(optionStyles)(Option),
      DropdownIndicator: () => {return null;},
		  ClearIndicator: ClearIndicator,
		  IndicatorSeparator: null,
		  LoadingIndicator: LoadingIndicator,
    }}
	  noOptionsMessage={() => <Typography>{'Type at least one character to see results'}</Typography>}
	  loadingMessage={() => <Typography>{'Loading...'}</Typography>}
    styles={customStyles}
    isClearable={true}
	  isMulti={false}
	  getOptionValue={(option) => { if (props.getOptionValue) { return props.getOptionValue(option) } else { return option.id } }}
    getOptionLabel={(option) => { if (props.getOptionLabel) {return props.getOptionLabel(option)} else {return option.label}}}
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

class SearchInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      options: []
    };
    this.hrinfoAPI = new HRInfoAPI();
    this.getOptions = this.getOptions.bind(this);
  }

  getOptions (input) {
    const that = this;
    let params = {};
    params['filter[label][value]'] = input;
    params['filter[label][operator]'] = 'CONTAINS';
    params.fields = 'id,label,operation.label';
    params.sort = 'label';
    params.range = 10;
    let fullLabels = [];
    if (input === '') {
      fullLabels.push({
        id: -1,
        label: input,
        type: 'search'
      });
      return fullLabels;
    }
    else {
      return this.hrinfoAPI
        .get('operations', params)
        .then(data => {
          fullLabels.push({
            id: -1,
            label: input,
            type: 'search'
          });
          Array.prototype.push.apply(fullLabels, data.data);
        })
        .then(() => {
          return that.hrinfoAPI.get('spaces', params);
        })
        .then(data => {
          Array.prototype.push.apply(fullLabels, data.data);
        })
        .then(() => {
          return that.hrinfoAPI.get('bundles', params);
        })
        .then(data => {
          data.data.forEach(function (elt) {
            if (elt.operation) {
              elt.label = elt.label + ' (' + elt.operation[0].label + ')';
            }
    			  fullLabels.push(elt);
    		  });
          return fullLabels;
        })
        .catch(function(err) {
            console.log("Fetch error: ", err);
        });
    }
  }

  render() {
    return (
        <TextField
          fullWidth
          onChange={this.props.onChange}
          InputLabelProps={{
            shrink: true,
          }}
          InputProps={{
            inputComponent: SelectWrapped,
            inputProps: {
              isMulti: false,
              instanceId: 'search',
              id: 'search',
              simpleValue: true,
              loadOptions: this.getOptions,
              value: this.props.value,
              getOptionLabel: this.props.getOptionLabel,
              getOptionValue: this.props.getOptionValue,
              placeholder: "Search or jump to...",
              cacheOptions: true
            },
            startAdornment: (
              <InputAdornment position = "start" >
                <Search />
              </InputAdornment>
            )
          }}
        />
    );
  }
}

export default SearchInput;
