import React from 'react'
import ReactDOM from 'react-dom';
import { AppConfig } from 'blockstack'

import { initBlockstack } from 'react-blockstack'

import Signin from './components/Signin.jsx';
import App from './components/App.jsx';
import Auth from './components/Auth.jsx';
import Encrypt from './components/Encrypt.jsx';
import Decrypt from './components/Decrypt.jsx';

// Require Sass file so webpack can build it
import bootstrap from 'bootstrap/dist/css/bootstrap.css'
import style from './styles/style.css';

const appConfig = new AppConfig(['store_write', 'publish_data'])

initBlockstack(appConfig)

ReactDOM.render(<Signin />, document.getElementById('signin-root'));
ReactDOM.render(<App />, document.getElementById('app-root'));
ReactDOM.render(<Auth />, document.getElementById('auth-root'));
ReactDOM.render(<Encrypt />, document.getElementById('encrypt-root'));
ReactDOM.render(<Decrypt />, document.getElementById('decrypt-root'));

/* Select tab for incoming links - can be covered by router */

window.onload = function () {
    console.log("Hash=" + document.location.hash)
    const tab = document.getElementById(document.location.hash.substring(1) + "-tab")
    if (tab != null) {
      tab.click();
    }
};
