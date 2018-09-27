import React from 'react';
import { EditorState, ContentState, convertFromHTML } from 'draft-js';
import { translate, Trans } from 'react-i18next';

import HRInfoAPI from '../api/HRInfoAPI';

//Components
import LanguageSelect     from '../components/LanguageSelect';
import Address            from '../components/Address';
import HRInfoLocations    from '../components/HRInfoLocations';
import HRInfoAsyncSelect  from '../components/HRInfoAsyncSelect';
import HRInfoSelect       from '../components/HRInfoSelect';
import Phones             from '../components/Phones';

//Material Components
import FormHelperText   from '@material-ui/core/FormHelperText';
import FormControl      from '@material-ui/core/FormControl';
import FormLabel        from '@material-ui/core/FormLabel';
import TextField        from '@material-ui/core/TextField';
import Button           from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import Grid             from '@material-ui/core/Grid';
import Snackbar         from '@material-ui/core/Snackbar';
import Typography       from '@material-ui/core/Typography';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Card             from "@material-ui/core/Card/Card";
import CardContent      from "@material-ui/core/CardContent/CardContent";
import Switch           from "@material-ui/core/Switch/Switch";


class OfficesForm extends React.Component {
    constructor(props) {
      super(props);

      this.state = {
        editorState: EditorState.createEmpty(),
        status             : '',
        languages          : null
      };

      this.hrinfoAPI      = new HRInfoAPI();
    }

  async componentDidMount() {
    if (this.props.match.params.id) {
      const doc = await this.hrinfoAPI.getItem('offices', this.props.match.params.id);
      doc.spaces = [];
      doc.operation.forEach(function (op) {
        if (op) {
          doc.hasOperation = true;
          op.type = "operations";
          doc.spaces.push(op);
        }
      });
      if (doc.language === undefined) {
        doc.language = null;
      }
      let state = {
        doc: doc
      };
      if (doc['body-html']) {
        const blocksFromHTML = convertFromHTML(doc['body-html']);
        const contentState = ContentState.createFromBlockArray(
          blocksFromHTML.contentBlocks,
          blocksFromHTML.entityMap
        );
        state.editorState = EditorState.createWithContent(contentState);
      }
      this.setState(state);
    }
  }

  submit() {
    this.setState({ wasSubmitted: true });
  }

    render() {
      const { t, label } = this.props;

      return (
        <Grid container direction="column" alignItems="center">
          <Typography color="textSecondary" gutterBottom variant="headline">{t('offices.create')}</Typography>
          <Grid item>
            <Grid container justify="space-around">
              {/* FIRST COLUMN */}
              <Grid item md={6} xs={11}>
                {/* Title */}
                <FormControl required fullWidth margin="normal">
                  <FormLabel focused error={this.props.status === 'was-validated' && !this.props.isValid(this.props.doc.label)}>{t('title')}</FormLabel>
                  <TextField
                    type     = "text"
                    name     = "label"
                    id       = "label"
                    value    = {this.props.doc.label}
                    onChange = {this.props.handleInputChange}/>
                  <FormHelperText id = "label-text">
                    <Trans i18nKey={label + '.helpers.title'}>
                      Type the original title of the document. Try not to use abbreviations. To see Standards and Naming Conventions click
                      <a href = "https://drive.google.com/open?id=1TxOek13c4uoYAQWqsYBhjppeYUwHZK7nhx5qgm1FALA"> here</a>.
                    </Trans>
                  </FormHelperText>
                </FormControl>

                {/* Location */}
                <FormControl fullWidth margin="normal">
                  <FormLabel>{t('location')}</FormLabel>
                  <HRInfoLocations
                    onChange = {(s) => this.props.handleSelectChange('location', s)}
                    value    = {this.props.doc.location}
                    id       = "location"/>
                  <FormHelperText id="location-text">
                    <Trans i18nKey={label + '.helpers.location'}>
                      Select from the menu the country where the office is located
                      and indicate more specific locations by selecting multiple layers (region, province, town).
                    </Trans>
                  </FormHelperText>
                </FormControl>

                {/* Address */}
                <FormControl required fullWidth margin="normal">
                  <FormLabel focused error={this.props.status === 'was-validated' && !this.props.isValid(this.props.doc.address)}>{t('address')}</FormLabel>
                  <Address
                    onChange={(s) => this.props.handleSelectChange('address', s)}
                    value={this.props.doc.address} />
                  <FormHelperText id="address-text">
                    <Trans i18nKey={label + '.helpers.address'}>
                      Indicate the address of the office.
                    </Trans>
                  </FormHelperText>
                </FormControl>

                {/* Operation(s)/Webspace(s) */}
                <FormControl required fullWidth margin="normal">
                  <FormLabel focused error ={this.props.status === 'was-validated' && !this.props.isValid(this.props.doc.spaces)}>{t('spaces')}</FormLabel>
                  <HRInfoSelect type    = "operations"
                                isMulti = {true}
                                onChange={(s) => this.props.handleSelectChange('spaces', s)}
                                value   = {this.props.doc.spaces}/>
                  <FormHelperText id="spaces-text">
                    <Trans i18nKey={label + '.helpers.spaces'}>Click on the field and select where to publish the office
                      (operation, regional site or thematic site).</Trans>
                  </FormHelperText>
                </FormControl>
              </Grid>

              {/* SECOND COLUMN */}
              <Grid item md={3} xs={11}>
                {/* Language */}
                <FormControl fullWidth margin="normal">
                  <FormLabel>{t('language')}</FormLabel>
                  <LanguageSelect
                    value     = {this.props.doc.language}
                    onChange  = {(s) => this.props.handleSelectChange('language', s)}
                    className = {this.props.isValid(this.props.doc.language) ? 'is-valid' : 'is-invalid'}/>
                  <FormHelperText id="language-text">
                    <Trans i18nKey={label + '.helpers.language'}>
                      Select the language of the office.
                    </Trans>
                  </FormHelperText>
                </FormControl>

                {/* Email */}
                <FormControl fullWidth margin="normal">
                  <FormLabel>{t('email')}</FormLabel>
                  <TextField
                    type     = "email"
                    name     = "email"
                    id       = "email"
                    value    = {this.props.doc.email || ""}
                    onChange = {this.props.handleInputChange}/>
                  <FormHelperText id = "email-text">
                    <Trans i18nKey={label + '.helpers.email'}>
                      Type in the email.
                    </Trans>
                  </FormHelperText>
                </FormControl>

                {/* Phones */}
                <FormControl fullWidth margin = "normal">
                  <FormLabel>{t('phones.phones')}</FormLabel>
                  <Phones onChange={(s) => this.props.handleSelectChange('phones', s)}
                          onInputChange={this.props.handleInputChange}
                          value={this.props.doc.phones} />
                  <FormHelperText id = "report-text">
                    <Trans i18nKey='helpers.phones'>Phone numbers.</Trans>
                  </FormHelperText>
                </FormControl>

                {/* Organizations */}
                <FormControl fullWidth margin="normal">
                  <FormLabel>{t('organizations')}</FormLabel>
                  <HRInfoAsyncSelect
                    type     = "organizations"
                    onChange = {(s) => this.props.handleSelectChange('organizations', s)}
                    value    = {this.props.doc.organizations}
                    isMulti={true} />
                  <FormHelperText id="organizations-text">
                    <Trans i18nKey={label + '.helpers.organizations'}>
                      Type in and select the organization(s) of the office.
                    </Trans>
                  </FormHelperText>
                </FormControl>

                {/* Coordination Hub */}
                <FormControl fullWidth margin="normal">
                  <FormLabel focused={false}>{t('coordination_hubs')}</FormLabel>
                  <Card className="card-container">
                    <CardContent className="card-content">
                      <FormControlLabel
                      control = {
                        <Switch name     = "coordination_hub"
                                color    = "primary"
                                onChange = {this.props.handleInputChange}
                                checked  = {this.props.doc.coordination_hub}
                        />
                      }
                      label   = {this.props.doc.coordination_hub ? t('offices.helpers.is_coordination_hub') : t('offices.helpers.is_not_coordination_hub')}
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

export default translate('forms')(OfficesForm);
