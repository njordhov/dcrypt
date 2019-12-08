import React from 'react'
import ReactDOM from 'react-dom';
import { AppConfig } from 'blockstack'
import { initBlockstack } from 'react-blockstack'
import Signin from './components/Signin.jsx';
import App from './components/App.jsx';
import Auth from './components/Auth.jsx';
import About from './components/About.jsx';
import Tutorial from './components/Tutorial.jsx';
import Encrypt from './components/Encrypt.jsx';
import Decrypt from './components/Decrypt.jsx';
import Share from './components/Share.jsx';

// include google fonts to avoid tracking
import './styles/cyborg.scss';

// import bootstrap from 'bootstrap/dist/css/bootstrap.css'
import bootstrap from 'bootswatch/dist/cyborg/bootstrap.css'
import style from './styles/style.css'

import $ from 'jquery'
import Popper from 'popper.js'
import 'bootstrap/dist/js/bootstrap.bundle.min'

const appConfig = new AppConfig(['store_write', 'publish_data'])

initBlockstack({appConfig})

ReactDOM.render(<Signin/>, document.getElementById('signin-root'));
ReactDOM.render(<App/>, document.getElementById('app-root'));
ReactDOM.render(<Auth/>, document.getElementById('auth-root'));
ReactDOM.render(<About/>, document.getElementById('about-root'));
ReactDOM.render(<Tutorial/>, document.getElementById('tutorial-root'));
ReactDOM.render(<Encrypt/>, document.getElementById('encrypt-root'));
ReactDOM.render(<Decrypt/>, document.getElementById('decrypt-root'));
ReactDOM.render(<Share/>, document.getElementById('share-root'));
