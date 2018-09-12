import React      from 'react';
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { translate, Trans } from 'react-i18next';

//Components
import HRInfoSelect       from '../components/HRInfoSelect';
import HRInfoLocations    from '../components/HRInfoLocations';
import HRInfoAsyncSelect  from '../components/HRInfoAsyncSelect';
import HRInfoFiles        from '../components/HRInfoFiles';
import RelatedContent     from '../components/RelatedContent';
import LanguageSelect     from '../components/LanguageSelect';

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
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox         from '@material-ui/core/Checkbox';

//Material ui pickers
import MomentUtils             from 'material-ui-pickers/utils/moment-utils';
import MuiPickersUtilsProvider from 'material-ui-pickers/utils/MuiPickersUtilsProvider';
import DatePicker              from 'material-ui-pickers/DatePicker';

import './DocumentForm.css';

class DocumentForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      collapse     : false,
      wasSubmitted : false
    };

    this.toggle    = this.toggle.bind(this);
    this.hideAlert = this.hideAlert.bind(this);
    this.submit    = this.submit.bind(this);
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

  render() {
    const { t, label } = this.props;
    const offices = this.props.doc.hasOperation
    ? (
      <FormControl fullWidth margin="normal">
        <FormLabel>{t('coordination_hubs')}</FormLabel>
        <HRInfoSelect
          type     = "offices"
          spaces   = {this.props.doc.spaces}
          isMulti  = {true}
          onChange = {(s) => this.props.handleSelectChange('offices', s)}
          value    = {this.props.doc.offices}/>
        <FormHelperText id = "offices-text">
          {t(label + '.helpers.offices')}
        </FormHelperText>
      </FormControl>
    )
    : '';

    const disasters = this.props.doc.hasOperation
    ? (
      <FormControl fullWidth margin="normal">
        <FormLabel>{t('disasters')}</FormLabel>
        <HRInfoSelect
          type      = "disasters"
          spaces    = {this.props.doc.spaces}
          isMulti   = {true}
          onChange  = {(s) => this.props.handleSelectChange('disasters', s)}
          value     = {this.props.doc.disasters}/>
        <FormHelperText id="disasters-text">
          <Trans i18nKey={label + '.helpers.disasters'}>Click on the field and select the disaster(s) or emergency the document
          refers to. Each disaster/emergency is associated with a number, called GLIDE, which is a common standard used by a wide network of organizations See
          <a href="http://glidenumer.net/?ref=hrinfo"> glidenumber.net</a>.</Trans>
        </FormHelperText>
      </FormControl>
    )
    : '';

    const bundles = this.props.doc.hasOperation
    ? (
      <FormControl fullWidth margin="normal">
        <FormLabel>{t('bundles')}</FormLabel>
        <HRInfoSelect
          type     =  "bundles"
          spaces   =  {this.props.doc.spaces}
          isMulti =  {true}
          onChange  =  {(s) => this.props.handleSelectChange('bundles', s)}
          value =  {this.props.doc.bundles}/>
        <FormHelperText id="bundles-text">
          {t(label + '.helpers.bundles')}
        </FormHelperText>
      </FormControl>
    )
    : '';

    return (
      <Grid container direction = "column" alignItems="center">
      <Typography color = "textSecondary" gutterBottom variant = "headline">{t(label + '.create')}</Typography>
      <Grid item>
        <Grid container justify = "space-around">
          <Grid item md ={6} xs ={11}>
            <FormControl required fullWidth margin = "normal">
              <FormLabel focused error={this.props.status === 'was-validated' && !this.props.isValid(this.props.doc.label)}>{t('title')}</FormLabel>
              <TextField
                type     = "text"
                name     = "label"
                id       = "label"
                value    = {this.props.doc.label}
                onChange = {this.props.handleInputChange}/>
              <FormHelperText id = "label-text">
                <Trans i18nKey={label + '.helpers.title'}>Type the original title of the document. Try not to use abbreviations. To see Standards and Naming Conventions click
                <a href = "https://drive.google.com/open?id=1TxOek13c4uoYAQWqsYBhjppeYUwHZK7nhx5qgm1FALA"> here</a>.</Trans>
              </FormHelperText>
            </FormControl>

            <FormControl fullWidth margin = "normal">
              <FormLabel>{t('description')}</FormLabel>
              <Card className         = "card-container">
                <Editor editorState   = {this.props.editorState}
                  editorClassName     = "editor-content"
                  toolbarClassName    = "editor-toolbar"
                  onEditorStateChange = {this.props.onEditorStateChange}
                />
              </Card>
              <FormHelperText id = "body-text">
                {t(label + '.helpers.description')}
              </FormHelperText>
            </FormControl>

            <FormControl required fullWidth margin = "normal">
              <FormLabel focused error ={this.props.status === 'was-validated' && !this.props.isValid(this.props.doc.files)}>{t('files')}</FormLabel>
              <HRInfoFiles onChange={(s) => this.props.handleSelectChange('files', s)} value={this.props.doc.files} />
              <FormHelperText id = "files-text">
                <Trans i18nKey='helpers.files'>Upload the file to publish from your computer, and specify its language. It is best to publish one file per record,
                however you can add more if needed. To see Standards and Naming Conventions click
                <a href="https://drive.google.com/open?id=1TxOek13c4uoYAQWqsYBhjppeYUwHZK7nhx5qgm1FALA"> here</a>.</Trans>
              </FormHelperText>
            </FormControl>
          </Grid>


          <Grid item md={3} xs={11}>
            <FormControl required fullWidth margin="normal">
              <FormLabel focused error = {this.props.status === 'was-validated' && !this.props.isValid(this.props.doc.language)}>{t('language')}</FormLabel>
              <LanguageSelect value     = {this.props.doc.language}
                onChange  = {(s) => this.props.handleSelectChange('language', s)}
                className = {this.props.isValid(this.props.doc.language) ? 'is-valid' : 'is-invalid'}/>
              <FormHelperText id="language-text">
                {t(label + '.helpers.language')}
              </FormHelperText>
            </FormControl>

            <FormControl required fullWidth margin="normal">
              <FormLabel focused error={this.props.status === 'was-validated' && !this.props.isValid(this.props.doc.spaces)}>{t('spaces')}</FormLabel>
              <HRInfoSelect type="spaces" isMulti={true} onChange={(s) => this.props.handleSelectChange('spaces', s)} value={this.props.doc.spaces}/>
              <FormHelperText>
                {t(label + '.helpers.spaces')}
              </FormHelperText>
            </FormControl>

            <FormControl required fullWidth margin="normal">
              <FormLabel focused error={this.props.status === 'was-validated' && !this.props.isValid(this.props.doc.publication_date)}>{t('publication_date')}</FormLabel>
              <MuiPickersUtilsProvider utils={MomentUtils}>
                <DatePicker
                  id     = "publication_date"
                  name   = "publication_date"
                  format = "DD/MM/YYYY"
                  value  = {this.props.doc.publication_date ? this.props.doc.publication_date : ''}
                  invalidLabel = ""
                  autoOk
                  onChange       = {this.props.handleInputChange}
                  leftArrowIcon  = {<i className="icon-arrow-left" />}
                  rightArrowIcon = {<i className="icon-arrow-right" />}
                />
              </MuiPickersUtilsProvider>
              <FormHelperText id="publication_date-text">
                {t(label + '.helpers.publication_date')}
              </FormHelperText>
            </FormControl>

            <FormControl required fullWidth margin="normal">
              <FormLabel focused error={this.props.status === 'was-validated' && ((this.props.hrinfoType === 'documents' && !this.props.isValid(this.props.doc.document_type)) ||
                (this.props.hrinfoType === 'infographics' && !this.props.isValid(this.props.doc.infographic_type)))}>
                { this.props.hrinfoType === 'documents'
                ? t('document_type')
                : t('map_type') }
              </FormLabel>
              {
                this.props.hrinfoType === 'documents'
                  ? <HRInfoSelect
                      type      = 'document_types'
                      onChange  = {(s) => this.props.handleSelectChange('document_type', s)}
                      value     = {this.props.doc.document_type}
                      className = {this.props.isValid(this.props.doc.document_type)
                      ? 'is-valid'
                      : 'is-invalid'}/>
                  : <HRInfoSelect type='infographic_types'
                      onChange  = {(s) => this.props.handleSelectChange('infographic_type', s)}
                      value     = {this.props.doc.infographic_type}
                      className = {this.props.isValid(this.props.doc.infographic_type)
                      ? 'is-valid'
                      : 'is-invalid'}/>
                }
                <FormHelperText>
                  {t(label + '.helpers.document_type')}
              </FormHelperText>
            </FormControl>

            <FormControl required fullWidth margin="normal">
              <FormLabel focused error={this.props.status === 'was-validated' && !this.props.isValid(this.props.doc.organizations)}>{t('organizations')}</FormLabel>
              <HRInfoAsyncSelect type="organizations" isMulti={true}
                onChange={(s) => this.props.handleSelectChange('organizations', s)}
                value={this.props.doc.organizations}/>
              <FormHelperText id="organizations-text">
                {t(label + '.helpers.organizations')}
              </FormHelperText>
            </FormControl>
              {bundles}
              {offices}
              {disasters}

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
                <FormControl fullWidth margin="normal">
                  <FormLabel>{t('locations')}</FormLabel>
                  <HRInfoLocations onChange={(s) => this.props.handleSelectChange('locations', s)}
                    value   = {this.props.doc.locations}
                    isMulti = "isMulti"
                    id      = "locations"/>
                  <FormHelperText id="locations-text">
                    {t(label + '.helpers.locations')}
                  </FormHelperText>
                </FormControl>

                <FormControl fullWidth margin="normal">
                  <FormLabel>{t('themes')}</FormLabel>
                  <HRInfoSelect type="themes"
                    isMulti   = {true}
                    onChange  = {(s) => this.props.handleSelectChange('themes', s)}
                    value     = {this.props.doc.themes}
                    id        = "themes"/>
                  <FormHelperText id="themes-text">
                    {t(label + '.helpers.themes')}
                  </FormHelperText>
                </FormControl>

							<FormControl fullWidth margin="normal">
								<FormLabel>{t('related_content')}</FormLabel>
								<RelatedContent onChange={(s) => this.props.handleSelectChange('related_content', s)}
									value={this.props.doc.related_content}
									id="related_content"/>
								<FormHelperText id="related_content-text">
                  {t(label + '.helpers.related_content')}
								</FormHelperText>
							</FormControl>

              <FormControl fullWidth margin="normal">
								<FormControlLabel
                  control={<Checkbox checked={this.props.doc.exclude_from_reliefweb === true ? true : false} name="exclude_from_reliefweb" onChange={this.props.handleInputChange} color="primary" />}
                  label={t('exclude_from_reliefweb')}
                />
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
            vertical  : 'bottom',
            horizontal: 'left'
          }}
          open             = {this.props.status === 'was-validated' && this.state.wasSubmitted}
          autoHideDuration = {6000}
          onClose          = {this.hideAlert}
          ContentProps     = {{
            'aria-describedby' : 'message-id'
          }}
          message={<Typography id ="message-id" color="error">{t('form_incomplete')}</Typography>}
          action={[
            <Button key="undo" color="secondary" size="small" onClick={this.hideAlert}>
            {t('close')}
            </Button>
          ]}
        />
    </Grid>);
  }
}

export default translate('forms')(DocumentForm);
