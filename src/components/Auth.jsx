import React, { Component, Link } from 'react';
import Profile from './Profile.jsx';
import Signin from './Signin.jsx';
import {userSession} from './Global.js'
import {
  UserSession,
  AppConfig,
  Person
} from 'blockstack';

const avatarFallbackImage = 'https://s3.amazonaws.com/onename/avatar-placeholder.png';

export default class Auth extends Component {

  constructor(props) {
  	super(props);
    this.state = {
  	  person: {
  	  	name() {
          return 'Anonymous';
        },
  	  	avatarUrl() {
  	  	  return avatarFallbackImage;
  	  	},
  	  },
  	};
  }

  handleSignIn(e) {
    e.preventDefault();
    userSession.redirectToSignIn();
  }

  handleSignOut(e) {
    e.preventDefault();
    userSession.signUserOut(window.location.origin);
  }

  render() {
    const { person } = this.state;
    return (
      <div className="Auth">
         {userSession.isUserSignedIn() ?
          <span className="avatar">
            <img src={ person.avatarUrl() ? person.avatarUrl() : avatarFallbackImage }
                   className="avatar-image" id="avatar-image" />
            { person.name() }
          </span>
          : null }

          { !userSession.isUserSignedIn() ?
            <button
              className="btn btn-outline-primary"
              onClick={ this.handleSignIn }>
              Sign In
            </button>
            :
            <button
                className="btn btn-outline-secondary"
                disabled={ userSession.isSignInPending() }
                onClick={ this.handleSignOut }>
                Sign Out
            </button>
          }
        </div>
    );
  }

  componentWillMount() {
    if (userSession.isSignInPending()) {
      userSession.handlePendingSignIn().then((userData) => {
      window.location = window.location.origin;
      });
    }
    // Hack...
    if (userSession.isUserSignedIn()) {
      document.documentElement.className = "user-signed-in";
      this.setState({
        person: new Person(userSession.loadUserData().profile),
      });
    } else {
      document.documentElement.className = "";
    }
  }
}
