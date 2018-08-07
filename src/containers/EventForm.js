import React      from 'react';
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

//Components
import HRInfoSelect          from '../components/HRInfoSelect';
import HRInfoLocations       from '../components/HRInfoLocations';
import Address               from '../components/Address';

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
    const offices = this.props.doc.hasOperation
    ? (
      <FormControl fullWidth margin="normal">
        <FormLabel>Coordination hub(s)</FormLabel>
        <HRInfoSelect type     = "offices"
                      spaces   = {this.props.doc.spaces}
                      isMulti  = {true}
                      onChange = {(s) => this.props.handleSelectChange('offices', s)}
                      value    = {this.props.doc.offices}/>
        <FormHelperText id = "offices-text">
          Click on the field and select the coordination hub(s) the {this.props.typeLabel + ' '}
          refers to (if any).
        </FormHelperText>
      </FormControl>
    )
    : '';

    const disasters = this.props.doc.hasOperation
    ? (
      <FormControl fullWidth margin="normal">
        <FormLabel>Disaster(s) / Emergency</FormLabel>
        <HRInfoSelect type      = "disasters"
                      spaces    = {this.props.doc.spaces}
                      isMulti   = {true}
                      onChange  = {(s) => this.props.handleSelectChange('disasters', s)}
                      value     = {this.props.doc.disasters}/>
        <FormHelperText id="disasters-text">
            Click on the field and select the disaster(s) or emergency the {this.props.typeLabel + ' '}
            refers to. Each disaster/emergency is associated with a number, called GLIDE, which is a common standard used by a wide network of organizations See
            <a href="http://glidenumer.net/?ref=hrinfo"> glidenumber.net</a>.
        </FormHelperText>
      </FormControl>
    )
    : '';

    const bundles = this.props.doc.hasOperation
    ? (
      <FormControl fullWidth margin="normal">
        <FormLabel> Cluster(s)/Sector(s) </FormLabel>
        <HRInfoSelect type     =  "bundles"
                      spaces   =  {this.props.doc.spaces}
                      isMulti  =  {true}
                      onChange =  {(s) => this.props.handleSelectChange('bundles', s)}
                      value    =  {this.props.doc.bundles}/>
        <FormHelperText id="bundles-text">
          Indicate the cluster(s)/sector(s) the {this.props.label + ' '}
          refers to.
        </FormHelperText>
      </FormControl>
    )
    : '';

    return (
      <Grid container direction = "column" alignItems = "center">
      <Typography color = "textSecondary" gutterBottom variant = "headline">Create {this.props.label}</Typography>
      <Grid item>
        <Grid container justify = "space-around">
          <Grid item md ={6} xs ={11}>

          {/* Title */}
            <FormControl required fullWidth margin = "normal">
              <FormLabel focused error={this.props.status === 'was-validated' && !this.props.isValid(this.props.doc.label)}>Title</FormLabel>
              <TextField type     = "text"
                         name     = "label"
                         id       = "label"
                         value    = {this.props.doc.label}
                         onChange = {this.props.handleInputChange}/>
              <FormHelperText id = "label-text">
                Type the original title of the {this.props.label + ' '}. Try not to use abbreviations. To see Standards and Naming Conventions click
                <a href = "https://drive.google.com/open?id=1TxOek13c4uoYAQWqsYBhjppeYUwHZK7nhx5qgm1FALA"> here</a>.
              </FormHelperText>
            </FormControl>

         {/* Event Category */}
            <FormControl required fullWidth margin="normal">
              <FormLabel focused error = {this.props.status === 'was-validated' && !this.props.isValid(this.props.doc.category)}>Event Category</FormLabel>
              <EventCategorySelect value     = {this.props.doc.category}
                                   onChange  = {(s) => this.props.handleSelectChange('category', s)}
                                   className = {this.props.isValid(this.props.doc.category) ? 'is-valid' : 'is-invalid'}/>
              <FormHelperText id="language-text">
                  From the list, select the kind of {this.props.label} you are creating. .
              </FormHelperText>
            </FormControl>

         {/* Event Description */}
            <FormControl fullWidth margin = "normal">
              <FormLabel>Event description</FormLabel>
              <Card className = "card-container">
                <Editor editorState         = {this.props.editorState}
                        editorClassName     = "editor-content"
                        toolbarClassName    = "editor-toolbar"
                        onEditorStateChange = {this.props.onEditorStateChange}/>
              </Card>
              <FormHelperText id = "body-text">
                Try to always include here the text (in full or part of it) of the {this.props.label + ' '}
                (example: use the introduction or the executive summary). If no text is available add a description of the file(s) you are publishing.
              </FormHelperText>
            </FormControl>

        {/* Address */}
            <FormControl required fullWidth margin = "normal">
              <FormLabel focused error ={this.props.status === 'was-validated' && !this.props.isValid(this.props.doc.files)}>Venue</FormLabel>
              <Address onChange={(s) => this.props.handleSelectChange('files', s)} value={this.props.doc.files} />
              <FormHelperText id = "files-text">
                Indicate here where the event takes place.
              </FormHelperText>
            </FormControl>
          </Grid>

          <Grid item md={3} xs={11}>
       {/* Language */}
            <FormControl required fullWidth margin="normal">
              <FormLabel focused error = {this.props.status === 'was-validated' && !this.props.isValid(this.props.doc.language)}>Language</FormLabel>
              <LanguageSelect value     = {this.props.doc.language}
                              onChange  = {(s) => this.props.handleSelectChange('language', s)}
                              className = {this.props.isValid(this.props.doc.language) ? 'is-valid' : 'is-invalid'}/>
              <FormHelperText id="language-text">
                Select the language of the {this.props.label}.
              </FormHelperText>
            </FormControl>

        {/* Operation(s) / Webspace(s) */}
            <FormControl required fullWidth margin="normal">
              <FormLabel focused error ={this.props.status === 'was-validated' && !this.props.isValid(this.props.doc.spaces)}>Operation(s) / Webspace(s)</FormLabel>
              <HRInfoSelect type    = "spaces"
                            isMulti = {true} onChange={(s) => this.props.handleSelectChange('spaces', s)}
                            value   = {this.props.doc.spaces}/>
              <FormHelperText>
                Click on the field and select where to publish the {this.props.label + ' '}
                (operation, regional site or thematic site).
              </FormHelperText>
            </FormControl>

        {/* Dates */}
            <FormControl required fullWidth margin="normal">
              <FormLabel focused error={this.props.status === 'was-validated' && !this.props.isValid(this.props.doc.publication_date)}>Date</FormLabel>
              <EventDate value    = {this.props.doc.date ? this.props.doc.date : ''}
                         required
                         onChange = {(val) => {console.log(val); this.props.handleSelectChange('date', val);}} />
              <FormHelperText id = "publication_date-text">
                Indicate the date of the {this.props.label + ' '}.
              </FormHelperText>
            </FormControl>

        {/* Organizations */}
            <FormControl required fullWidth margin="normal">
              <FormLabel focused error={this.props.status === 'was-validated' && !this.props.isValid(this.props.doc.organizations)}>Organization(s)</FormLabel>
              <HRInfoAsyncSelect type     = "organizations"
                                 onChange = {(s) => this.props.handleSelectChange('organizations', s)}
                                 value    = {this.props.doc.organizations}
                                  isMulti={true} />
              <FormHelperText id="organizations-text">
                Type in and select the source(s) of the {this.props.label}.
              </FormHelperText>
            </FormControl>

        {/* Contacts */}
            <FormControl required fullWidth margin="normal">
              <FormLabel focused error={this.props.status === 'was-validated' && !this.props.isValid(this.props.doc.contacts)}>Contact(s)</FormLabel>
              <HRInfoSelect type    = "spaces"
                            isMulti = {true} onChange={(s) => this.props.handleSelectChange('contacts', s)}
                            value   = {this.props.doc.contacts}/>
              <FormHelperText>
                Indicate the person(s) to contact for information regarding the {this.props.label}. To show up in the list, the person must have a HumanitarianID profile.
              </FormHelperText>
            </FormControl>

        {/* Agenda(s) */}
            <FormControl required fullWidth margin="normal">
              <FormLabel focused error={this.props.status === 'was-validated' && !this.props.isValid(this.props.doc.agendas)}>Agenda(s)</FormLabel>
              <HRInfoAsyncSelect type     = "documents"
                                 onChange = {(s) => this.props.handleSelectChange('agendas', s)}
                                 value    = {this.props.doc.agendas}
                                  isMulti={true} />
              <FormHelperText>
                Add the agenda of the {this.props.label} as a document first, and then reference this document from here.
              </FormHelperText>
            </FormControl>

        {/* Meeting minute(s) */}
            <FormControl required fullWidth margin="normal">
              <FormLabel focused error={this.props.status === 'was-validated' && !this.props.isValid(this.props.doc.meeting_minutes)}>Meeting minute(s)</FormLabel>
              <HRInfoAsyncSelect type     = "documents"
                                 onChange = {(s) => this.props.handleSelectChange('meeting_minutes', s)}
                                 value    = {this.props.doc.meeting_minutes}
                                  isMulti = {true} />
              <FormHelperText>
                Add the meeting minutes of the {this.props.label} as a document first, and then reference this document from here.
              </FormHelperText>
            </FormControl>

              {bundles}
              {offices}
              {disasters}

        {/* Buttons show/hide more informations */}
              <div className="more-info-button">
                { !this.state.collapse &&
                  <Button color="secondary" variant="contained" onClick={this.toggle}>
                    <i className = "icon-plus" /> &nbsp; Add More Information
                  </Button>
                }
                { this.state.collapse &&
                  <Button color="secondary" variant="contained" onClick={this.toggle}>
                    <i className = "icon-cancel" /> &nbsp; Hide Optional Information
                  </Button>
                }
              </div>

              <Collapse in={this.state.collapse}>
            {/* Locations */}
                <FormControl fullWidth margin="normal">
                  <FormLabel>Location(s)</FormLabel>
                  <HRInfoLocations onChange = {(s) => this.props.handleSelectChange('locations', s)}
                                   value    = {this.props.doc.locations}
                                   isMulti  = "isMulti"
                                   id       = "locations"/>
                  <FormHelperText id="locations-text">
                    Select from the menu the country(ies) the {this.props.label + ' '}
                    is about and indicate more specific locations by selecting multiple layers (region, province, town).
                  </FormHelperText>
                </FormControl>

            {/* Themes */}
                <FormControl fullWidth margin="normal">
                  <FormLabel>Theme(s)</FormLabel>
                  <HRInfoSelect type      = "themes"
                                isMulti   = {true}
                                onChange  = {(s) => this.props.handleSelectChange('themes', s)}
                                value     = {this.props.doc.themes}
                                id        = "themes"/>
                  <FormHelperText id="themes-text">
                    Click on the field and select all relevant themes. Choose only themes the {this.props.label + ' '}
                    substantively refers to.
                  </FormHelperText>
                </FormControl>

            {/* Related Content */}
                <FormControl fullWidth margin="normal">
                  <FormLabel>Related Content</FormLabel>
                  <RelatedContent onChange  = {(s) => this.props.handleSelectChange('related_content', s)}
                                  value     = {this.props.doc.related_content}
                                  id        = "related_content"/>
                  <FormHelperText id="related_content-text">
                    Add links to content that is related to the {this.props.label + ' '}
                    you are publishing (example: language versions of the same {this.props.label}, or the link of the event the meeting minutes refer to) by indicating the title of the content and its url.
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
            <Button color="primary" variant="contained" onClick={(evt) => {this.props.handleSubmit(evt); this.submit()}}>Publish</Button>
              &nbsp;
            <Button color="secondary" variant="contained" onClick={(evt) => {this.props.handleSubmit(evt, 1); this.submit()}}>Save as Draft</Button>
              &nbsp;
          </span>
        }
        {(this.props.status === 'submitting' || this.props.status === 'deleting') &&
          <CircularProgress />
        }
        {(this.props.match.params.id && this.props.status !== 'deleting') &&
          <span>
            <Button color="secondary" variant="contained" onClick={this.props.handleDelete}>Delete</Button>
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
          message  = {<Typography id ="message-id" color="error">The form is incomplete and could not be submitted.</Typography>}
          action   = {[
            <Button key="undo" color="secondary" size="small" onClick={this.hideAlert}>
            CLOSE
            </Button>
          ]}
        />
    </Grid>);
  }
}

export default EventForm;
