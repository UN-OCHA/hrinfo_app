import React      from 'react';
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

//Components
import HidContacts          from '../components/HidContacts';
import HRInfoSelect         from '../components/HRInfoSelect';
import HRInfoAsyncSelect    from '../components/HRInfoAsyncSelect';
import LanguageSelect       from '../components/LanguageSelect';
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
import Divider          from '@material-ui/core/Divider';
import Grid             from '@material-ui/core/Grid';
import Snackbar         from '@material-ui/core/Snackbar';
import Typography       from '@material-ui/core/Typography';

//Material
import './EventForm.css';

const styles = theme => ({
  group: {
    margin: `${theme.spacing.unit}px 0`,
  },
});


class ClusterForm extends React.Component {
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

  handleRadioChange = event => {
    this.setState({ selectedValue: event.target.value });
  };

  render() {
    const { classes } = this.props;

    return (
      <Grid container direction = "column" alignItems = "center">
      <Typography color = "textSecondary" gutterBottom variant = "headline">Create {this.props.label}</Typography>
      <Grid item>
        <Grid container justify = "space-around">

          {/* LEFT COLUMN */}
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

            {/* Type */}
            <FormControl required fullWidth margin="normal">
              <FormLabel focused error = {this.props.status === 'was-validated' && !this.props.isValid(this.props.doc.type)}>Type</FormLabel>
              <ClusterTypeSelect  value     = {this.props.doc.type}
                                  onChange  = {(s) => this.props.handleSelectChange('type', s)}
                                  className = {this.props.isValid(this.props.doc.type) ? 'is-valid' : 'is-invalid'}/>
              <FormHelperText id="type-text">
                  From the list, select the type of {this.props.label} you are creating.
              </FormHelperText>
            </FormControl>

            {/* HID Access */}
            <FormControl required component="fieldset" fullWidth margin="normal">
              <FormLabel focused error = {this.props.status === 'was-validated' && !this.props.isValid(this.props.doc.hid_access)}>HID Access</FormLabel>
              <Card className="card-container">
                <CardContent className="card-content">
                  <RadioGroup
                    name       = "hid_access"
                    className  = {classes.group}
                    value      = {this.props.doc.hid_access}
                    onChange   = {(s) => this.props.handleSelectChange('hid_access', s)}>
                    <FormControlLabel value="do_not_create"  control={<Radio color="primary"/>} label="Do not create a list" />
                    <FormControlLabel value="open"  control={<Radio color="primary"/>} label="Open" />
                    <FormControlLabel value="closed"  control={<Radio color="primary"/>} label="Closed" />
                  </RadioGroup>
                </CardContent>
              </Card>
              <FormHelperText id = "hid_access-text">
                Select "Open" if you want HID users to add themselves to this cluster/sector. Select "Closed" if you want only HID managers to be allowed to add HID users to this cluster/sector.
              </FormHelperText>
            </FormControl>

            {/* Body */}
            <FormControl fullWidth margin = "normal">
               <FormLabel>Body</FormLabel>
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


            {/* Social Media */}
            <FormControl fullWidth margin = "normal">
               <FormLabel htmlFor="social_media">Social media</FormLabel>
               <SocialMedia onChange={(s) => this.props.handleSelectChange('social_media', s)}
                               value={this.props.doc.social_media}
                               id="social_media"/>
            </FormControl>

            {/* Groups audience */}
            <FormControl required fullWidth margin="normal">
               <FormLabel focused error={this.props.status === 'was-validated' && !this.props.isValid(this.props.doc.operation)}>Groups audience</FormLabel>
               <HRInfoAsyncSelect type    = "operations"
                                  isMulti = {true}
                                  onChange={(s) => this.props.handleSelectChange('operation', s)}
                                  value   = {this.props.doc.operation}/>
            </FormControl>

            {/* Website */}
            <FormControl fullWidth margin = "normal">
               <FormLabel>Website</FormLabel>
               <TextField type     = "text"
                          name     = "url"
                          id       = "url"
                          value    = {this.props.doc.url ? this.props.doc.url : ""}
                          onChange = {this.props.handleInputChange}/>
            </FormControl>

            {/* Email */}
            <FormControl fullWidth margin = "normal">
                <FormLabel>Email</FormLabel>
                <TextField type     = "text"
                           name     = "email"
                           id       = "email"
                           value    = {this.props.doc.email ? this.props.doc.email : ""}
                           onChange = {this.props.handleInputChange}/>
            </FormControl>
          </Grid>

          {/* RIGHT COLUMN */}
          <Grid item md={3} xs={11}>
            {/* Global Cluster */}
            <FormControl fullWidth margin="normal">
              <FormLabel>Global Cluster</FormLabel>
              <HRInfoSelect type    = "global_clusters"
                            isMulti = {false}
                            onChange={(s) => this.props.handleSelectChange('global_cluster', s)}
                            value   = {this.props.doc.global_cluster}/>
            </FormControl>

            {/* Parent Cluster */}
            <FormControl fullWidth margin="normal">
              <FormLabel>Parent Cluster</FormLabel>
              <HRInfoAsyncSelect
                  type     = "bundles"
                  spaces   = {this.props.doc ? this.props.doc : null}
                  isMulti  = {true}
                  onChange = {(s) => this.props.setFilter('bundles', s)}
                  value    = {this.props.doc.parent_cluster}/>
            </FormControl>

            {/* Lead Agencies */}
            <FormControl fullWidth margin = "normal">
              <FormLabel>Lead Agencies</FormLabel>
              <HRInfoAsyncSelect
                  type     = "organizations"
                  isMulti  = {true}
                  onChange = {(s) => this.props.setFilter('lead_agencies', s)}
                  value    = {this.props.doc.lead_agencies}/>
            </FormControl>

            {/* Activation document */}
            <FormControl fullWidth margin = "normal">
              <FormLabel >Activation document</FormLabel>
              <HRInfoAsyncSelect
                    type     = "documents"
                    name     = "activation_document"
                    id       = "activation_document"
                    isMulti  = {false}
                    onChange = {(s) => this.props.handleSelectChange('activation_document', s)}
                    value    = {this.props.doc.activation_document}/>
            </FormControl>

            {/* Cluster Coordinators */}
            <FormControl fullWidth margin = "normal">
              <FormLabel htmlFor="cluster_coordinators">Cluster Coordinator</FormLabel>
              <HidContacts isMulti={true}
                          id="cluster_coordinators"
                          onChange={(s) => {this.props.handleSelectChange('cluster_coordinators', s)}}
                          value={this.props.doc.cluster_coordinators} />
            </FormControl>

            {/* Partners */}
            <FormControl fullWidth margin="normal">
              <FormLabel>Partners</FormLabel>
              <HRInfoAsyncSelect type="organizations"
                                 isMulti  = {true}
                                 onChange = {(s) => this.props.handleSelectChange('organizations', s)}
                                 value    = {this.props.doc.partners}/>
            </FormControl>

            {/* Radio group 'NGO Participation' */}
            <FormControl component="fieldset" fullWidth margin="normal">
              <FormLabel>NGO Participation</FormLabel>
              <Card  className="card-container">
                <CardContent className="card-content">
                    <RadioGroup
                      name       = "ngo_participation"
                      value      = {this.props.doc.ngo_participation}
                      onChange   = {this.props.handleRadioChange}
                    >
                      <FormControlLabel value="0"  control={<Radio />} label="N/A" />
                      <FormControlLabel value="1"  control={<Radio />} label="No" />
                      <FormControlLabel value="2"  control={<Radio />} label="Yes" />
                    </RadioGroup>
                </CardContent>
              </Card>
            </FormControl>

            {/* Radio group 'Government Participation' */}
            <FormControl component="fieldset" fullWidth margin="normal">
              <FormLabel>Government Participation</FormLabel>
              <Card className="card-container">
                <CardContent className="card-content">
                    <RadioGroup
                      name        = "government_participation"
                      value       = {this.props.doc.government_participation}
                      onChange    = {this.props.handleRadioChange}
                    >
                      <FormControlLabel value="0"  control={<Radio />} label="N/A" />
                      <FormControlLabel value="1"   control={<Radio />} label="No" />
                      <FormControlLabel value="2"  control={<Radio />} label="Yes" />
                    </RadioGroup>
                </CardContent>
              </Card>
            </FormControl>

            {/* Radio group 'Inter cluster' */}
            <FormControl component="fieldset" fullWidth margin="normal">
              <FormLabel>Inter cluster</FormLabel>
              <Card className="card-container">
                <CardContent className="card-content">
                    <RadioGroup
                      name        = "inter_cluster"
                      value       = {this.props.doc.inter_cluster}
                      onChange    = {this.props.handleRadioChange}
                    >
                      <FormControlLabel value="0"  control={<Radio color="primary" />} label="N/A" />
                      <FormControlLabel value="1"  control={<Radio color="primary" />} label="No" />
                      <FormControlLabel value="2"  control={<Radio color="primary" />} label="Yes" />
                    </RadioGroup>
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

ClusterForm.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ClusterForm);