import React from 'react';
import { useBlockstack } from 'react-blockstack'

const avatarFallbackImage = 'https://s3.amazonaws.com/onename/avatar-placeholder.png';

export default function Auth (props) {
    const { signIn, signOut, person } = useBlockstack()
    return (
      <div className="Auth">
         { signOut ?
          <div className="btn-group dropdown">
            <button className="btn dropdown-toggle"
              data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
              <span className="avatar">
                <img src={ (person && person.avatarUrl && person.avatarUrl()) || avatarFallbackImage }
                       className="avatar-image" id="avatar-image" />
                { (person && person.name && person.name()) || ''}
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
          { signOut ?
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
          }
          </span>
        </div>
    )
}
