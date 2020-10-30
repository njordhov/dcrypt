import React, { useCallback } from 'react';
import { useBlockstack, useConnectOptions } from 'react-blockstack'
import { showBlockstackConnect } from '@stacks/connect'
import { usePerson } from './library'
import config from './config'

import './Auth.css'

const profileManagerUrl = "https://browser.blockstack.org/profiles"

function AuthButton ({signIn}) {
  return (
    (signIn) &&
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
    const authOptionDefaults = {appDetails: { name: config.title, icon: config.icon}}
    const authOptions = useConnectOptions(authOptionDefaults)
    const signIn = useCallback (!authenticated && authOptions && (() => {
      showBlockstackConnect(authOptions)
    }), [authenticated, authOptions])
    const { avatarUrl, username } = usePerson()
    const defaultAvatar = "fas fa-user-secret"
    return (
      <div className="Auth">
        { signIn ?  
           <AuthButton signIn={signIn}/>
         : signOut ? 
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
          </div>
        :  <div>...</div>
       }
     </div>
    )
}
