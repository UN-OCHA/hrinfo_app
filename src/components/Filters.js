import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import Chip from '@material-ui/core/Chip';
import MomentUtils from '@date-io/moment';
import MuiPickersUtilsProvider from 'material-ui-pickers/MuiPickersUtilsProvider';
import DatePicker from 'material-ui-pickers/DatePicker';

import HidSelect from './HidSelect';
import HidAsyncSelect from './HidAsyncSelect';
import HRInfoSelect from './HRInfoSelect';
import HRInfoAsyncSelect from './HRInfoAsyncSelect';
import UserType from './UserType';
import OrganizationType from './OrganizationType';
import HRInfoLocation from './HRInfoLocation';
import ContactSort from './ContactSort';
import AssessmentStatus from './AssessmentStatus';
import PopulationType from './PopulationType';
import GeographicLevel from './GeographicLevel';

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
            { contentType === 'assessments' ?
              <FormControl fullWidth margin="normal">
                <FormLabel>Filter by Participating Organization(s)</FormLabel>
                <HRInfoAsyncSelect type="organizations" isMulti={true}
                  onChange={(s) => this.props.setFilter('participating_organizations', s)}
                  value={filters.participating_organizations}/>
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

              { (contentType === 'assessments')
                ? <FormControl fullWidth margin="normal">
        					<FormLabel>Filter by Status</FormLabel>
        					<AssessmentStatus
        						onChange={(s) => this.props.setFilter('status', s)}
        						value={filters.status}/>
        				</FormControl> : ''}

                { (contentType === 'assessments')
                  ? <FormControl fullWidth margin="normal">
          					<FormLabel>Filter by Geographic Level</FormLabel>
          					<GeographicLevel
          						onChange={(s) => this.props.setFilter('geographic_level', s)}
          						value={filters.geographic_level}/>
          				</FormControl> : ''}

              { (contentType === 'assessments')
                ? <FormControl fullWidth margin="normal">
        					<FormLabel>Filter by Population Type</FormLabel>
        					<PopulationType
        						onChange={(s) => this.props.setFilter('population_types', s)}
        						value={filters.population_types}/>
        				</FormControl> : ''}

                { (contentType === 'assessments')
                  ? <FormControl fullWidth margin="normal">
                      <FormLabel>Start date after</FormLabel>
                      <MuiPickersUtilsProvider utils={MomentUtils}>
                        <DatePicker
                          id="date_after"
                          name="date_after"
                          format="DD/MM/YYYY"
                          value={filters.date_after ? filters.date_after : ''}
                          invalidLabel=""
                          onChange={(s) => this.props.setFilter('date_after', s)}
                          leftArrowIcon={<i className="icon-arrow-left" />}
                          rightArrowIcon={<i className="icon-arrow-right" />}
                        />
                      </MuiPickersUtilsProvider>
        		        </FormControl> : ''
                }
                { (contentType === 'assessments')
                  ? <FormControl fullWidth margin="normal">
                      <FormLabel>Start date before</FormLabel>
                      <MuiPickersUtilsProvider utils={MomentUtils}>
                        <DatePicker
                          id="date_before"
                          name="date_before"
                          format="DD/MM/YYYY"
                          value={filters.date_before ? filters.date_before : ''}
                          invalidLabel=""
                          onChange={(s) => this.props.setFilter('date_before', s)}
                          leftArrowIcon={<i className="icon-arrow-left" />}
                          rightArrowIcon={<i className="icon-arrow-right" />}
                        />
                      </MuiPickersUtilsProvider>
        		        </FormControl> : ''
                }
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
        if (key === 'publication_date_before' || key === 'publication_date_after' || key === 'date_after' || key === 'date_before') {
          let label = 'Published before: ';
          if (key === 'publication_date_after') {
            label = 'Published after: ';
          }
          else if (key === 'date_before') {
            label = 'Started before: ';
          }
          else if (key === 'date_after') {
            label = 'Started after: ';
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
