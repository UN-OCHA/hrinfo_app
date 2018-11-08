import React from 'react';
import MaterialSelect from './MaterialSelect';
import DropboxChooser from 'react-dropbox-chooser';
import { translate } from 'react-i18next';
import HRInfoAPI from '../api/HRInfoAPI';

import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Avatar from '@material-ui/core/Avatar';
import TextField from "@material-ui/core/TextField/TextField";

class HRInfoFilesAccessibility extends React.Component {
  constructor(props) {
    super(props);
    const { t } = this.props;
    this.accessibility = [
      {value: t('files.accessibilities.available'), label: t('files.accessibilities.available') },
      {value: t('files.accessibilities.request'), label: t('files.accessibilities.request') },
      {value: t('files.accessibilities.restricted'), label: t('files.accessibilities.restricted') },
      {value: t('files.accessibilities.not_available'), label: t('files.accessibilities.not_available') },
      {value: t('files.accessibilities.not_applicable'), label: t('files.accessibilities.not_applicable') },
    ];
    this.state = {
      file: '',
      accessibility: '',
      status: '',
      instructions: '',
      url: ''
    };
    this.fileId = 'file_' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

    this.hrinfoAPI = new HRInfoAPI();

    this.handleChange = this.handleChange.bind(this);
    this.changeState = this.changeState.bind(this);
  }

  handleChange(type, v) {
    if (this.state.status === '') {
      this.setState({
        status: 'ready'
      });
    }
    if (type === 'file') {
      let file = this.state.file;
      const that = this;
      file = 'uploading';
      this.setState({
        file: file
      });

      this.hrinfoAPI
        .saveFile(v)
        .then(doc => {
          file = doc[0];
          that.changeState({
            file: file
          });
        });
    }
    else if (type === 'instructions') {
      let instructions = this.state.instructions;
      instructions = v.target.value;
      this.setState({
        instructions: instructions
      });
    }
    else if (type === 'url') {
      let url = this.state.url;
      url = v.target.value;
      this.setState({
        url: url
      });
    }
    else {
      let accessibility = this.state.accessibility;
      accessibility = v;
      this.changeState({
        accessibility: accessibility
      });
    }
  }

  changeState(newState) {
    this.setState(newState);
    if (this.props.onChange) {
      this.props.onChange({
        file: newState.file ? newState.file : this.state.file,
        accessibility: newState.accessibility ? newState.accessibility : this.state.accessibility,
        instructions: newState.instructions ? newState.instructions : this.state.instructions,
        url: newState.url ? newState.url : this.state.url
      });
    }
  }

  componentDidUpdate() {
    if (this.props.value && this.state.status === '') {
      let state = {
        accessibility: '',
        url: '',
        files: '',
        instructions: '',
        status: 'updated'
      };
      if (this.props.value.accessibility) {
        state.accessibility = {
          value: this.props.value.accessibility,
          label: this.props.value.accessibility
        };
        if (this.props.value.url) {
          state.url = this.props.value.url;
        }
        if (this.props.value.instructions) {
          state.instructions = this.props.value.instructions;
        }
        if (this.props.value.file) {
          this.props.value.file.label = this.props.value.file.filename;
          state.file = this.props.value.file;
        }
      }
      this.changeState(state);
    }
  }

  render () {
    const { t } = this.props;
    return (
      <div className={this.props.className}>
        <Card className="card-container">
          <CardHeader
            avatar={
              <Avatar>
                <i className="icon-document" />
              </Avatar>
            }
            title={
              typeof this.state.file === 'object' ?
                <a href={this.state.file.uri} target="__blank">{this.state.file.label}</a> : t('files.new_file')}
            className="file-name"
          />
          <CardContent className="file-container-language">
            <Typography>{t('files.accessibility')}</Typography>
            <MaterialSelect options={this.accessibility}
                            name='accessibility'
                            onChange={ (s) => this.handleChange('accessibility', s)}
                            value={this.state.accessibility} />
          </CardContent>
          {this.state.accessibility && this.state.accessibility.value === t('files.accessibilities.request') ?
            <CardContent className="file-container-language">
              <Typography>
                {t('files.accessibilities.instructions')}
              </Typography>
              <TextField type      = "text"
                         name      = "instructions"
                         multiline = {true}
                         rowsMax   = "4"
                         fullWidth = {true}
                         value     = {this.state.instructions}
                         onChange  = { (s) => this.handleChange('instructions', s)}/>
            </CardContent> : ''
          }
          {this.state.accessibility && this.state.accessibility.value === t('files.accessibilities.available') ?
            <CardContent className="file-container-language">
              <Typography>{t('url')}</Typography>
                <TextField type      = "text"
                           name      = "url"
                           fullWidth = {true}
                           value     = {this.state.url}
                           onChange  = { (s) => this.handleChange('url', s)}/>
            </CardContent> : ''
          }
          <CardActions className="file-container-language">
            {this.state.accessibility && this.state.accessibility.value === t('files.accessibilities.available') ?
              <span className="file-container-actions">
                <input type="file"
                       id={this.fileId}
                       name='file'
                       className="none"
                       onChange={ (e) => this.handleChange('file', e.target.files) } />
                <label htmlFor={this.fileId}>
                  <Button component="span" color="primary" variant="outlined" size="small">
                    {t('files.from_storage')}
                  </Button>
                </label>
                <DropboxChooser
                  appKey='e000wzkrc14aj26'
                  success={files => this.handleChange('file', files)}
                  multiselect={false}
                  extensions={['.pdf']}>
                  <Button color="primary" variant="outlined" size="small">{t('files.from_dropbox')}</Button>
                </DropboxChooser>
              </span> : ''
            }
            {this.state.file === 'uploading' ?
              <CircularProgress/> : ''
            }
          </CardActions>
        </Card>
      </div>
    );
  }
}

export default translate('forms')(HRInfoFilesAccessibility);
