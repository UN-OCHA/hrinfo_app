import React      from 'react';
import { translate, Trans } from 'react-i18next';
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

//Components
import HRInfoSelect         from '../components/HRInfoSelect';
import HRInfoAsyncSelect    from '../components/HRInfoAsyncSelect';
import ClusterTypeSelect    from '../components/ClusterTypeSelect';
import SocialMedia          from '../components/SocialMedia';

//Material plugin
import { withStyles }   from '@material-ui/core/styles';
import PropTypes        from 'prop-types';
import FormHelperText   from '@material-ui/core/FormHelperText';
import FormControl      from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormLabel        from '@material-ui/core/FormLabel';
import TextField        from '@material-ui/core/TextField';
import RadioGroup       from '@material-ui/core/RadioGroup';
import Radio            from '@material-ui/core/Radio';
import Button           from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import Card             from '@material-ui/core/Card';
import CardContent      from '@material-ui/core/CardContent';
import Grid             from '@material-ui/core/Grid';
import Snackbar         from '@material-ui/core/Snackbar';
import Typography       from '@material-ui/core/Typography';
import Switch           from '@material-ui/core/Switch';

//Material
import './EventForm.css';

const styles = theme => ({
  group: {
    margin: `${theme.spacing.unit}px 0`,
  },
});


class ClusterForm extends React.Component {
  state = {
    wasSubmitted: false
  };

  hideAlert = () => {
    this.setState({ wasSubmitted: false });
  };

  submit = () => {
    this.setState({ wasSubmitted: true });
  };

  render() {
    const { classes, t, i18n } = this.props;

    const parent_cluster = this.props.doc.operation
    ? (
      <FormControl fullWidth margin="normal">
        <FormLabel>{t('bundles.parent_cluster')}</FormLabel>
        <HRInfoSelect
            type     = "bundles"
            spaces   = {[this.props.doc.operation]}
            isMulti  = {false}
            onChange = {(s) => this.props.handleSelectChange('parent_cluster', s)}
            value    = {this.props.doc.parent_cluster}/>
      </FormControl>
    )
    : '';

    let title = t('bundles.create') + ' [' + t('languages.' + i18n.language) + ']';
    if (this.props.doc.id) {
      title = t('edit') + ' ' + this.props.doc.label + ' [' + t('languages.' + i18n.language) + ']';
    }

    return (
      <Grid container direction = "column" alignItems = "center">
      <Typography color = "textSecondary" gutterBottom variant = "headline">{title}</Typography>
      <Grid item>
        <Grid container justify = "space-around">

          {/* LEFT COLUMN */}
          <Grid item md ={6} xs ={11}>

            {/* Title */}
            <FormControl required fullWidth margin = "normal">
              <FormLabel focused error={this.props.status === 'was-validated' && !this.props.isValid(this.props.doc.label)}>{t('title')}</FormLabel>
              <TextField type     = "text"
                         name     = "label"
                         id       = "label"
                         value    = {this.props.doc.label}
                         onChange = {this.props.handleInputChange}/>
              <FormHelperText id = "label-text">
                <Trans i18nKey={'bundles.helpers.title'}>Type the original title of the group. Try not to use abbreviations. To see Standards and Naming Conventions click
                <a href = "https://drive.google.com/open?id=1TxOek13c4uoYAQWqsYBhjppeYUwHZK7nhx5qgm1FALA" target="_blank" rel="noopener noreferrer"> here</a>.</Trans>
              </FormHelperText>
            </FormControl>

            {/* Type */}
            <FormControl required fullWidth margin="normal">
              <FormLabel focused error = {this.props.status === 'was-validated' && !this.props.isValid(this.props.doc.type)}>{t('type')}</FormLabel>
              <ClusterTypeSelect  value     = {this.props.doc.type}
                                  onChange  = {(s) => this.props.handleSelectChange('type', s)}
                                  className = {this.props.isValid(this.props.doc.type) ? 'is-valid' : 'is-invalid'}/>
              <FormHelperText id="type-text">
                  {t('bundles.helpers.type')}
              </FormHelperText>
            </FormControl>

            {/* HID Access */}
            <FormControl required component="fieldset" fullWidth margin="normal">
              <FormLabel focused error = {this.props.status === 'was-validated' && !this.props.isValid(this.props.doc.hid_access)}>{t('bundles.hid_access.title')}</FormLabel>
              <Card className="card-container">
                <CardContent className="card-content">
                  <RadioGroup
                    name       = "hid_access"
                    className  = {classes.group}
                    value      = {this.props.doc.hid_access}
                    onChange   = {this.props.handleInputChange}>
                    <FormControlLabel value="do_not_create"  control={<Radio color="primary"/>} label={t('bundles.hid_access.do_not_create')} />
                    <FormControlLabel value="open"  control={<Radio color="primary"/>} label={t('bundles.hid_access.open')} />
                    <FormControlLabel value="closed"  control={<Radio color="primary"/>} label={t('bundles.hid_access.closed')} />
                  </RadioGroup>
                </CardContent>
              </Card>
              <FormHelperText id = "hid_access-text">
                {t('bundles.helpers.hid_access')}
              </FormHelperText>
            </FormControl>

            {/* Body */}
            <FormControl fullWidth margin = "normal">
               <FormLabel>{t('description')}</FormLabel>
               <Card className = "card-container">
                 <Editor editorState         = {this.props.editorState}
                         editorClassName     = "editor-content"
                         toolbarClassName    = "editor-toolbar"
                         onEditorStateChange = {this.props.onEditorStateChange}/>
               </Card>
               <FormHelperText id = "body-text">
                {t('bundles.helpers.body')}
               </FormHelperText>
            </FormControl>

            {/* Social Media */}
            <FormControl fullWidth margin = "normal">
               <FormLabel htmlFor="social_media">{t('social_media')}</FormLabel>
               <SocialMedia onChange={(s) => this.props.handleSelectChange('social_media', s)}
                               value={this.props.doc.social_media}
                               id="social_media"/>
            </FormControl>

            {/* Website */}
            <FormControl fullWidth margin = "normal">
               <FormLabel>{t('website')}</FormLabel>
               <TextField type     = "text"
                          name     = "url"
                          id       = "url"
                          value    = {this.props.doc.url ? this.props.doc.url : ""}
                          onChange = {this.props.handleInputChange}/>
            </FormControl>

            {/* Email */}
            <FormControl fullWidth margin = "normal">
                <FormLabel>{t('email')}</FormLabel>
                <TextField type     = "text"
                           name     = "email"
                           id       = "email"
                           value    = {this.props.doc.email ? this.props.doc.email : ""}
                           onChange = {this.props.handleInputChange}/>
            </FormControl>
          </Grid>

          {/* RIGHT COLUMN */}
          <Grid item md={3} xs={11}>
            {/* Operation */}
            <FormControl required fullWidth margin="normal">
               <FormLabel focused error={this.props.status === 'was-validated' && !this.props.isValid(this.props.doc.operation)}>{t('operation')}</FormLabel>
               <HRInfoSelect type    = "operations"
                                  isMulti = {false}
                                  onChange={(s) => this.props.handleSelectChange('operation', s)}
                                  value   = {this.props.doc.operation}/>
            </FormControl>

            {/* Global Cluster */}
            <FormControl fullWidth margin="normal">
              <FormLabel>{t('bundles.global_cluster')}</FormLabel>
              <HRInfoSelect type    = "global_clusters"
                            isMulti = {false}
                            onChange={(s) => this.props.handleSelectChange('global_cluster', s)}
                            value   = {this.props.doc.global_cluster}/>
            </FormControl>

            {/* Parent Cluster */}
            {parent_cluster}

            {/* Lead Agencies */}
            <FormControl fullWidth margin = "normal">
              <FormLabel>{t('bundles.lead_agencies')}</FormLabel>
              <HRInfoAsyncSelect
                  type     = "organizations"
                  isMulti  = {true}
                  onChange = {(s) => this.props.handleSelectChange('lead_agencies', s)}
                  value    = {this.props.doc.lead_agencies}/>
            </FormControl>

            {/* Activation document */}
            <FormControl fullWidth margin = "normal">
              <FormLabel >{t('bundles.activation_document')}</FormLabel>
              <HRInfoAsyncSelect
                    type     = "documents"
                    name     = "activation_document"
                    id       = "activation_document"
                    isMulti  = {false}
                    onChange = {(s) => this.props.handleSelectChange('activation_document', s)}
                    value    = {this.props.doc.activation_document}/>
            </FormControl>

            {/* Partners */}
            <FormControl fullWidth margin="normal">
              <FormLabel>{t('bundles.partners')}</FormLabel>
              <HRInfoAsyncSelect type="organizations"
                                 isMulti  = {true}
                                 onChange = {(s) => this.props.handleSelectChange('organizations', s)}
                                 value    = {this.props.doc.partners}/>
            </FormControl>

            {/* Participation */}
            <FormControl fullWidth margin="normal">
              <FormLabel focused={false}>{t('bundles.participation')}</FormLabel>
              <Card className="card-container">
                <CardContent className="card-content">
                  <FormControlLabel
                    control={
                      <Switch
                        checked={this.props.doc.ngo_participation ? true : false}
                        onChange={this.props.handleInputChange}
                        name="ngo_participation"
                        color="primary"
                      />
                    }
                    label={t('bundles.ngo_participation')}
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={this.props.doc.government_participation ? true : false}
                        onChange={this.props.handleInputChange}
                        name="government_participation"
                        color="primary"
                      />
                    }
                    label={t('bundles.government_participation')}
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={this.props.doc.inter_cluster ? true : false}
                        onChange={this.props.handleInputChange}
                        name="inter_cluster"
                        color="primary"
                      />
                    }
                    label={t('bundles.inter_cluster')}
                  />
                </CardContent>
              </Card>
            </FormControl>
        </Grid>
      </Grid>
    </Grid>

        <Grid item className="submission">
        {
          this.props.status !== 'submitting' &&
          <span>
            <Button color="primary" variant="contained" onClick={(evt) => {this.props.handleSubmit(evt); this.submit()}}>{t('publish')}</Button>
              &nbsp;
            <Button color="secondary" variant="contained" onClick={(evt) => {this.props.handleSubmit(evt, 1); this.submit()}}>{t('save_as_draft')}</Button>
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
    </Grid>);
  }
}

ClusterForm.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(translate('forms')(ClusterForm));
