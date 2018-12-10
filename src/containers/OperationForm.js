import React from 'react';
import { translate } from 'react-i18next';
import HRInfoSelect from '../components/HRInfoSelect';
import HRInfoLocation from '../components/HRInfoLocation';
import HRInfoAsyncSelect from '../components/HRInfoAsyncSelect';
import HidContacts from '../components/HidContacts';
import StringSelect from '../components/StringSelect';
import LanguageSelect from '../components/LanguageSelect';
import SocialMedia from '../components/SocialMedia';

// Material Imports
import Grid             from '@material-ui/core/Grid';
import Snackbar         from '@material-ui/core/Snackbar';
import Typography       from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';
import Button           from '@material-ui/core/Button';
import FormControl      from '@material-ui/core/FormControl';
import FormLabel        from '@material-ui/core/FormLabel';
import TextField        from '@material-ui/core/TextField';
import FormHelperText   from '@material-ui/core/FormHelperText';

//Material date picker
import MomentUtils                    from 'material-ui-pickers/utils/moment-utils';
import MuiPickersUtilsProvider        from 'material-ui-pickers/utils/MuiPickersUtilsProvider';
import DatePicker                     from 'material-ui-pickers/DatePicker';

class OperationForm extends React.Component {
  constructor(props) {
    super(props);

    const {t} = this.props;

    this.state = {
      operationTypes: [
        { value: 'country', label: t('address.country')},
        { value: 'region', label: t('region')}
      ],
      statuses: [
        { value: 'active', label: t('operations.status.active')},
        { value: 'archived', label: t('operations.status.archived') },
        { value: 'inactive', label: t('operations.status.inactive') }
      ],
      hidAccesses: [
        { value: 'open', label: t('bundles.hid_access.open') },
        { value: 'closed', label: t('bundles.hid_access.closed') },
        { value: 'inactive', label: t('operations.status.inactive')}
      ],
    };
  }

  render() {
    const {t, i18n} = this.props;
    let title = t('operations.create') + ' [' + t('languages.' + i18n.languages[0]) + ']';
    if (this.props.doc.id) {
      title = t('edit') + ' ' + this.props.doc.label + ' [' + t('languages.' + i18n.languages[0]) + ']';
    }
    return (
      <Grid container direction="column" alignItems="center">
        <Typography color="textSecondary" gutterBottom variant="headline">{title}</Typography>
        <Grid item>
          <Grid container justify="space-around">
            <Grid item md={6} xs={11}>
              {/* Title */}
              <FormControl required fullWidth margin = "normal">
                <FormLabel focused htmlFor="label" error={this.props.status === 'was-validated' && !this.props.isValid(this.props.doc.label)}>{t('title')}</FormLabel>
                <TextField type     = "text"
                           name     = "label"
                           id       = "label"
                           value    = {this.props.doc.label}
                           onChange = {this.props.handleInputChange}/>
                <FormHelperText id = "label-text">
                  {t('operations.helpers.title')}
                </FormHelperText>
              </FormControl>

              {/* Language */}
               <FormControl required fullWidth margin="normal">
                 <FormLabel focused htmlFor="language" error={this.props.status === 'was-validated' && !this.props.isValid(this.props.doc.language)}>{t('language')}</FormLabel>
                 <LanguageSelect id        = "language"
                                 value     = {this.props.doc.language}
                                 onChange  = {(s) => this.props.handleSelectChange('language', s)}
                                 className = {this.props.isValid(this.props.doc.language) ? 'is-valid' : 'is-invalid'}/>
                 <FormHelperText id="language-text">
                   {t('operations.helpers.language')}
                 </FormHelperText>
               </FormControl>

              {/* Type */}
              <FormControl required fullWidth margin = "normal">
                <FormLabel focused htmlFor="type" error={this.props.status === 'was-validated' && !this.props.isValid(this.props.doc.type)}>{t('type')}</FormLabel>
                <StringSelect id        = "type"
                              name      = "type"
                              options   = {this.state.operationTypes}
                              value     = {this.props.doc.type}
                              onChange  = {(s) => this.props.handleSelectChange('type', s)}
                              className = {this.props.isValid(this.props.doc.type) ? 'is-valid' : 'is-invalid'}/>
                <FormHelperText id="label-type">
                  {t('operations.helpers.type')}
                </FormHelperText>
              </FormControl>

              {/* Region */}
              <FormControl fullWidth margin = "normal">
                <FormLabel htmlFor="region">{t('region')}</FormLabel>
                <HRInfoSelect id       = "region"
                              type     = "operations"
                              onChange = {(s) => this.props.handleSelectChange('region', s)}
                              value    = {this.props.doc.region} />
              </FormControl>

              {/* Country */}
              <FormControl fullWidth margin = "normal">
                <FormLabel htmlFor="country">{t('address.country')}</FormLabel>
                <HRInfoLocation id       = "country"
                                onChange = {(s) => this.props.handleSelectChange('country', s)}
                                value    = {this.props.doc.country}
                                level    = {0} />
              </FormControl>

              {/* Status */}
              <FormControl fullWidth margin = "normal">
                <FormLabel htmlFor="status">{t('status')}</FormLabel>
                <StringSelect id       = "status"
                              name     = "status"
                              options  = {this.state.statuses}
                              value    = {this.props.doc.status}
                              onChange = {(s) => this.props.handleSelectChange('status', s)} />
              </FormControl>

              {/* Launch Date */}
              <FormControl fullWidth margin = "normal">
                <FormLabel htmlFor="launch_date">{t('launch_date')}</FormLabel>
                  <MuiPickersUtilsProvider utils={MomentUtils}>
                    <DatePicker
                      id             = "launch_date"
                      name           = "launch_date"
                      format         = "DD/MM/YYYY"
                      value          = {this.props.doc.launch_date ? this.props.doc.launch_date : ''}
                      invalidLabel   = ""
                      autoOk
                      onChange       = {(s) => this.props.handleSelectChange('launch_date', s)}
                      leftArrowIcon  = {<i className="icon-arrow-left" />}
                      rightArrowIcon = {<i className="icon-arrow-right" />}
                    />
                  </MuiPickersUtilsProvider>
              </FormControl>

            </Grid>

            <Grid item md={3} xs={11}>
              <FormControl fullWidth margin = "normal">
                <FormLabel htmlFor="cluster_configuration">{t('cluster_configuration')}</FormLabel>
                <HRInfoAsyncSelect type="documents"
                                   id="cluster_configuration"
                                   onChange={(s) => this.props.handleSelectChange('cluster_configuration', s)}
                                   value={this.props.doc.cluster_configuration} />
              </FormControl>

              <FormControl fullWidth margin = "normal">
                <FormLabel htmlFor="url">{t('website')}</FormLabel>
                <TextField type="url"
                           id="url"
                           name="url"
                           value={this.props.doc.url || ""}
                           onChange={this.props.handleInputChange} />
              </FormControl>

              <FormControl fullWidth margin = "normal">
                <FormLabel htmlFor="email">{t('email')}</FormLabel>
                <TextField type="email"
                           id="email"
                           name="email"
                           value={this.props.doc.email || ""}
                           onChange={this.props.handleInputChange} />
              </FormControl>

              <FormControl fullWidth margin = "normal">
                <FormLabel htmlFor="managed_by">{t('managed_by')}</FormLabel>
                <HRInfoAsyncSelect type="organizations"
                                   id="managed_by"
                                   onChange={(s) => this.props.handleSelectChange('managed_by', s)}
                                   value={this.props.doc.managed_by} />
              </FormControl>

              <FormControl fullWidth margin = "normal">
                <FormLabel htmlFor="focal_points">{t('focal_points')}</FormLabel>
                <HidContacts isMulti={true}
                             id="focal_points"
                             onChange={(s) => this.props.handleSelectChange('focal_points', s)}
                             value={this.props.doc.focal_points} />
              </FormControl>

              <FormControl fullWidth margin = "normal">
                <FormLabel htmlFor="social_media">{t('social_media')}</FormLabel>
                <SocialMedia onChange={(s) => this.props.handleSelectChange('social_media', s)}
  									            value={this.props.doc.social_media}
								                id="social_media"/>
              </FormControl>

              <FormControl fullWidth margin = "normal">
                <FormLabel htmlFor="hid_access">{t('operations.secure_hid')}</FormLabel>
                <StringSelect id="hid_access"
                              name="hid_access"
                              options={this.state.hidAccesses}
                              value={this.props.doc.hid_access}
                              onChange={(s) => this.props.handleSelectChange('hid_access', s)} />
              </FormControl>
            </Grid>
          </Grid>
        </Grid>

        <Grid item className="submission">
          {
            this.props.status !== 'submitting' &&
            <span>
              <Button color="primary" variant="contained" onClick={(evt) => {this.props.handleSubmit(evt)}}>{t('publish')}</Button>
                &nbsp;
              <Button color="secondary" variant="contained" onClick={(evt) => {this.props.handleSubmit(evt, 1)}}>{t('save_as_draft')}</Button>
                &nbsp;
            </span>
          }
          {(this.props.status === 'submitting' || this.props.status === 'deleting') &&
            <CircularProgress />
          }
          {(this.props.match.params.id && this.props.status !== 'deleting') &&
            <span>
              <Button color="secondary" variant="contained" onClick={this.props.handleDelete}>{t('delete')}</Button>
            </span>
          }
        </Grid>

        <Snackbar anchorOrigin={{
            vertical   : 'bottom',
            horizontal : 'left'
          }}
          open             = {this.props.status === 'was-validated' && this.state.wasSubmitted}
          autoHideDuration = {6000}
          onClose          = {this.hideAlert}
          ContentProps     = {{
            'aria-describedby' : 'message-id'
          }}
          message  = {<Typography id ="message-id" color="error">{t('form_incomplete')}</Typography>}
          action   = {[
            <Button key="undo" color="secondary" size="small" onClick={this.hideAlert}>
            {t('close')}
            </Button>
          ]}
        />
      </Grid>
    );
  }
}

export default translate('forms')(OperationForm);
