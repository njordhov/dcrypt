import React, { } from 'react'
import { useBlockstack } from 'react-blockstack'

function AboutBlockstack (props) {
  return (
    <>
      <p className="mt-2"><small>Who's Blockstack?</small>
        <i className="btn fas fa-info-circle text-info ml-1"
           style={{fontSize: "1.3rem"}}
           data-toggle="collapse" data-target="#blockstack-login-info">
        </i>
      </p>
      <div id="blockstack-login-info" className="collapse hide">
        <div className="row">
          <p className="alert alert-info col-md-6 m-auto">
            <a href="https://blockstack.org" target="_blank">Blockstack</a> is
             a public benefit corporation,
            creating a decentralized computing network and app ecosystem
            designed to protect digital rights.</p>
        </div>
      </div>
    </>)}

export default function Signin (props) {
    const { signIn } = useBlockstack()
    return (
      <div className="text-center">
        <p className="lead mb-4">
          Get your own public key and access to encryption tools:
        </p>
        <button
            className="btn btn-primary btn-lg"
            id="signin-button"
            disabled={!signIn}
            onClick={ signIn }
          >
            Sign In with Blockstack
          </button>
        <AboutBlockstack/>
      </div>
    )
  }
