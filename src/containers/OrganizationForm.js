import React      from 'react';
import { translate, Trans } from 'react-i18next';

//Components
import HRInfoSelect          from '../components/HRInfoSelect';

//Material plugin
import FormHelperText   from '@material-ui/core/FormHelperText';
import FormControl      from '@material-ui/core/FormControl';
import FormLabel        from '@material-ui/core/FormLabel';
import TextField        from '@material-ui/core/TextField';
import Button           from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import Grid             from '@material-ui/core/Grid';
import Snackbar         from '@material-ui/core/Snackbar';
import Typography       from '@material-ui/core/Typography';

//Material
import './EventForm.css';

class OrganizationForm extends React.Component {
  state = {
    wasSubmitted : false
  };

  hideAlert = () => {
    this.setState({ wasSubmitted: false });
  };

  submit = () => {
    this.setState({ wasSubmitted: true });
  };

  render() {
    const {t, i18n} = this.props;
    let title = t('form_organizations.create') + ' [' + t('languages.' + i18n.language) + ']';
    if (this.props.doc.id) {
      title = t('edit') + ' ' + this.props.doc.label + ' [' + t('languages.' + i18n.language) + ']';
    }
    return(
      <Grid container direction="column" alignItems="center">
        <Typography color="textSecondary" gutterBottom variant="headline">{title}</Typography>
        <Grid item>
          <Grid container justify="space-around">

            {/* LEFT COLUMN */}
            <Grid item md={6} xs={11}>

              {/* Name */}
              <FormControl required fullWidth margin="normal">
                <FormLabel focused error={this.props.status === 'was-validated' && !this.props.isValid(this.props.doc.label)}>{t('name')}</FormLabel>
                <TextField type = "text"
                  name     = "label"
                  id       = "label"
                  value    = {this.props.doc.label || ''}
                  onChange = {this.props.handleInputChange}/>
                <FormHelperText id = "label-text">
                  <Trans i18nKey={'form_organizations.helpers.name'}>Type the original name of the organization. Try not to use abbreviations. To see Standards and Naming Conventions click
                  <a href = "https://drive.google.com/open?id=1TxOek13c4uoYAQWqsYBhjppeYUwHZK7nhx5qgm1FALA" target="_blank" rel="noopener noreferrer"> here</a>.</Trans>
                  </FormHelperText>
                </FormControl>

                {/* Type */}
                <FormControl required fullWidth margin="normal">
                  <FormLabel focused error = {this.props.status === 'was-validated' && !this.props.isValid(this.props.doc.type)}>{t('type')}</FormLabel>
                  <HRInfoSelect type = "organization_types"
                    isMulti  = {false}
                    onChange = {(s) => this.props.handleSelectChange('type', s)}
                    value    = {this.props.doc.type || ''}/>
                  <FormHelperText id="type-text">
                    {t('form_organizations.helpers.type')}
                  </FormHelperText>
                </FormControl>

              </Grid>

              {/* RIGHT COLUMN */}
              <Grid item md={3} xs={11}>

                {/* Acronym */}
                <FormControl fullWidth margin="normal">
                  <FormLabel>{t('acronym')}</FormLabel>
                  <TextField type     = "text"
                             name     = "acronym"
                             id       = "acronym"
                             value    = {this.props.doc.acronym || ''}
                             onChange = {this.props.handleInputChange}/>
                </FormControl>

                {/* Website */}
                <FormControl fullWidth margin="normal">
                  <FormLabel>{t('website')}</FormLabel>
                  <TextField type     = "url"
                             name     = "homepage"
                             id       = "homepage"
                             value    = {this.props.doc.homepage || ''}
                             onChange = {this.props.handleInputChange}/>
                </FormControl>

                {/* FTS ID */}
                <FormControl fullWidth margin = "normal">
                  <FormLabel>{t('fts_id')}</FormLabel>
                  <TextField type     = "number"
                             name     = "fts_id"
                             id       = "fts_id"
                             value    = {this.props.doc.fts_id || ''}
                             onChange = {this.props.handleInputChange}/>
                </FormControl>

              </Grid>
            </Grid>
          </Grid>

          {/* SUBMISSION */}
          <Grid item className="submission">
            {
              this.props.status !== 'submitting' &&
              <span>
                <Button color="primary" variant="contained" onClick={(evt) => {this.props.handleSubmit(evt); this.submit()}}>{t('publish')}</Button>
                &nbsp;
              </span>
            }
            {
              (this.props.status === 'submitting' || this.props.status === 'deleting') &&
              <CircularProgress />
            }
            {
              (this.props.match.params.id && this.props.status !== 'deleting') &&
              <span>
                <Button color="secondary" variant="contained" onClick={this.props.handleDelete}>{t('delete')}</Button>
              </span>
            }
          </Grid>
          <Snackbar anchorOrigin    = {{
                                         vertical   : 'bottom',
                                         horizontal : 'left'
                                       }}
                    open             = {this.props.status === 'was-validated' && this.state.wasSubmitted}
                    autoHideDuration = {6000}
                    onClose          = {this.hideAlert}
                    ContentProps     = {{
                                         'aria-describedby' : 'message-id'
                                       }}
                    message          = {<Typography id ="message-id" color="error">{t('form_incomplete')}</Typography>}
                    action           = {[
                                         <Button key="undo" color="secondary" size="small" onClick={this.hideAlert}>{t('close')}</Button>
                                       ]}
            />
        </Grid>
    );
  }
}

export default translate('forms')(OrganizationForm);
