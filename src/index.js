import React, { Component } from 'react'
import ReactDOM from 'react-dom';

import App from './components/App.jsx';
import Encrypt from './components/Encrypt.jsx';
import Decrypt from './components/Decrypt.jsx';


// Require Sass file so webpack can build it
import bootstrap from 'bootstrap/dist/css/bootstrap.css';
import style from './styles/style.css';

ReactDOM.render(<App />, document.getElementById('about-root'));
ReactDOM.render(<Encrypt />, document.getElementById('encrypt-root'));
ReactDOM.render(<Decrypt />, document.getElementById('decrypt-root'));
