import React, { } from 'react';
import { useBlockstack } from 'react-blockstack'

export default function Signin (props) {
    const { signIn } = useBlockstack()

    return (
      <div className="">
        <p className="lead">
          Sign in to get access to the tools and your own public key that can be used to
          send you encrypted files:
        </p>
        <button
            className="btn btn-primary btn-lg"
            id="signin-button"
            onClick={ signIn }
          >
            Sign In with Blockstack
          </button>
      </div>
    )
  }
