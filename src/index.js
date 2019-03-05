import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter as Router} from "react-router-dom";
import {CookiesProvider} from 'react-cookie';
import App from './containers/App';
import {I18nextProvider} from 'react-i18next';
import i18next from 'i18next';
import LngDetector from 'i18next-browser-languagedetector';
import common_en from "./translations/en/common.json";
import forms_en from "./translations/en/forms.json";
import common_fr from "./translations/fr/common.json";
import forms_fr from "./translations/fr/forms.json";
import common_es from "./translations/es/common.json";
import forms_es from "./translations/es/forms.json";
import './index.css';
import './images/unocha-icons.css';
import registerServiceWorker from './utils/registerServiceWorker';

import {MuiThemeProvider, createMuiTheme} from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';

const theme = createMuiTheme({
	palette: {
		primary: {
			main: '#a02837'
		},
		secondary: {
			main: '#858585'
		}
	}
});

i18next
	.use(LngDetector)
	.init({
	  interpolation: { escapeValue: false },  // React already does escaping
		fallbackLng: 'en',
		whitelist: ['en', 'fr', 'es'],
		nonExplicitWhitelist: true,
		load: 'languageOnly',
	  resources: {
	    en: {
	      common: common_en,
	      forms: forms_en
	    },
	    fr: {
	      common: common_fr,
	      forms: forms_fr
	    },
	    es: {
	      common: common_es,
	      forms: forms_es
	    }
	  }
	}
);

ReactDOM.render(
	<MuiThemeProvider theme={theme}>
		<Router>
			<CookiesProvider>
				<CssBaseline/>
				<I18nextProvider i18n={i18next}>
					<App/>
				</I18nextProvider>
			</CookiesProvider>
		</Router>
	</MuiThemeProvider>,
	document.getElementById("root"));
registerServiceWorker();
