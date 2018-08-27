import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import Chip from '@material-ui/core/Chip';
import MomentUtils from 'material-ui-pickers/utils/moment-utils';
import MuiPickersUtilsProvider from 'material-ui-pickers/utils/MuiPickersUtilsProvider';
import DatePicker from 'material-ui-pickers/DatePicker';

import HidSelect from './HidSelect';
import HidAsyncSelect from './HidAsyncSelect';
import HRInfoSelect from './HRInfoSelect';
import HRInfoAsyncSelect from './HRInfoAsyncSelect';
import UserType from './UserType';
import OrganizationType from './OrganizationType';
import HRInfoLocation from './HRInfoLocation';
import ContactSort from './ContactSort';

const styles = theme => ({
  list: {
    width: 250
  }
});

class FiltersDrawer extends React.Component {

    render() {
      const { classes, contentType, spaceType, filters, toggleDrawer, drawerState} = this.props;

      return (
        <Drawer open={drawerState} onClose={toggleDrawer}>
          <div className={classes.list}>
            { (contentType === 'documents' || contentType === 'infographics')
              ? <FormControl fullWidth margin="normal">
                  <FormLabel>
    							  { contentType === 'documents'
    		              ? 'Filter by Document type'
    		              : 'Filter by Infographic type' }
                  </FormLabel>
    		            {
                      contentType === 'documents'
                      ? <HRInfoSelect type='document_types'
                          onChange={(s) => this.props.setFilter('document_type', s)}
                          value={filters.document_type} />
                      : <HRInfoSelect type='infographic_types'
                          onChange={(s) => this.props.setFilter('infographic_type', s)}
                          value={filters.infographic_type} />
                    }
    		        </FormControl> : ''
            }
            { contentType !== 'users' ?
              <FormControl fullWidth margin="normal">
                <FormLabel>Filter by Organization(s)</FormLabel>
                <HRInfoAsyncSelect type="organizations" isMulti={true}
                  onChange={(s) => this.props.setFilter('organizations', s)}
                  value={filters.organizations}/>
              </FormControl> : ''
            }
            { contentType === 'users'
              ? <FormControl fullWidth margin="normal">
        				<FormLabel>Filter by Organization Type</FormLabel>
        				<OrganizationType
        					onChange={(s) => this.props.setFilter('organization_type', s)}
        					value={filters.organization_type}/>
        			</FormControl> : ''
            }
            { contentType === 'users'
              ? <FormControl fullWidth margin="normal">
        				<FormLabel>Filter by Organization(s)</FormLabel>
        				<HidAsyncSelect
        					type="organization"
        					onChange={(s) => this.props.setFilter('organization', s)}
        					value={filters.organization}/>
        			</FormControl> : ''
            }

            { spaceType === 'operation' && contentType !== 'users'
              ? <FormControl fullWidth margin="normal">
      					   <FormLabel>Filter by Clusters/Sectors</FormLabel>
                   <HRInfoSelect
          						type="bundles"
          						spaces={this.props.doc ? this.props.doc : null}
          						isMulti={true}
          						onChange={(s) => this.props.setFilter('bundles', s)}
          						value={filters.bundles}/>
      				  </FormControl> : ''
            }
            { spaceType === 'operation' && contentType === 'users'
              ? <FormControl fullWidth margin="normal">
        				<FormLabel>Filter by Clusters/Sectors</FormLabel>
        				<HidSelect
        					type="bundle"
        					operation={this.props.doc ? this.props.doc.id : null}
        					onChange={(s) => this.props.setFilter('bundles', s)}
        					value={filters.bundles}/>
        			</FormControl> : ''
            }
            { spaceType === 'operation' && contentType !== 'users'
              ? <FormControl fullWidth margin="normal">
        				<FormLabel>Filter by Coordination hub(s)</FormLabel>
        				<HRInfoSelect
        					type="offices"
        					spaces={this.props.doc ? this.props.doc : null}
        					isMulti={true}
        					onChange={(s) => this.props.setFilter('offices', s)}
        					value={filters.offices}/>
        			</FormControl> : ''
            }
            { spaceType === 'operation' && contentType === 'users'
              ? <FormControl fullWidth margin="normal">
        				<FormLabel>Filter by Coordination hub(s)</FormLabel>
        				<HidSelect
        					type="office"
        					operation={this.props.doc ? this.props.doc.id : null}
        					onChange={(s) => this.props.setFilter('offices', s)}
        					value={filters.offices}/>
        			</FormControl> : ''
            }
            { contentType === 'users'
              ? <FormControl fullWidth margin="normal">
        				<FormLabel>Filter by Country</FormLabel>
                <HRInfoLocation
                  level="0"
                  onChange={(row, level, opt) => this.props.setFilter('country', opt)}
                  value={filters.country}/>
        			</FormControl> : ''
            }
            { contentType !== 'users' ?
              <FormControl fullWidth margin="normal">
                <FormLabel>Filter by Theme(s)</FormLabel>
                <HRInfoSelect type="themes"
                  isMulti={true}
                  onChange={(s) => this.props.setFilter('themes', s)}
  								value={filters.themes}
                  id="themes"/>
              </FormControl> : ''
            }
            { spaceType === 'operation' && contentType !== 'users'
              ? <FormControl fullWidth margin="normal">
      					<FormLabel>Filter by Disaster</FormLabel>
      					<HRInfoSelect
      						type="disasters"
      						spaces={this.props.doc ? this.props.doc : null}
      						isMulti={true}
      						onChange={(s) => this.props.setFilter('disasters', s)}
      						value={filters.disasters}/>
      				</FormControl> : ''
            }
            { spaceType === 'operation' && contentType === 'users'
              ? <FormControl fullWidth margin="normal">
      					<FormLabel>Filter by Disaster</FormLabel>
      					<HidSelect
      						type="disaster"
      						operation={this.props.doc ? this.props.doc.id : null}
      						onChange={(s) => this.props.setFilter('disasters', s)}
      						value={filters.disasters}/>
      				</FormControl> : ''
            }
            { (contentType === 'documents' || contentType === 'infographics')
              ? <FormControl fullWidth margin="normal">
                  <FormLabel>Published After</FormLabel>
                  <MuiPickersUtilsProvider utils={MomentUtils}>
                    <DatePicker
                      id="publication_date_after"
                      name="publication_date_aftre"
                      format="DD/MM/YYYY"
                      value={filters.publication_date_after ? filters.publication_date_after : ''}
                      invalidLabel=""
                      onChange={(s) => this.props.setFilter('publication_date_after', s)}
                      leftArrowIcon={<i className="icon-arrow-left" />}
                      rightArrowIcon={<i className="icon-arrow-right" />}
                    />
                  </MuiPickersUtilsProvider>
    		        </FormControl> : ''
            }
            { (contentType === 'documents' || contentType === 'infographics')
              ? <FormControl fullWidth margin="normal">
                  <FormLabel>Published Before</FormLabel>
                  <MuiPickersUtilsProvider utils={MomentUtils}>
                    <DatePicker
                      id="publication_date_before"
                      name="publication_date_before"
                      format="DD/MM/YYYY"
                      value={filters.publication_date_before ? filters.publication_date_before : ''}
                      invalidLabel=""
                      onChange={(s) => this.props.setFilter('publication_date_before', s)}
                      leftArrowIcon={<i className="icon-arrow-left" />}
                      rightArrowIcon={<i className="icon-arrow-right" />}
                    />
                  </MuiPickersUtilsProvider>
    		        </FormControl> : ''
            }

            { (contentType === 'users')
              ? <FormControl fullWidth margin="normal">
      					<FormLabel>Role</FormLabel>
      					<HidSelect
                  type='functional_role'
      						onChange={(s) => this.props.setFilter('functional_roles', s)}
      						value={filters.functional_roles}/>
      				</FormControl> : ''}

            { (contentType === 'users')
              ? <FormControl fullWidth margin="normal">
      					<FormLabel>Type of User</FormLabel>
      					<UserType
      						onChange={(s) => this.props.setFilter('user_type', s)}
      						value={filters.user_type}/>
      				</FormControl> : ''}

            { (contentType === 'users')
              ? <FormControl fullWidth margin="normal">
      					<FormLabel>Sort by</FormLabel>
      					<ContactSort
      						onChange={(s) => this.props.setFilter('sort', s)}
      						value={filters.sort}/>
      				</FormControl> : ''}
          </div>
        </Drawer>
      );
    }
}

FiltersDrawer.propTypes = {
  classes: PropTypes.object.isRequired
};

class FilterChips extends React.Component {
  render () {
    const {filters, removeFilter} = this.props;

    const chips = Object.keys(filters).map(key => {
      if (Array.isArray(filters[key])) {
        return filters[key].map (prop => {
          return (<Chip key={key + '_' + prop.id} label={prop.label} onDelete={() => {removeFilter(key, prop)}} />);
        });
      }
      else {
        if (key === 'publication_date_before' || key === 'publication_date_after') {
          let label = 'Published before: ';
          if (key === 'publication_date_after') {
            label = 'Published after: ';
          }
          return (<Chip key={key + '_' + filters[key].id} label={label + filters[key].toDateString()} onDelete={() => {removeFilter(key, filters[key])}} />);
        }
        else if (key === 'sort') {
          return '';
        }
        else {
          return (<Chip key={key + '_' + filters[key].id} label={filters[key].label} onDelete={() => {removeFilter(key, filters[key])}} />);
        }
      }
    });

    return (
      <span>{chips}</span>
    )
  }
}

const Filters = withStyles(styles)(FiltersDrawer);

export {Filters, FilterChips};
