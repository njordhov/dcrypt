import React, { Component } from 'react'
import ReactDOM from 'react-dom';

import App from './components/App.jsx';
import Auth from './components/Auth.jsx';
import Encrypt from './components/Encrypt.jsx';
import Decrypt from './components/Decrypt.jsx';


// Require Sass file so webpack can build it
import bootstrap from 'bootstrap/dist/css/bootstrap.css';
import style from './styles/style.css';

ReactDOM.render(<Auth />, document.getElementById('auth-root'));
ReactDOM.render(<App />, document.getElementById('about-root'));
ReactDOM.render(<Encrypt />, document.getElementById('encrypt-root'));
ReactDOM.render(<Decrypt />, document.getElementById('decrypt-root'));

/* Select tab for incoming links */

window.onload = function () {
    console.log("Hash=" + document.location.hash)
    const tab = document.getElementById(document.location.hash.substring(1) + "-tab")
    if (tab != null) {
      tab.click();
    }
};
