import React from 'react'
import ReactDOM from 'react-dom';
import { AppConfig } from 'blockstack'
import { initBlockstack } from 'react-blockstack'
import SignIn from './components/SignIn';
import App from './components/App';
import Auth from './components/Auth';
import About from './components/About';
import Tutorial from './components/Tutorial';
import Encrypt from './components/Encrypt';
import Decrypt from './components/Decrypt';
import Share from './components/Share';

// include icon fonts for landing page etc (not working?)
import '@fortawesome/fontawesome-free/css/all.min.css'

import './styles/theme.scss'
import './styles/common.css'
import './styles/style.css'

import 'jquery'
import 'popper.js'
import 'bootstrap/dist/js/bootstrap.bundle.min'

const appConfig = new AppConfig(['store_write', 'publish_data'])

initBlockstack({appConfig})

ReactDOM.render(<SignIn/>, document.getElementById('signin-root'));
ReactDOM.render(<App/>, document.getElementById('app-root'));
ReactDOM.render(<Auth/>, document.getElementById('auth-root'));
ReactDOM.render(<About/>, document.getElementById('about-root'));
ReactDOM.render(<Tutorial/>, document.getElementById('tutorial-root'));
ReactDOM.render(<Encrypt/>, document.getElementById('encrypt-root'));
ReactDOM.render(<Decrypt/>, document.getElementById('decrypt-root'));
ReactDOM.render(<Share/>, document.getElementById('share-root'));
