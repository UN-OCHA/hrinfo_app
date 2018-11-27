import React      from 'react';
import { translate, Trans } from 'react-i18next';
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

//Components
import HRInfoSelect          from '../components/HRInfoSelect';
import HRInfoLocations       from '../components/HRInfoLocations';
import Address               from '../components/Address';
import HidContacts           from '../components/HidContacts';
import HRInfoAsyncSelect     from '../components/HRInfoAsyncSelect';
import RelatedContent        from '../components/RelatedContent';
import LanguageSelect        from '../components/LanguageSelect';
import EventCategorySelect   from '../components/EventCategorySelect';
import EventDate             from '../components/EventDate';

//Material plugin
import FormHelperText   from '@material-ui/core/FormHelperText';
import FormControl      from '@material-ui/core/FormControl';
import FormLabel        from '@material-ui/core/FormLabel';
import TextField        from '@material-ui/core/TextField';
import Button           from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import Collapse         from '@material-ui/core/Collapse';
import Card             from '@material-ui/core/Card';
import Grid             from '@material-ui/core/Grid';
import Snackbar         from '@material-ui/core/Snackbar';
import Typography       from '@material-ui/core/Typography';

//Material
import './EventForm.css';

class EventForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      collapse     : false,
      wasSubmitted : false,
      timezone: ''
    };

    this.toggle    = this.toggle.bind(this);
    this.hideAlert = this.hideAlert.bind(this);
    this.submit    = this.submit.bind(this);
    this.handleSpaceChange = this.handleSpaceChange.bind(this);
  }

  toggle() {
    this.setState({ collapse: !this.state.collapse });
  }

  hideAlert() {
    this.setState({ wasSubmitted: false });
  }

  submit() {
    this.setState({ wasSubmitted: true });
  }

  handleSpaceChange(selected) {
    this.props.handleSelectChange('spaces', selected);
    if (selected[0] && selected[0].timezone) {
      this.setState({
        timezone: selected[0].timezone
      });
    }
  }

  render() {
    const { t, i18n } = this.props;
    const offices = this.props.doc.hasOperation
    ? (
      <FormControl fullWidth margin="normal">
        <FormLabel>{t('coordination_hubs')}</FormLabel>
        <HRInfoSelect type     = "offices"
                      spaces   = {this.props.doc.spaces}
                      isMulti  = {true}
                      onChange = {(s) => this.props.handleSelectChange('offices', s)}
                      value    = {this.props.doc.offices}/>
        <FormHelperText id = "offices-text">
          {t('events.helpers.offices')}
        </FormHelperText>
      </FormControl>
    )
    : '';

    const disasters = this.props.doc.hasOperation
    ? (
      <FormControl fullWidth margin="normal">
        <FormLabel>{t('disasters')}</FormLabel>
        <HRInfoSelect type      = "disasters"
                      spaces    = {this.props.doc.spaces}
                      isMulti   = {true}
                      onChange  = {(s) => this.props.handleSelectChange('disasters', s)}
                      value     = {this.props.doc.disasters}/>
        <FormHelperText id="disasters-text">
            {t('events.helpers.disasters')}
        </FormHelperText>
      </FormControl>
    )
    : '';

    const bundles = this.props.doc.hasOperation
    ? (
      <FormControl fullWidth margin="normal">
        <FormLabel>{t('groups')}</FormLabel>
        <HRInfoSelect type     =  "bundles"
                      spaces   =  {this.props.doc.spaces}
                      isMulti  =  {true}
                      onChange =  {(s) => this.props.handleSelectChange('bundles', s)}
                      value    =  {this.props.doc.bundles}/>
        <FormHelperText id="bundles-text">
          {t('events.helpers.bundles')}
        </FormHelperText>
      </FormControl>
    )
    : '';

    let title = t('events.create') + ' [' + t('languages.' + i18n.language) + ']';
    if (this.props.doc.id) {
      title = t('edit') + ' ' + this.props.doc.label + ' [' + t('languages.' + i18n.language) + ']';
    }
    else {
      if (this.props.doc && this.props.doc.isClone) {
        title = t('create') + ' ' + t('clone_of') + ' ' + this.props.doc.label + ' [' + t('languages.' + i18n.language) + ']';
      }
    }

    return (
      <Grid container direction = "column" alignItems = "center">
      <Typography color = "textSecondary" gutterBottom variant = "headline">{title}</Typography>
      <Grid item>
        <Grid container justify = "space-around">
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
                <Trans i18nKey='events.helpers.title'>Type the original title of the event. Try not to use abbreviations. To see Standards and Naming Conventions click
                <a href = "https://drive.google.com/open?id=1TxOek13c4uoYAQWqsYBhjppeYUwHZK7nhx5qgm1FALA" target="_blank" rel="noopener noreferrer"> here</a>.</Trans>
              </FormHelperText>
            </FormControl>

         {/* Event Category */}
            <FormControl required fullWidth margin="normal">
              <FormLabel focused error = {this.props.status === 'was-validated' && !this.props.isValid(this.props.doc.category)}>{t('events.category.title')}</FormLabel>
              <EventCategorySelect value     = {this.props.doc.category}
                                   onChange  = {(s) => this.props.handleSelectChange('category', s)}
                                   className = {this.props.isValid(this.props.doc.category) ? 'is-valid' : 'is-invalid'}/>
              <FormHelperText id="language-text">
                  {t('events.helpers.category')}
              </FormHelperText>
            </FormControl>

        {/* Dates */}
            <FormControl required fullWidth margin="normal">
              <FormLabel focused error={this.props.status === 'was-validated' && !this.props.isValid(this.props.doc.date)}>{t('date')}</FormLabel>
              <EventDate value    = {this.props.doc.date}
                         onChange = {(val) => {this.props.handleSelectChange('date', val);}}
                         timezone = {this.state.timezone}
                         required />
              <FormHelperText>
                {t('events.helpers.date')}
              </FormHelperText>
            </FormControl>

         {/* Event Description */}
            <FormControl fullWidth margin = "normal">
              <FormLabel>{t('description')}</FormLabel>
              <Card className = "card-container">
                <Editor editorState         = {this.props.editorState}
                        editorClassName     = "editor-content"
                        toolbarClassName    = "editor-toolbar"
                        onEditorStateChange = {this.props.onEditorStateChange}/>
              </Card>
              <FormHelperText id = "body-text">
                {t('events.helpers.description')}
              </FormHelperText>
            </FormControl>

        {/* Address */}
            <FormControl fullWidth margin = "normal">
              <FormLabel focused error ={this.props.status === 'was-validated' && !this.props.isValid(this.props.doc.address)}>{t('events.venue')}</FormLabel>
              <Address onChange={(s) => this.props.handleSelectChange('address', s)} value={this.props.doc.address} />
              <FormHelperText id = "address-text">
                {t('events.helpers.address')}
              </FormHelperText>
            </FormControl>

          {/* Agenda(s) */}
              <FormControl fullWidth margin="normal">
                <FormLabel>{t('events.agendas')}</FormLabel>
                <HRInfoAsyncSelect type     = "documents"
                                   onChange = {(s) => this.props.handleSelectChange('agenda', s)}
                                   value    = {this.props.doc.agenda}
                                   isMulti={true}
                                   fields='id,label,operation.label' />
                <FormHelperText>
                  {t('events.helpers.agendas')}
                </FormHelperText>
              </FormControl>

          {/* Meeting minute(s) */}
              <FormControl fullWidth margin="normal">
                <FormLabel>{t('events.meeting_minutes')}</FormLabel>
                <HRInfoAsyncSelect type     = "documents"
                                   onChange = {(s) => this.props.handleSelectChange('meeting_minutes', s)}
                                   value    = {this.props.doc.meeting_minutes}
                                   isMulti = {true}
                                   fields='id,label,operation.label' />
                <FormHelperText>
                  {t('events.helpers.meeting_minutes')}
                </FormHelperText>
              </FormControl>
          </Grid>

          <Grid item md={3} xs={11}>
       {/* Language */}
            <FormControl required fullWidth margin="normal">
              <FormLabel focused error = {this.props.status === 'was-validated' && !this.props.isValid(this.props.doc.language)}>{t('language')}</FormLabel>
              <LanguageSelect value     = {this.props.doc.language}
                              onChange  = {(s) => this.props.handleSelectChange('language', s)}
                              className = {this.props.isValid(this.props.doc.language) ? 'is-valid' : 'is-invalid'}/>
              <FormHelperText id="language-text">
                {t('events.helpers.language')}
              </FormHelperText>
            </FormControl>

        {/* Operation(s) / Webspace(s) */}
            <FormControl required fullWidth margin="normal">
              <FormLabel focused error ={this.props.status === 'was-validated' && !this.props.isValid(this.props.doc.spaces)}>{t('spaces')}</FormLabel>
              <HRInfoSelect type    = "spaces"
                            isMulti = {true}
                            onChange={(s) => this.handleSpaceChange(s)}
                            fields = 'id,label,timezone'
                            value   = {this.props.doc.spaces}/>
              <FormHelperText>
                {t('events.helpers.spaces')}
              </FormHelperText>
            </FormControl>

        {/* Organizations */}
            <FormControl fullWidth margin="normal">
              <FormLabel>{t('organizations')})</FormLabel>
              <HRInfoAsyncSelect type     = "organizations"
                                 onChange = {(s) => this.props.handleSelectChange('organizations', s)}
                                 value    = {this.props.doc.organizations}
                                  isMulti={true} />
              <FormHelperText id="organizations-text">
                {t('events.helpers.organizations')}
              </FormHelperText>
            </FormControl>

        {/* Contacts */}
            <FormControl fullWidth margin="normal">
              <FormLabel>{t('events.contacts')}</FormLabel>
              <HidContacts isMulti={true}
                           id="contacts"
                           onChange={(s) => this.props.handleSelectChange('contacts', s)}
                           value={this.props.doc.contacts} />
              <FormHelperText>
                {t('events.helpers.contacts')}
              </FormHelperText>
            </FormControl>


              {bundles}
              {offices}
              {disasters}

        {/* Buttons show/hide more informations */}
              <div className="more-info-button">
                { !this.state.collapse &&
                  <Button color="secondary" variant="contained" onClick={this.toggle}>
                    <i className = "icon-plus" /> &nbsp; {t('add_more')}
                  </Button>
                }
                { this.state.collapse &&
                  <Button color="secondary" variant="contained" onClick={this.toggle}>
                    <i className = "icon-cancel" /> &nbsp; {t('hide_information')}
                  </Button>
                }
              </div>

              <Collapse in={this.state.collapse}>
            {/* Locations */}
                <FormControl fullWidth margin="normal">
                  <FormLabel>{t('locations')}</FormLabel>
                  <HRInfoLocations onChange = {(s) => this.props.handleSelectChange('locations', s)}
                                   value    = {this.props.doc.locations}
                                   isMulti  = "isMulti"
                                   id       = "locations"/>
                  <FormHelperText id="locations-text">
                    {t('events.helpers.locations')}
                  </FormHelperText>
                </FormControl>

            {/* Themes */}
                <FormControl fullWidth margin="normal">
                  <FormLabel>{t('themes')}</FormLabel>
                  <HRInfoSelect type      = "themes"
                                isMulti   = {true}
                                onChange  = {(s) => this.props.handleSelectChange('themes', s)}
                                value     = {this.props.doc.themes}
                                id        = "themes"/>
                  <FormHelperText id="themes-text">
                    {t('events.helpers.themes')}
                  </FormHelperText>
                </FormControl>

            {/* Related Content */}
                <FormControl fullWidth margin="normal">
                  <FormLabel>{t('related_content.related_content')}</FormLabel>
                  <RelatedContent onChange  = {(s) => this.props.handleSelectChange('related_content', s)}
                                  value     = {this.props.doc.related_content}
                                  id        = "related_content"/>
                  <FormHelperText id="related_content-text">
                    {t('events.helpers.related_content')}
                  </FormHelperText>
                </FormControl>
              </Collapse>
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

export default translate('forms')(EventForm);
