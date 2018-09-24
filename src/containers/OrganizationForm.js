import React      from 'react';
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

//Components
import HRInfoSelect          from '../components/HRInfoSelect';

//Material plugin
import FormHelperText   from '@material-ui/core/FormHelperText';
import FormControl      from '@material-ui/core/FormControl';
import FormLabel        from '@material-ui/core/FormLabel';
import TextField        from '@material-ui/core/TextField';
import Button           from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import Card             from '@material-ui/core/Card';
import Grid             from '@material-ui/core/Grid';
import Snackbar         from '@material-ui/core/Snackbar';
import Typography       from '@material-ui/core/Typography';

//Material
import './EventForm.css';

class OrganizationForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      wasSubmitted : false
    };

    this.hideAlert = this.hideAlert.bind(this);
    this.submit    = this.submit.bind(this);
  }

  hideAlert() {
    this.setState({ wasSubmitted: false });
  }

  submit() {
    this.setState({ wasSubmitted: true });
  }

  render() {
    return(
      <Grid container direction="column" alignItems="center">
        <Typography color="textSecondary" gutterBottom variant="headline">Create {this.props.label}</Typography>
        <Grid item>
          <Grid container justify="space-around">

            {/* LEFT COLUMN */}
            <Grid item md={6} xs={11}>

              {/* Name */}
              <FormControl required fullWidth margin="normal">
                <FormLabel focused error={this.props.status === 'was-validated' && !this.props.isValid(this.props.doc.label)}>Name</FormLabel>
                <TextField type = "text"
                  name     = "label"
                  id       = "label"
                  value    = {this.props.doc.label || ''}
                  onChange = {this.props.handleInputChange}/>
                <FormHelperText id = "label-text">
                  Type the original name of the {this.props.label + ' '}. Try not to use abbreviations. To see Standards and Naming Conventions click
                  <a href = "https://drive.google.com/open?id=1TxOek13c4uoYAQWqsYBhjppeYUwHZK7nhx5qgm1FALA"> here</a>.
                  </FormHelperText>
                </FormControl>

                {/* Type */}
                <FormControl required fullWidth margin="normal">
                  <FormLabel focused error = {this.props.status === 'was-validated' && !this.props.isValid(this.props.doc.type)}>Type</FormLabel>
                  <HRInfoSelect type = "organization_types"
                    isMulti  = {false}
                    onChange = {(s) => this.props.handleSelectChange('type', s)}
                    value    = {this.props.doc.type || ''}/>
                  <FormHelperText id="type-text">
                    From the list, select the type of {this.props.label} you are creating.
                  </FormHelperText>
                </FormControl>

              </Grid>

              {/* RIGHT COLUMN */}
              <Grid item md={3} xs={11}>

                {/* Acronym */}
                <FormControl fullWidth margin="normal">
                  <FormLabel>Acronym</FormLabel>
                  <TextField type     = "text"
                             name     = "acronym"
                             id       = "acronym"
                             value    = {this.props.doc.acronym || ''}
                             onChange = {this.props.handleInputChange}/>
                </FormControl>

                {/* Website */}
                <FormControl fullWidth margin="normal">
                  <FormLabel>Website</FormLabel>
                  <TextField type     = "url"
                             name     = "homepage"
                             id       = "homepage"
                             value    = {this.props.doc.homepage || ''}
                             onChange = {this.props.handleInputChange}/>
                </FormControl>

                {/* FTS ID */}
                <FormControl fullWidth margin = "normal">
                  <FormLabel>FTS ID</FormLabel>
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
                <Button color="primary" variant="contained" onClick={(evt) => {this.props.handleSubmit(evt); this.submit()}}>Publish</Button>
                &nbsp;
                <Button color="secondary" variant="contained" onClick={(evt) => {this.props.handleSubmit(evt, 1); this.submit()}}>Save as Draft</Button>
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
                <Button color="secondary" variant="contained" onClick={this.props.handleDelete}>Delete</Button>
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
                    message          = {<Typography id ="message-id" color="error">The form is incomplete and could not be submitted.</Typography>}
                    action           = {[
                                         <Button key="undo" color="secondary" size="small" onClick={this.hideAlert}>CLOSE</Button>
                                       ]}
            />
        </Grid>
    );
  }
}

export default OrganizationForm;
