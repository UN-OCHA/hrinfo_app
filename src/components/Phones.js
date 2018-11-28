import React from 'react';
import lodash from 'lodash';
import MaterialSelect from './MaterialSelect';
import { translate } from 'react-i18next';
import HRInfoAPI from '../api/HRInfoAPI';

import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Avatar from '@material-ui/core/Avatar';
import TextField from "@material-ui/core/TextField/TextField";
import IconButton from "@material-ui/core/IconButton/IconButton";

class Phones extends React.Component {

  t = this.props.t;

  types = [
    {value: this.t('phones.types.work'), label: this.t('phones.types.work') },
    {value: this.t('phones.types.home'), label: this.t('phones.types.home') },
    {value: this.t('phones.types.mobile'), label: this.t('phones.types.mobile') },
    {value: this.t('phones.types.fax'), label: this.t('phones.types.fax') }
  ];

  dialling_codes = [
    {label : 'Afghanistan (+93)',	value : 'AF'},
    {label : 'Aland Islands (+358)',	value : 'AX'},
    {label : 'Albania (+355)',	value : 'AL'},
    {label : 'Algeria (+213)',	value : 'DZ'},
    {label : 'American Samoa (+1)',	value : 'AS'},
    {label : 'Andorra (+376)',	value : 'AD'},
    {label : 'Angola (+244)',	value : 'AO'},
    {label : 'Anguilla (+1)',	value : 'AI'},
    {label : 'Antarctica (+672)',	value : 'AQ'},
    {label : 'Antigua and Barbuda (+1)',	value : 'AG'},
    {label : 'Argentina (+54)',	value : 'AR'},
    {label : 'Armenia (+374)',	value : 'AM'},
    {label : 'Aruba (+297)',	value : 'AW'},
    {label : 'Ascension Island (+247)',	value : 'SH'},
    {label : 'Australia (+61)',	value : 'AU'},
    {label : 'Austria (+43)',	value : 'AT'},
    {label : 'Azerbaijan (+994)',	value : 'AZ'},
    {label : 'Bahamas (+1)',	value : 'BS'},
    {label : 'Bahrain (+973)',	value : 'BH'},
    {label : 'Bangladesh (+880)',	value : 'BD'},
    {label : 'Barbados (+1)',	value : 'BB'},
    {label : 'Belarus (+375)',	value : 'BY'},
    {label : 'Belgium (+32)',	value : 'BE'},
    {label : 'Belize (+501)',	value : 'BZ'},
    {label : 'Benin (+229)',	value : 'BJ'},
    {label : 'Bermuda (+1)',	value : 'BM'},
    {label : 'Bhutan (+975)',	value : 'BT'},
    {label : 'Bolivia (+591)',	value : 'BO'},
    {label : 'Bonaire, Sint Eustatius and Saba (+599)',	value : 'BQ'},
    {label : 'Bosnia and Herzegovina (+387)',	value : 'BA'},
    {label : 'Botswana (+267)',	value : 'BW'},
    {label : 'Brazil (+55)',	value : 'BR'},
    {label : 'British Indian Ocean Territory (+246)',	value : 'IO'},
    {label : 'British Virgin Islands (+1)',	value : 'VG'},
    {label : 'Brunei (+673)',	value : 'BN'},
    {label : 'Bulgaria (+359)',	value : 'BG'},
    {label : 'Burkina Faso (+226)',	value : 'BF'},
    {label : 'Burundi (+257)',	value : 'BI'},
    {label : 'Cambodia (+855)',	value : 'KH'},
    {label : 'Cameroon (+237)',	value : 'CM'},
    {label : 'Canada (+1)',	value : 'CA'},
    {label : 'Cape Verde (+238)',	value : 'CV'},
    {label : 'Cayman Islands (+1)',	value : 'KY'},
    {label : 'Central African Republic (+236)',	value : 'CF'},
    {label : 'Chad (+235)',	value : 'TD'},
    {label : 'Chile (+56)',	value : 'CL'},
    {label : 'China (+86)',	value : 'CN'},
    {label : 'Christmas Island (+61)',	value : 'CX'},
    {label : 'Cocos (Keeling) Islands (+61)',	value : 'CC'},
    {label : 'Colombia (+57)',	value : 'CO'},
    {label : 'Comoros (+269)',	value : 'KM'},
    {label : 'Cook Islands (+682)',	value : 'CK'},
    {label : 'Costa Rica (+506)',	value : 'CR'},
    {label : 'Croatia (+385)',	value : 'HR'},
    {label : 'Cuba (+53)',	value : 'CU'},
    {label : 'Curacao (+599)',	value : 'CW'},
    {label : 'Cyprus (+357)',	value : 'CY'},
    {label : 'Czech Republic (+420)',	value : 'CZ'},
    {label : 'Democratic Republic of the Congo (+243)',	value : 'CD'},
    {label : 'Denmark (+45)',	value : 'DK'},
    {label : 'Djibouti (+253)',	value : 'DJ'},
    {label : 'Dominica (+1)',	value : 'DM'},
    {label : 'Dominican Republic (+1)',	value : 'DO'},
    {label : 'East Timor (+670)',	value : 'TL'},
    {label : 'Ecuador (+593)',	value : 'EC'},
    {label : 'Egypt (+20)',	value : 'EG'},
    {label : 'El Salvador (+503)',	value : 'SV'},
    {label : 'Equatorial Guinea (+240)',	value : 'GQ'},
    {label : 'Eritrea (+291)',	value : 'ER'},
    {label : 'Estonia (+372)',	value : 'EE'},
    {label : 'Ethiopia (+251)',	value : 'ET'},
    {label : 'Falkland Islands (+500)',	value : 'FK'},
    {label : 'Faroe Islands (+298)',	value : 'FO'},
    {label : 'Fiji (+679)',	value : 'FJ'},
    {label : 'Finland (+358)',	value : 'FI'},
    {label : 'France (+33)',	value : 'FR'},
    {label : 'French Guiana (+594)',	value : 'GF'},
    {label : 'French Polynesia (+689)',	value : 'PF'},
    {label : 'Gabon (+241)',	value : 'GA'},
    {label : 'Gambia (+220)',	value : 'GM'},
    {label : 'Georgia (+995)',	value : 'GE'},
    {label : 'Germany (+49)',	value : 'DE'},
    {label : 'Ghana (+233)',	value : 'GH'},
    {label : 'Gibraltar (+350)',	value : 'GI'},
    {label : 'Greece (+30)',	value : 'GR'},
    {label : 'Greenland (+299)',	value : 'GL'},
    {label : 'Grenada (+1)',	value : 'GD'},
    {label : 'Guadeloupe (+590)',	value : 'GP'},
    {label : 'Guam (+1)',	value : 'GU'},
    {label : 'Guatemala (+502)',	value : 'GT'},
    {label : 'Guernsey (+44)',	value : 'GG'},
    {label : 'Guinea (+224)',	value : 'GN'},
    {label : 'Guinea-Bissau (+245)',	value : 'GW'},
    {label : 'Guyana (+592)',	value : 'GY'},
    {label : 'Haiti (+509)',	value : 'HT'},
    {label : 'Honduras (+504)',	value : 'HN'},
    {label : 'Hong Kong (+852)',	value : 'HK'},
    {label : 'Hungary (+36)',	value : 'HU'},
    {label : 'Iceland (+354)',	value : 'IS'},
    {label : 'India (+91)',	value : 'IN'},
    {label : 'Indonesia (+62)',	value : 'ID'},
    {label : 'Iran (+98)',	value : 'IR'},
    {label : 'Iraq (+964)',	value : 'IQ'},
    {label : 'Ireland (+353)',	value : 'IE'},
    {label : 'Isle of Man (+44)',	value : 'IM'},
    {label : 'Israel (+972)',	value : 'IL'},
    {label : 'Italy (+39)',	value : 'IT'},
    {label : 'Ivory Coast (+225)',	value : 'CI'},
    {label : 'Jamaica (+1)',	value : 'JM'},
    {label : 'Japan (+81)',	value : 'JP'},
    {label : 'Jersey (+44-1534)',	value : 'JE'},
    {label : 'Jordan (+962)',	value : 'JO'},
    {label : 'Kazakhstan (+7)',	value : 'KZ'},
    {label : 'Kenya (+254)',	value : 'KE'},
    {label : 'Kiribati (+686)',	value : 'KI'},
    {label : 'Kosovo (+383)',	value : 'XK'},
    {label : 'Kuwait (+965)',	value : 'KW'},
    {label : 'Kyrgyzstan (+996)',	value : 'KG'},
    {label : 'Laos (+856)',	value : 'LA'},
    {label : 'Latvia (+371)',	value : 'LV'},
    {label : 'Lebanon (+961)',	value : 'LB'},
    {label : 'Lesotho (+266)',	value : 'LS'},
    {label : 'Liberia (+231)',	value : 'LR'},
    {label : 'Libya (+218)',	value : 'LY'},
    {label : 'Liechtenstein (+423)',	value : 'LI'},
    {label : 'Lithuania (+370)',	value : 'LT'},
    {label : 'Luxembourg (+352)',	value : 'LU'},
    {label : 'Macau (+853)',	value : 'MO'},
    {label : 'Macedonia (+389)',	value : 'MK'},
    {label : 'Madagascar (+261)',	value : 'MG'},
    {label : 'Malawi (+265)',	value : 'MW'},
    {label : 'Malaysia (+60)',	value : 'MY'},
    {label : 'Maldives (+960)',	value : 'MV'},
    {label : 'Mali (+223)',	value : 'ML'},
    {label : 'Malta (+356)',	value : 'MT'},
    {label : 'Marshall Islands (+692)',	value : 'MH'},
    {label : 'Martinique (+596)',	value : 'MQ'},
    {label : 'Mauritania (+222)',	value : 'MR'},
    {label : 'Mauritius (+230)',	value : 'MU'},
    {label : 'Mayotte (+262)',	value : 'YT'},
    {label : 'Mexico (+52)',	value : 'MX'},
    {label : 'Micronesia (+691)',	value : 'FM'},
    {label : 'Moldova (+373)',	value : 'MD'},
    {label : 'Monaco (+377)',	value : 'MC'},
    {label : 'Mongolia (+976)',	value : 'MN'},
    {label : 'Montenegro (+382)',	value : 'ME'},
    {label : 'Montserrat (+1)',	value : 'MS'},
    {label : 'Morocco (+212)',	value : 'MA'},
    {label : 'Mozambique (+258)',	value : 'MZ'},
    {label : 'Myanmar (+95)',	value : 'MM'},
    {label : 'Namibia (+264)',	value : 'NA'},
    {label : 'Nauru (+674)',	value : 'NR'},
    {label : 'Nepal (+977)',	value : 'NP'},
    {label : 'Netherlands (+31)',	value : 'NL'},
    {label : 'Netherlands Antilles (+599)',	value : 'AN'},
    {label : 'New Caledonia (+687)',	value : 'NC'},
    {label : 'New Zealand (+64)',	value : 'NZ'},
    {label : 'Nicaragua (+505)',	value : 'NI'},
    {label : 'Niger (+227)',	value : 'NE'},
    {label : 'Nigeria (+234)',	value : 'NG'},
    {label : 'Niue (+683)',	value : 'NU'},
    {label : 'Norfolk Island (+672)',	value : 'NF'},
    {label : 'North Korea (+850)',	value : 'KP'},
    {label : 'Northern Mariana Islands (+1)',	value : 'MP'},
    {label : 'Norway (+47)',	value : 'NO'},
    {label : 'Oman (+968)',	value : 'OM'},
    {label : 'Pakistan (+92)',	value : 'PK'},
    {label : 'Palau (+680)',	value : 'PW'},
    {label : 'Palestine (+970)',	value : 'PS'},
    {label : 'Panama (+507)',	value : 'PA'},
    {label : 'Papua New Guinea (+675)',	value : 'PG'},
    {label : 'Paraguay (+595)',	value : 'PY'},
    {label : 'Peru (+51)',	value : 'PE'},
    {label : 'Philippines (+63)',	value : 'PH'},
    {label : 'Pitcairn (+64)',	value : 'PN'},
    {label : 'Poland (+48)',	value : 'PL'},
    {label : 'Portugal (+351)',	value : 'PT'},
    {label : 'Puerto Rico (+1)',	value : 'PR'},
    {label : 'Qatar (+974)',	value : 'QA'},
    {label : 'Republic of the Congo (+242)',	value : 'CG'},
    {label : 'Reunion (+262)',	value : 'RE'},
    {label : 'Romania (+40)',	value : 'RO'},
    {label : 'Russia (+7)',	value : 'RU'},
    {label : 'Rwanda (+250)',	value : 'RW'},
    {label : 'Saint Barthelemy (+590)',	value : 'BL'},
    {label : 'Saint Helena (+290)',	value : 'SH'},
    {label : 'Saint Kitts and Nevis (+1)',	value : 'KN'},
    {label : 'Saint Lucia (+1)',	value : 'LC'},
    {label : 'Saint Martin (+590)',	value : 'MF'},
    {label : 'Saint Pierre and Miquelon (+508)',	value : 'PM'},
    {label : 'Saint Vincent and the Grenadines (+1)',	value : 'VC'},
    {label : 'Samoa (+685)',	value : 'WS'},
    {label : 'San Marino (+378)',	value : 'SM'},
    {label : 'Sao Tome and Principe (+239)',	value : 'ST'},
    {label : 'Saudi Arabia (+966)',	value : 'SA'},
    {label : 'Senegal (+221)',	value : 'SN'},
    {label : 'Serbia (+381)',	value : 'RS'},
    {label : 'Seychelles (+248)',	value : 'SC'},
    {label : 'Sierra Leone (+232)',	value : 'SL'},
    {label : 'Singapore (+65)',	value : 'SG'},
    {label : 'Sint Maarten (+1)',	value : 'SX'},
    {label : 'Slovakia (+421)',	value : 'SK'},
    {label : 'Slovenia (+386)',	value : 'SI'},
    {label : 'Solomon Islands (+677)',	value : 'SB'},
    {label : 'Somalia (+252)',	value : 'SO'},
    {label : 'South Africa (+27)',	value : 'ZA'},
    {label : 'South Korea (+82)',	value : 'KR'},
    {label : 'South Sudan (+211)',	value : 'SS'},
    {label : 'Spain (+34)',	value : 'ES'},
    {label : 'Sri Lanka (+94)',	value : 'LK'},
    {label : 'Sudan (+249)',	value : 'SD'},
    {label : 'Suriname (+597)',	value : 'SR'},
    {label : 'Svalbard and Jan Mayen (+47)',	value : 'SJ'},
    {label : 'Swaziland (+268)',	value : 'SZ'},
    {label : 'Sweden (+46)',	value : 'SE'},
    {label : 'Switzerland (+41)',	value : 'CH'},
    {label : 'Syria (+963)',	value : 'SY'},
    {label : 'Taiwan (+886)',	value : 'TW'},
    {label : 'Tajikistan (+992)',	value : 'TJ'},
    {label : 'Tanzania (+255)',	value : 'TZ'},
    {label : 'Thailand (+66)',	value : 'TH'},
    {label : 'Togo (+228)',	value : 'TG'},
    {label : 'Tokelau (+690)',	value : 'TK'},
    {label : 'Tonga (+676)',	value : 'TO'},
    {label : 'Trinidad and Tobago (+1)',	value : 'TT'},
    {label : 'Tunisia (+216)',	value : 'TN'},
    {label : 'Turkey (+90)',	value : 'TR'},
    {label : 'Turkmenistan (+993)',	value : 'TM'},
    {label : 'Turks and Caicos Islands (+1)',	value : 'TC'},
    {label : 'Tuvalu (+688)',	value : 'TV'},
    {label : 'U.S. Virgin Islands (+1)',	value : 'VI'},
    {label : 'Uganda (+256)',	value : 'UG'},
    {label : 'Ukraine (+380)',	value : 'UA'},
    {label : 'United Arab Emirates (+971)',	value : 'AE'},
    {label : 'United Kingdom (+44)',	value : 'GB'},
    {label : 'United States (+1)',	value : 'US'},
    {label : 'Uruguay (+598)',	value : 'UY'},
    {label : 'Uzbekistan (+998)',	value : 'UZ'},
    {label : 'Vanuatu (+678)',	value : 'VU'},
    {label : 'Vatican (+379)',	value : 'VA'},
    {label : 'Venezuela (+58)',	value : 'VE'},
    {label : 'Vietnam (+84)',	value : 'VN'},
    {label : 'Wallis and Futuna (+681)',	value : 'WF'},
    {label : 'Western Sahara (+212)',	value : 'EH'},
    {label : 'Yemen (+967)',	value : 'YE'},
    {label : 'Zambia (+260)',	value : 'ZM'},
    {label : 'Zimbabwe (+263)',	value : 'ZW'}
  ];

  state = {
    inputNumber: 1,
    status: 'initial',
    types: [''],
    dialling_codes: [''],
    numbers: ['']
  };

  hrinfoAPI = new HRInfoAPI();

  getRow = (number) => {
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
        />
        <CardContent className="file-container">
          <Typography>{t('phones.type')}</Typography>
          <MaterialSelect options={this.types}
                          name={'type' + number}
                          onChange={ (s) => this.handleChange(number, 'type', s)}
                          value={this.state.types[number]} />
        </CardContent>
        <CardContent className="file-container">
          <Typography>{t('phones.dialling_code')}</Typography>
          <MaterialSelect options={this.dialling_codes}
                          name={'dialling_code' + number}
                          onChange={ (s) => this.handleChange(number, 'dialling_code', s)}
                          value={this.state.dialling_codes[number]} />
        </CardContent>
        <CardContent className="file-container">
          <Typography>{t('phones.number')}</Typography>
          <TextField type      = "text"
                     name      = {'number' + number}
                     id        = {'number' + number}
                     fullWidth = {true}
                     value     = {this.state.numbers[number]}
                     onChange  = { (s) => this.handleChange(number, 'number', s)}/>
        </CardContent>
      </Card>
    );
  };

  handleChange = (number, type, v) => {
    const typeName = type + 's';
    let val = lodash.cloneDeep(this.state[typeName]);
    val[number] = v.target ? v.target.value : v;
    this.setState({
      [typeName]: val,
      status: 'ready'
    });
  };

  changeState = (newState) => {
    this.setState(newState);
    if (this.props.onChange) {
      this.props.onChange({
        types: newState.types ? newState.types : this.state.types,
        dialling_codes: newState.dialling_codes ? newState.dialling_codes : this.state.dialling_codes,
        numbers: newState.numbers ? newState.numbers : this.state.numbers
      });
    }
  };

  removeFileRow = (number) => {
    this.setState({
      types: this.state.types.filter(function (type, index) {
        return index !== number;
      }),
      dialling_codes: this.state.dialling_codes.filter(function (code, index) {
        return index !== number;
      }),
      numbers: this.state.numbers.filter(function (num, index) {
        return index !== number;
      }),
      inputNumber: this.state.inputNumber - 1
    });
  };

  onAddBtnClick = (event) => {
    this.setState({
      inputNumber: this.state.inputNumber + 1,
      types: this.state.types.concat(''),
      dialling_codes: this.state.dialling_codes.concat(''),
      numbers: this.state.numbers.concat('')
    });
  };

  componentDidUpdate() {
    if (this.props.value && this.state.status === 'initial') {
      let state = {
        inputNumber: 0,
        types: [],
        dialling_codes: [],
        numbers: [],
        status: 'updated'
      };
      this.props.value.forEach((phone) => {
        state.types.push(phone.numbertype);
        state.numbers.push(phone.number);
        Object.values(this.dialling_codes).forEach((dc) => {
          if (dc.value === phone.countrycode){
            state.dialling_codes.push(dc);
            return;
          }
        });
        if (state.dialling_codes[state.inputNumber] === undefined) {
          state.dialling_codes.push(phone.countrycode);
        }
        state.inputNumber++;
      });
      this.changeState(state);
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (JSON.stringify(this.state) !== JSON.stringify(nextState)) {
      return true;
    }
    return false;
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

export default translate('forms')(Phones);
