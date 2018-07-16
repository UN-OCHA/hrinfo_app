import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter as Router} from "react-router-dom";
import {CookiesProvider} from 'react-cookie';
import App from "./App";
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import './unocha-icons.css';
import registerServiceWorker from './registerServiceWorker';

import {MuiThemeProvider, createMuiTheme} from '@material-ui/core/styles';
import indigo from '@material-ui/core/colors/indigo';

const theme = createMuiTheme({
	palette: {
		primary: {
			main: '#007faa'
		},
		secondary: {
			main: '#53b1c8'
		}
	}
});

//ReactDOM.render(<App />, document.getElementById('root'));
ReactDOM.render(
	<MuiThemeProvider theme={theme}>
		<Router>
			<CookiesProvider>
				<App/>
			</CookiesProvider>
		</Router>
	</MuiThemeProvider>,
	document.getElementById("root"));
registerServiceWorker();
