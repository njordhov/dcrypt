import React from 'react'
import { useBlockstack } from 'react-blockstack'
import Profile from './Profile.jsx'
import Signin from './Signin.jsx'

export default function App () {
  const { userSession, signIn, signOut } = useBlockstack()
    return (
      <div className="site-wrapper">
        <div className="site-wrapper-inner">
          { signIn ?
              <Signin userSession={userSession} handleSignIn={ signIn } />
            : <Profile userSession={userSession} handleSignOut={ signOut } />
          }
        </div>
      </div>
    )
  }
