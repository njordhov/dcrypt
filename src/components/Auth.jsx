import React from 'react';
import { useBlockstack } from 'react-blockstack'

import css from './Auth.css'

function AuthButton ({signIn, signOut}) {
  return (
    signOut ?
      <button
          className="btn btn-outline-secondary"
          onClick={ signOut }>
          Sign Out
      </button>
      : signIn ?
      <button
        className="btn btn-primary"
        onClick={ signIn }>
        Sign In
      </button>
      : <span>...</span>
  )
}

export default function Auth (props) {
    const {userSession, userData, signIn, signOut, person} = useBlockstack()
    const {name, avatarUrl} = person  // access functions
    const avatar = avatarUrl && person.avatarUrl()
    const {username, email} = userData
    if ( userSession && userSession.isUserSignedIn() && userSession.isSignInPending()) {
      console.log("Blockstack inconsistency: Already signed in yet signin is pending");
    }
    console.log("UserData:", avatarUrl)
    return (
      <div className="Auth">
         { signOut ?
          <div className="btn-group dropdown">
            <button className="btn text-muted dropdown-toggle"
              data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
              <span className="avatar mr-3">
                {avatar ?
                 <img src={ avatar }
                      className="avatar-image" id="avatar-image" />
                 : <i className="fas fa-user-circle mr-2" style={{fontSize: "1.3rem"}}></i>}
                { username && username.replace(/.id.blockstack$/, "") }
              </span>
            </button>
            <div className="dropdown-menu">
              <a className="dropdown-item" onClick={ signOut }>
                <i className="fas fa-sign-out-alt"></i>
                <span className="ml-2">Sign out</span>
              </a>
            </div>
          </div>
          : null }

          <span hidden={true}>
            <AuthButton signIn={signIn} signOut={signOut}/>
          </span>
        </div>
    )
}
