import React from 'react';
import Select from 'react-select';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import faSpinner from '@fortawesome/fontawesome-free-solid/faSpinner';


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
        files: [''],
        languages: [''],
        status: ''
      };
      this.getRow = this.getRow.bind(this);
      this.handleChange = this.handleChange.bind(this);
      this.onAddBtnClick = this.onAddBtnClick.bind(this);
      this.finalizeChange = this.finalizeChange.bind(this);
    }

    getRow (number) {
      return (
        <div className="row" key={number}>
          <div className="col-sm-6">
            <label>File</label><br />
            {this.state.files[number] === '' ?
              <input type="file" id={'files_' + number } name={'files_' + number } onChange={ (e) => this.handleChange(number, 'file', e.target.files) } /> : ''
            }
            {this.state.files[number] === 'uploading' ?
              <FontAwesomeIcon icon={faSpinner} pulse fixedWidth /> : ''
            }
            {typeof this.state.files[number] === 'object' ?
              <a href={this.state.files[number].uri} target="__blank">{this.state.files[number].label}</a> : ''
            }
          </div>
          <div className="col-sm-6">
            <label>Language</label>
            <Select options={this.languages} name={'languages_' + number} onChange={ (s) => this.handleChange(number, 'language', s)} value={this.state.languages[number]} />
          </div>
        </div>
      );
    }

    handleChange(number, type, v) {
      if (type === 'file') {
        let files = this.state.files;
        const that = this;
        const token = this.props.token;
        const data = new FormData();
        data.append('file', v[0]);
        files[number] = 'uploading';
        this.setState({
          files: files
        });

        fetch('https://www.humanitarianresponse.info/api/files', {
          method: 'POST',
          headers: {
            'Authorization': 'Bearer ' + token,
          },
          body: data,
        }).then((response) => {
          return response.json();
        }).then(data => {
          files[number] = data.data[0][0];
          that.setState({
            files: files
          });
          that.finalizeChange();
        });
      }
      else {
        let languages = this.state.languages;
        languages[number] = v;
        this.finalizeChange();
      }
    }

    finalizeChange() {
      if (this.props.onChange) {
        this.props.onChange({
          files: this.state.files,
          languages: this.state.languages
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
        inputNumber: this.state.inputNumber + 1
      });
    }

    componentDidUpdate() {
      if (this.props.value && this.state.status === '') {
        const that = this;
        let state = {
          inputNumber: 0,
          files: [],
          languages: [],
          status: 'updated'
        };
        this.props.value.forEach(function (fc) {
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
        this.setState(state);
      }
    }

    render () {
      let rows = [];
      for (let i = 0; i < this.state.inputNumber; i++) {
        rows.push(this.getRow(i));
      }
      return (
        <div>
          {rows}
          <button type="button" onClick={this.onAddBtnClick}>Add file</button>
        </div>
        );
    }
}

export default HRInfoFiles;
