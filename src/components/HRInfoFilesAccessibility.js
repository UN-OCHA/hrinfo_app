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
      inputNumber: 0,
      collections: [''],
      files: [''],
      accessibility: [{}],
      status: '',
      instructions: [''],
      url: ['']
    };

    this.hrinfoAPI = new HRInfoAPI();

    this.getRow = this.getRow.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.changeState = this.changeState.bind(this);
  }

  getRow (number) {
    const { t } = this.props;
    return (
      <Card key={number} className="card-container">
        <CardHeader
          avatar={
            <Avatar>
              <i className="icon-document" />
            </Avatar>
          }
          title={
            typeof this.state.files[number] === 'object' ?
              <a href={this.state.files[number].uri} target="__blank">{this.state.files[number].label}</a> : t('files.new_file')}
          className="file-name"
        />
        <CardContent className="file-container-language">
          <Typography>{t('files.accessibility')}</Typography>
          <MaterialSelect options={this.accessibility}
                          name={'accessibility' + number}
                          onChange={ (s) => this.handleChange(number, 'accessibility', s)}
                          value={this.state.accessibility[number]} />
        </CardContent>
        {this.state.accessibility[number] && this.state.accessibility[number].value === t('files.accessibilities.request') ?
          <CardContent className="file-container-language">
            <Typography>
              {t('files.accessibilities.instructions')}
            </Typography>
            <TextField type      = "text"
                       name      = "instructions"
                       id        = "instructions"
                       multiline = {true}
                       rowsMax   = "4"
                       fullWidth = {true}
                       value     = {this.state.instructions[number]}
                       onChange  = { (s) => this.handleChange(number, 'instructions', s)}/>
          </CardContent> : ''
        }
        {this.state.accessibility[number] && this.state.accessibility[number].value === t('files.accessibilities.available') ?
          <CardContent className="file-container-language">
            <Typography>{t('url')}</Typography>
              <TextField type      = "text"
                         name      = "url"
                         id        = "url"
                         fullWidth = {true}
                         value     = {this.state.url[number]}
                         onChange  = { (s) => this.handleChange(number, 'url', s)}/>
          </CardContent> : ''
        }
        <CardActions className="file-container-language">
          {this.state.accessibility[number] && this.state.accessibility[number].value === t('files.accessibilities.available') ?
            <span className="file-container-actions">
              <input type="file"
                     id={'files_' + number }
                     name={'files_' + number }
                     className="none"
                     onChange={ (e) => this.handleChange(number, 'file', e.target.files) } />
              <label htmlFor={'files_' + number}>
                <Button component="span" color="primary" variant="outlined" size="small">
                  {t('files.from_storage')}
                </Button>
              </label>
              <DropboxChooser
                appKey='e000wzkrc14aj26'
                success={files => this.handleChange(number, 'file', files)}
                multiselect={false}
                extensions={['.pdf']}>
                <Button color="primary" variant="outlined" size="small">{t('files.from_dropbox')}</Button>
              </DropboxChooser>
            </span> : ''
          }
          {this.state.files[number] === 'uploading' ?
            <CircularProgress/> : ''
          }
        </CardActions>
      </Card>
    );
  }

  handleChange(number, type, v) {
    if (this.state.status === '') {
      this.setState({
        status: 'ready'
      });
    }
    if (type === 'file') {
      let files = this.state.files;
      const that = this;
      files[number] = 'uploading';
      this.setState({
        files: files
      });

      this.hrinfoAPI
        .saveFile(v)
        .then(doc => {
          files[number] = doc[0];
          that.changeState({
            files: files
          });
        });
    }
    else if (type === 'instructions') {
      let instructions = this.state.instructions;
      instructions[number] = v.target.value;
      this.setState({
        instructions: instructions
      });
    }
    else if (type === 'url') {
      let url = this.state.url;
      url[number] = v.target.value;
      this.setState({
        url: url
      });
    }
    else {
      let accessibility = this.state.accessibility;
      accessibility[number] = v;
      this.changeState({
        accessibility: accessibility
      });
    }
  }

  changeState(newState) {
    this.setState(newState);
    if (this.props.onChange) {
      this.props.onChange({
        files: newState.files ? newState.files : this.state.files,
        accessibility: newState.accessibility ? newState.accessibility : this.state.accessibility,
        instructions: newState.instructions ? newState.instructions : this.state.instructions,
        url: newState.url ? newState.url : this.state.url
      });
    }
  }

  componentDidUpdate() {
    if (this.props.value && this.state.status === '') {
      let state = {
        inputNumber: 0,
        accessibility: [{}],
        url: [''],
        files: [],
        instructions: [''],
        status: 'updated'
      };
      if (this.props.value.accessibility instanceof Array) {
        this.props.value.accessibility.forEach((access) => {
          state.accessibility.push({
            value: access,
            label: access
          });
          state.inputNumber++;
        });
        if (this.props.value.url instanceof Array) {
          this.props.value.url.forEach((access) => {
            state.url.push(access);
          });
        }
        if (this.props.value.instructions instanceof Array) {
          this.props.value.instructions.forEach((access) => {
            state.instructions.push(access);
          });
        }
        if (this.props.value.file instanceof Array) {
          this.props.value.file.forEach((access) => {
            access.label = access.filename;
            state.files.push(access);
          });
        }
      }
      else if (this.props.value.accessibility) {
        state.accessibility = [{
          value: this.props.value.accessibility,
          label: this.props.value.accessibility
        }];
        if (this.props.value.url) {
          state.url = [this.props.value.url];
        }
        if (this.props.value.instructions) {
          state.instructions = [this.props.value.instructions];
        }
        if (this.props.value.file) {
          this.props.value.file.label = this.props.value.file.filename;
          state.files = [this.props.value.file];
        }
        state.inputNumber++;
      }
      this.changeState(state);
    }
  }

  render () {
    let rows = [];
    for (let i = 0; i < this.state.inputNumber; i++) {
      rows.push(this.getRow(i));
    }
    return (
      <div className={this.props.className}>
        {rows}
      </div>
    );
  }
}

export default translate('forms')(HRInfoFilesAccessibility);
