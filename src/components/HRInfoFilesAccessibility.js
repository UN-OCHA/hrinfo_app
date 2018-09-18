import React from 'react';
import MaterialSelect from './MaterialSelect';
import DropboxChooser from 'react-dropbox-chooser';
import { translate } from 'react-i18next';
import HRInfoAPI from '../api/HRInfoAPI';

import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Avatar from '@material-ui/core/Avatar';

class HRInfoFilesAccessibility extends React.Component {
  constructor(props) {
    super(props);
    const { t } = this.props;
    this.accessibility = [
      {value: t('files.accessibilities.none'), label: t('files.accessibilities.none') },
      {value: t('files.accessibilities.available'), label: t('files.accessibilities.available') },
      {value: t('files.accessibilities.request'), label: t('files.accessibilities.request') },
      {value: t('files.accessibilities.restricted'), label: t('files.accessibilities.restricted') },
      {value: t('files.accessibilities.not_available'), label: t('files.accessibilities.not_available') },
      {value: t('files.accessibilities.not_applicable'), label: t('files.accessibilities.not_applicable') },
    ];
    this.state = {
      inputNumber: 1,
      collections: [''],
      files: [''],
      accessibility: [''],
      status: '',
      instructions: ''
    };

    this.hrinfoAPI = new HRInfoAPI();

    this.getRow = this.getRow.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.onAddBtnClick = this.onAddBtnClick.bind(this);
    this.changeState = this.changeState.bind(this);
    this.removeFileRow = this.removeFileRow.bind(this);
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
          action={
            <IconButton color="primary" onClick={(e) => this.removeFileRow(number)}>
              <i className="icon-trash" />
            </IconButton>
          }
          title={
            typeof this.state.files[number] === 'object' ?
              <a href={this.state.files[number].uri} target="__blank" className="file-name">{this.state.files[number].label}</a> : t('files.new_file')
          }
        />
        <CardContent className="file-container-language">
          <Typography>{t('files.accessibility')}</Typography>
          <MaterialSelect options={this.accessibility}
                          name={'accessibility' + number}
                          onChange={ (s) => this.handleChange(number, 'accessibility', s)}
                          value={this.state.accessibility[number]} />
        </CardContent>
        <CardActions>
          {this.state.accessibility[number].value === t('files.accessibilities.available') ?
            <span className="file-container-actions">
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
          {this.state.accessibility[number].value === t('files.accessibilities.request') ?
            <span className="file-container-actions">
              <label htmlFor={'instructions'}>
                Instructions
              </label>
                <input id       = "instructions"
                       type     = "textarea"
                       name     = "instructions"
                       onChange = {(s) => this.props.handleSelectChange('instructions', s)}
                       value    = {this.state.instructions}/>
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
          collections: newState.collections ? newState.collections : this.state.collections
        });
        }
        }

          removeFileRow (number) {
          let collections = this.state.collections;
          const itemId = this.state.files[number].item_id;
          if (itemId) {
          const that = this;
          // The file is already part of a field_collection, send a DELETE request
          this.hrinfoAPI
          .remove('files_collection', itemId)
          .then(results => {
          const colIndex = this.state.collections.indexOf(itemId);
          if (colIndex !== -1) {
          collections = collections.filter(function (id) {
          return id !== itemId;
        });
        }
          that.setState((prevState, props) => {
          prevState.files.splice(number, 1);
          return {
          files: prevState.files,
          inputNumber: prevState.inputNumber - 1,
          collections: collections
        }
        });
        })
        }
          else {
          this.setState((prevState, props) => {
          prevState.files.splice(number, 1);
          return {
          files: prevState.files,
          inputNumber: prevState.inputNumber - 1,
          collections: collections
        }
        });
        }
        }

          onAddBtnClick (event) {
          let files = this.state.files;
          for (let i = 0; i < this.state.inputNumber + 1; i++) {
          if (!files[i]) {
          files[i] = "";

        }
        }
          this.setState({
          inputNumber: this.state.inputNumber + 1,
          files: files
        });
        }

          componentDidUpdate() {
          if (this.props.value && this.state.status === '') {
          const that = this;
          let state = {
          inputNumber: 0,
          collections: [],
          files: [],
          languages: [],
          status: 'updated'
        };
          this.props.value.forEach(function (fc) {
          state.collections.push(fc.item_id);
          fc.fid = fc.file.fid;
          fc.uri = fc.file.url;
          fc.label = fc.file.filename;
          state.files.push(fc);
          that.languages.forEach(function (l) {
          if (l.value === fc.language) {
          state.languages.push(l);
        }
        });
          state.inputNumber++;
        });
          this.changeState(state);
        }
        }

          render () {
          const { t } = this.props;
          let rows = [];
          for (let i = 0; i < this.state.inputNumber; i++) {
          rows.push(this.getRow(i));
        }
          return (
          <div className={this.props.className}>
          {rows}
          <Button variant="outlined" onClick={this.onAddBtnClick}>
          <i className="icon-document" /> &nbsp; {t('add_another')}
          </Button>
          </div>
          );
        }
          }

          export default translate('forms')(HRInfoFilesAccessibility);
