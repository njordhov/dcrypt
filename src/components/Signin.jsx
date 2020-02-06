import React, { } from 'react'
import { useBlockstack } from 'react-blockstack'
import InfoBox, {InfoToggle} from './InfoBox'

function AboutBlockstack (props) {
  return (
    <>
      <p className="mt-2"><small>Who's Blockstack?</small>
        <span className="ml-1">
          <InfoToggle target="#blockstack-login-info"/>
        </span>
      </p>
      <div className="row">
        <div className="col-md-6 m-auto">
          <InfoBox id="blockstack-login-info" hide={true}>
            <a href="https://blockstack.org/about" target="_blank">Blockstack PBC</a> is
             an American public benefit corporation,
            creating a decentralized computing network and app ecosystem
            designed to protect&nbsp;digital&nbsp;rights.
          </InfoBox>
        </div>
      </div>
    </>)}

export default function Signin (props) {
    const { signIn } = useBlockstack()
    return (
    <div className="alert alert-light text-dark text-center m-auto pt-4 mb-0">
      <div className="text-center">
        <p className="lead mb-4">
          Get your own public key and gain access to encryption tools:
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
    </div>
    )
  }
