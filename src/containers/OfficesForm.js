import React from 'react';

//Components
import LanguageSelect     from '../components/LanguageSelect';
import Address            from '../components/Address';
import HRInfoLocations    from '../components/HRInfoLocations';
import HRInfoAsyncSelect  from '../components/HRInfoAsyncSelect';
//Material Components
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
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox         from '@material-ui/core/Checkbox';


class OfficesForm extends React.Component {

    render() {
      return (
        <Grid container direction="column" alignItems="center">
          <Typography color="textSecondary" gutterBottom variant="headline">Create {this.props.doc.label}</Typography>
          <Grid item>
            <Grid container justify="space-around">
              {/* FIRST COLUMN */}
              <Grid item md={6} xs={11}>
                {/* Title */}
                <FormControl required fullWidth margin="normal">
                  <FormLabel focused error={this.props.status === 'was-validated' && !this.props.isValid(this.props.doc.label)}>Title</FormLabel>
                  <TextField
                    type     = "text"
                    name     = "label"
                    id       = "label"
                    value    = {this.props.doc.label}
                    onChange = {this.props.handleInputChange}/>
                  <FormHelperText id = "label-text">
                    Type the original title of the document. Try not to use abbreviations. To see Standards and Naming Conventions click
                    <a href = "https://drive.google.com/open?id=1TxOek13c4uoYAQWqsYBhjppeYUwHZK7nhx5qgm1FALA"> here</a>.
                  </FormHelperText>
                </FormControl>

                {/* Location */}
                <FormControl fullWidth margin="normal">
                  <FormLabel>Location</FormLabel>
                  <HRInfoLocations
                    onChange = {(s) => this.props.handleSelectChange('location', s)}
                    value    = {this.props.doc.location}
                    id       = "location"/>
                  <FormHelperText id="location-text">
                    Select from the menu the country(ies) the document is about
                    and indicate more specific locations by selecting multiple layers (region, province, town).
                  </FormHelperText>
                </FormControl>

                {/* Address */}
                <FormControl required fullWidth margin="normal">
                  <FormLabel focused error={this.props.status === 'was-validated' && !this.props.isValid(this.props.doc.address)}>Address</FormLabel>
                  <Address
                    onChange={(s) => this.props.handleSelectChange('address', s)}
                    value={this.props.doc.address} />
                  <FormHelperText id="address-text">
                    Indicate the address of the office.
                  </FormHelperText>
                </FormControl>

                {/* Webspaces */}
              </Grid>

              {/* SECOND COLUMN */}
              <Grid item md={3} xs={11}>
                {/* Language */}
                <FormControl fullWidth margin="normal">
                  <FormLabel>Language</FormLabel>
                  <LanguageSelect
                    value     = {this.props.doc.language}
                    onChange  = {(s) => this.props.handleSelectChange('language', s)}
                    className = {this.props.isValid(this.props.doc.language) ? 'is-valid' : 'is-invalid'}/>
                  <FormHelperText id="language-text">
                    Select the language of the document.
                  </FormHelperText>
                </FormControl>

                {/* Email */}
                <FormControl fullWidth margin="normal">
                  <FormLabel>Email</FormLabel>
                  <TextField
                    type     = "email"
                    name     = "email"
                    id       = "email"
                    value    = {this.props.doc.email || ""}
                    onChange = {this.props.handleInputChange}/>
                  <FormHelperText id = "email-text">
                    Type in the email.
                  </FormHelperText>
                </FormControl>

                {/* Phones */}

                {/* Organizations */}
                <FormControl fullWidth margin="normal">
                  <FormLabel>Organization(s)</FormLabel>
                  <HRInfoAsyncSelect
                    type     = "organizations"
                    onChange = {(s) => this.props.handleSelectChange('organizations', s)}
                    value    = {this.props.doc.organizations}
                    isMulti={true} />
                  <FormHelperText id="organizations-text">
                    Type in and select the organization(s) of the {this.props.label}.
                  </FormHelperText>
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
                <Button color="secondary" variant="contained" onClick={(evt) => {this.props.handleSubmit(evt, 1); this.submit()}}>Save as draft</Button>
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
              vertical  : 'bottom',
              horizontal: 'left'
            }}
            open             = {this.props.status === 'was-validated' && this.state.wasSubmitted}
            autoHideDuration = {6000}
            onClose          = {this.hideAlert}
            ContentProps     = {{
              'aria-describedby' : 'message-id'
            }}
            message={<Typography id ="message-id" color="error">The form is incomplete.</Typography>}
            action={[
              <Button key="undo" color="secondary" size="small" onClick={this.hideAlert}>
                Close
              </Button>
            ]}
          />
        </Grid>
      );
    }
}

export default OfficesForm;
