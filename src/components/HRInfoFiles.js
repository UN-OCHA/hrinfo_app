import React from 'react';
import MaterialSelect from './MaterialSelect';
import DropboxChooser from 'react-dropbox-chooser';
import HRInfoAPI from '../api/HRInfoAPI';

import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import FormControl from '@material-ui/core/FormControl';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';

class HRInfoFiles extends React.Component {
    constructor(props) {
      super(props);
      this.languages = [
        {value: 'aa', label: 'Afar' },
        {value: 'ab', label: 'Abkhazian' },
        {value: 'ae', label: 'Avestan'},
        {value: 'af', label: 'Afrikaans'},
        {value: 'ak', label: 'Akan'},
        {value: 'am', label: 'Amharic'},
        {value: 'ar', label: 'Arabic'},
        {value: 'as', label: 'Assamese'},
        {value: 'ast', label: 'Asturian'},
        {value: 'av', label: 'Avar'},
        {value: 'ay', label: 'Aymara'},
        {value: 'az', label: 'Azerbaijani'},
        {value: 'ba', label: 'Bashkir'},
        {value: 'be', label: 'Belarusian' },
        {value: 'bg', label: 'Bulgarian' },
        {value: 'bh', label: 'Bihari' },
        {value: 'bi', label: 'Bislama' },
        {value: 'bm', label: 'Bambara' },
        {value: 'bn', label: 'Bengali' },
        {value: 'bo', label: 'Tibetan' },
        {value: 'br', label: 'Breton' },
        {value: 'bs', label: 'Bosnian' },
        {value: 'ca', label: 'Catalan' },
        {value: 'ce', label: 'Chechen' },
        {value: 'ch', label: 'Chamorro' },
        {value: 'co', label: 'Corsican' },
        {value: 'cr', label: 'Cree' },
        {value: 'cs', label: 'Czech' },
        {value: 'cu', label: 'Old Slavonic' },
        {value: 'cv', label: 'Chuvash' },
        {value: 'cy', label: 'Welsh' },
        {value: 'da', label: 'Danish' },
        {value: 'de', label: 'German' },
        {value: 'dv', label: 'Maldivian' },
        {value: 'dz', label: 'Bhutani' },
        {value: 'ee', label: 'Ewe' },
        {value: 'el', label: 'Greek' },
        {value: 'en', label: 'English' },
        {value: 'en-gb', label: 'English, British' },
        {value: 'eo', label: 'Esperanto' },
        {value: 'es', label: 'Spanish' },
        {value: 'et', label: 'Estonian' },
        {value: 'eu', label: 'Basque' },
        {value: 'fa', label: 'Persian' },
        {value: 'ff', label: 'Fulah' },
        {value: 'fi', label: 'Finnish' },
        {value: 'fil', label: 'Filipino' },
        {value: 'fj', label: 'Fiji' },
        {value: 'fo', label: 'Faeroese' },
        {value: 'fr', label: 'French' },
        {value: 'fy', label: 'Frisian' },
        {value: 'ga', label: 'Irish' },
        {value: 'gd', label: 'Scots Gaelic' },
        {value: 'gl', label: 'Galician' },
        {value: 'gn', label: 'Guarani' },
        {value: 'gsw-berne', label: 'Swiss German' },
        {value: 'gu', label: 'Gujarati' },
        {value: 'gv', label: 'Manx' },
        {value: 'ha', label: 'Hausa' },
        {value: 'he', label: 'Hebrew' },
        {value: 'hi', label: 'Hindi' },
        {value: 'ho', label: 'Hiri Motu' },
        {value: 'hr', label: 'Croatian' },
        {value: 'ht', label: 'Haitian Creole' },
        {value: 'hu', label: 'Hungarian' },
        {value: 'hy', label: 'Armenian' },
        {value: 'hz', label: 'Herero' },
        {value: 'ia', label: 'Interlingua' },
        {value: 'id', label: 'Indonesian' },
        {value: 'ie', label: 'Interlingue' },
        {value: 'ig', label: 'Igbo' },
        {value: 'ik', label: 'Inupiak' },
        {value: 'is', label: 'Icelandic' },
        {value: 'it', label: 'Italian' },
        {value: 'iu', label: 'Inuktitut' },
        {value: 'ja', label: 'Japanese' },
        {value: 'jv', label: 'Javanese' },
        {value: 'ka', label: 'Georgian' },
        {value: 'kg', label: 'Kongo' },
        {value: 'ki', label: 'Kikuyu' },
        {value: 'kj', label: 'Kwanyama' },
        {value: 'kk', label: 'Kazakh' },
        {value: 'kl', label: 'Greenlandic' },
        {value: 'km', label: 'Cambodian' },
        {value: 'kn', label: 'Kannada' },
        {value: 'ko', label: 'Korean' },
        {value: 'kr', label: 'Kanuri' },
        {value: 'ks', label: 'Kashmiri' },
        {value: 'ku', label: 'Kurdish' },
        {value: 'kv', label: 'Komi' },
        {value: 'kw', label: 'Cornish' },
        {value: 'ky', label: 'Kyrgyz' },
        {value: 'la', label: 'Latin' },
        {value: 'lb', label: 'Luxembourgish' },
        {value: 'lg', label: 'Luganda' },
        {value: 'ln', label: 'Lingala' },
        {value: 'lo', label: 'Laothian' },
        {value: 'lt', label: 'Lithuanian' },
        {value: 'lv', label: 'Latvian' },
        {value: 'mg', label: 'Malagasy' },
        {value: 'mh', label: 'Marshallese' },
        {value: 'mi', label: 'Māori' },
        {value: 'mk', label: 'Macedonian' },
        {value: 'ml', label: 'Malayalam' },
        {value: 'mn', label: 'Mongolian' },
        {value: 'mo', label: 'Moldavian' },
        {value: 'mr', label: 'Marathi' },
        {value: 'ms', label: 'Malay' },
        {value: 'mt', label: 'Maltese' },
        {value: 'my', label: 'Burmese' },
        {value: 'na', label: 'Nauru' },
        {value: 'nd', label: 'North Ndebele' },
        {value: 'ne', label: 'Nepali' },
        {value: 'ng', label: 'Ndonga' },
        {value: 'nl', label: 'Dutch' },
        {value: 'nb', label: 'Norwegian Bokmål' },
        {value: 'nn', label: 'Norwegian Nynorsk' },
        {value: 'nr', label: 'South Ndebele' },
        {value: 'nv', label: 'Navajo' },
        {value: 'ny', label: 'Chichewa' },
        {value: 'oc', label: 'Occitan' },
        {value: 'om', label: 'Oromo' },
        {value: 'or', label: 'Oriya' },
        {value: 'os', label: 'Ossetian' },
        {value: 'pa', label: 'Punjabi' },
        {value: 'pi', label: 'Pali' },
        {value: 'pl', label: 'Polish' },
        {value: 'ps', label: 'Pashto' },
        {value: 'pt', label: 'Portuguese, International' },
        {value: 'pt-pt', label: 'Portuguese, Portugal' },
        {value: 'pt-br', label: 'Portuguese, Brazil' },
        {value: 'qu', label: 'Quechua' },
        {value: 'rm', label: 'Rhaeto-Romance' },
        {value: 'rn', label: 'Kirundi' },
        {value: 'ro', label: 'Romanian' },
        {value: 'ru', label: 'Russian' },
        {value: 'rw', label: 'Kinyarwanda' },
        {value: 'sa', label: 'Sanskrit' },
        {value: 'sc', label: 'Sardinian' },
        {value: 'sco', label: 'Scots' },
        {value: 'sd', label: 'Sindhi' },
        {value: 'se', label: 'Northern Sami' },
        {value: 'sg', label: 'Sango' },
        {value: 'sh', label: 'Serbo-Croatian' },
        {value: 'si', label: 'Sinhala' },
        {value: 'sk', label: 'Slovak' },
        {value: 'sl', label: 'Slovenian' },
        {value: 'sm', label: 'Samoan' },
        {value: 'sn', label: 'Shona' },
        {value: 'so', label: 'Somali' },
        {value: 'sq', label: 'Albanian' },
        {value: 'sr', label: 'Serbian' },
        {value: 'ss', label: 'Siswati' },
        {value: 'st', label: 'Sesotho' },
        {value: 'su', label: 'Sudanese' },
        {value: 'sv', label: 'Swedish' },
        {value: 'sw', label: 'Swahili' },
        {value: 'ta', label: 'Tamil' },
        {value: 'te', label: 'Telugu' },
        {value: 'tg', label: 'Tajik' },
        {value: 'th', label: 'Thai' },
        {value: 'ti', label: 'Tigrinya' },
        {value: 'tk', label: 'Turkmen' },
        {value: 'tl', label: 'Tagalog' },
        {value: 'tn', label: 'Setswana' },
        {value: 'to', label: 'Tonga' },
        {value: 'tr', label: 'Turkish' },
        {value: 'ts', label: 'Tsonga' },
        {value: 'tt', label: 'Tatar' },
        {value: 'tw', label: 'Twi' },
        {value: 'ty', label: 'Tahitian' },
        {value: 'ug', label: 'Uyghur' },
        {value: 'uk', label: 'Ukrainian' },
        {value: 'ur', label: 'Urdu' },
        {value: 'uz', label: 'Uzbek' },
        {value: 've', label: 'Venda' },
        {value: 'vi', label: 'Vietnamese' },
        {value: 'wo', label: 'Wolof' },
        {value: 'xh', label: 'Xhosa' },
        {value: 'xx-lolspeak', label: 'Lolspeak' },
        {value: 'yi', label: 'Yiddish' },
        {value: 'yo', label: 'Yoruba' },
        {value: 'za', label: 'Zhuang' },
        {value: 'zh-hans', label: 'Chinese, Simplified' },
        {value: 'zh-hant', label: 'Chinese, Traditional' },
        {value: 'zu', label: 'Zulu' }
      ];
      this.state = {
        inputNumber: 1,
        collections: [''],
        files: [''],
        languages: [''],
        status: ''
      };

      this.hrinfoAPI = new HRInfoAPI();

      this.getRow = this.getRow.bind(this);
      this.handleChange = this.handleChange.bind(this);
      this.onAddBtnClick = this.onAddBtnClick.bind(this);
      this.changeState = this.changeState.bind(this);
      this.removeFileRow = this.removeFileRow.bind(this);
    }

    getRow (number) {
      return (
        <div key={number} className="file-container">
            <FormControl margin="normal" className="file-container-file">
              	<Typography>File</Typography>
              	{this.state.files[number] === '' ?
                	<span>
						<label className="MuiButtonBase-root-102 MuiButton-root-78 MuiButton-text-80 MuiButton-textPrimary-81 MuiButton-flat-83 MuiButton-flatPrimary-84">
							<span>Select File</span>
							<input type="file"
								id={'files_' + number }
								name={'files_' + number }
								className="none"
								onChange={ (e) => this.handleChange(number, 'file', e.target.files) } />
						</label>
	                  	<DropboxChooser
		                    appKey='qe1p4izejvrjlpv'
		                    success={files => this.handleChange(number, 'file', files)}
		                    multiselect={false}
		                    extensions={['.pdf']}
							className="inline">
		                    <Button color="primary">Select from Dropbox</Button>
	                	</DropboxChooser>
              		</span> : ''
              	}
				{this.state.files[number] === 'uploading' ?
					<CircularProgress/> : ''
				}
              	{typeof this.state.files[number] === 'object' ?
                	<div><a href={this.state.files[number].uri} target="__blank">{this.state.files[number].label}</a></div> : ''
              	}
            </FormControl>
            <FormControl margin="normal" className="file-container-language">
              	<Typography>File Language</Typography>
              	<MaterialSelect options={this.languages}
				  	name={'languages_' + number}
				  	onChange={ (s) => this.handleChange(number, 'language', s)}
				  	value={this.state.languages[number]} />
        	</FormControl>
            <IconButton color="primary" onClick={(e) => this.removeFileRow(number)}><i className="icon-trash" /></IconButton>
        </div>
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
          .saveFile(files)
          .then(doc => {
            files[number] = doc[0];
            that.changeState({
              files: files
            });
          });
      }
      else {
        let languages = this.state.languages;
        languages[number] = v;
        this.changeState({
          languages: languages
        });
      }
    }

    changeState(newState) {
      this.setState(newState);
      if (this.props.onChange) {
        this.props.onChange({
          files: newState.files ? newState.files : this.state.files,
          languages: newState.languages ? newState.languages : this.state.languages,
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
            that.setState({
              files: that.state.files.splice(number - 1, 1),
              inputNumber: that.state.inputNumber - 1,
              collections: collections
            });
          })
      }
      else {
        this.setState({
          files: this.state.files.splice(number - 1, 1),
          inputNumber: this.state.inputNumber - 1,
          collections: collections
        });
      }
    }

    onAddBtnClick (event) {
      let files = this.state.files;
      for (let i = 0; i < this.state.inputNumber + 1; i++) {
        if (!files[i]) {
          files[i] = '';

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
      let rows = [];
      for (let i = 0; i < this.state.inputNumber; i++) {
        rows.push(this.getRow(i));
      }
      return (
        <div className={this.props.className}>
          {rows}
          <Button variant="outlined" onClick={this.onAddBtnClick}>Add file</Button>
        </div>
        );
    }
}

export default HRInfoFiles;
