import React, { useCallback } from 'react';
import { useBlockstack } from 'react-blockstack'
import { showBlockstackConnect } from '@blockstack/connect'
import { usePerson, useAuthOptions } from './library'

import './Auth.css'

const profileManagerUrl = "https://browser.blockstack.org/profiles"

function AuthButton ({signIn, signOut}) {
  return (
    (signIn || !signOut) &&
       <button
         className="btn btn-outline-primary"
         disabled={!signIn}
         onClick={ signIn }>
         <i className="fas fa-sign-in-alt mr-1" style={{fontSize: "1rem"}}></i>
         Sign In
       </button>
  )
}

function MoreMenu (props) {
  const { signOut } = useBlockstack()
  return(
  <div className="dropdown-menu dropdown-menu-right">
    <a className="dropdown-item" href={profileManagerUrl} target="_blank" rel="noopener noreferrer">
      <i className="fas fa-user-cog"></i>
      <span className="ml-2">Edit Profile</span>
    </a>
    <div className="dropdown-divider"></div>
    <button className="dropdown-item" type="button" onClick={ signOut }>
      <i className="fas fa-sign-out-alt"></i>
      <span className="ml-2">Sign out</span>
    </button>
  </div>)
}

export default function Auth (props) {
    const { signOut, authenticated } = useBlockstack()
    const authOptions = useAuthOptions()
    const signIn = useCallback (!authenticated && authOptions && (() => { 
      showBlockstackConnect(authOptions)
    }), [authOptions])
    const { avatarUrl, username } = usePerson()
    const defaultAvatar = "fas fa-user-secret"
    return (
      <div className="Auth">
         { signOut &&
          <div className="btn-group dropdown">
            <button className="btn text-muted dropdown-toggle"
              data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
              <span className="avatar mr-3">
                {avatarUrl ?
                 <img src={ avatarUrl }
                      alt="Authenticated"
                      className="avatar-image mr-3" id="avatar-image" />
                 : <i className={defaultAvatar} style={{fontSize: "1.6rem", marginRight: "0.5em"}}></i>}
                { username }
              </span>
            </button>
            <MoreMenu/>
          </div>}
          
         <AuthButton signIn={signIn} signOut={signOut}/>
         
        </div>
    )
}
