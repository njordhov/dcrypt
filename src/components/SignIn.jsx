import React, { useCallback } from 'react'
import { useBlockstack } from 'react-blockstack'
import { showBlockstackConnect } from '@blockstack/connect'
import InfoBox, {InfoToggle} from './InfoBox'
import { useAuthOptions } from './library'
import config from './config'

function AboutBlockstack (props) {
  return (
    <div className="AboutBlockstack">
      <p className="mt-2"><small>Who's Blockstack?</small>
        <span className="ml-1">
          <InfoToggle target="#blockstack-login-info"/>
        </span>
      </p>
      <div className="row">
        <div className="col-md-6 m-auto">
          <InfoBox id="blockstack-login-info" hide={true}>
            <a href="https://blockstack.org/about" 
               rel="noopener noreferrer"
               target="_blank">Blockstack PBC</a> is
             an American public benefit corporation,
            creating a decentralized computing network and app ecosystem
            designed to protect&nbsp;digital&nbsp;rights.
          </InfoBox>
        </div>
      </div>
    </div>)}

function SignInCore ({signIn, disabled}) {
  return (
  <div className="SignIn alert alert-light text-dark text-center m-auto pt-4 mb-0">
    <div className="text-center">
      <p className="lead mb-4">
        Get your own <mark title="This consist of a Public Key used for encryption and a Private Key used for decryption.">
          keypair</mark> and gain access to encryption tools:
      </p>
      <button
          className="btn btn-primary btn-lg"
          id="signin-button"
          disabled={disabled}
          onClick={signIn}
        >
          Register with Blockstack
        </button>
      <AboutBlockstack/>
    </div>
  </div>
  )
}

function ClassicSignIn () {
  const { signIn } = useBlockstack()
  const disabled = !signIn
  return <SignInCore signIn={signIn} disabled={disabled}/>
}

function ConnectSignIn () {
  const authOptions = useAuthOptions()
  const signIn = useCallback(() => {
    showBlockstackConnect(authOptions)
  },[authOptions])
  const disabled = !signIn
  return (<SignInCore signIn={signIn} disabled={disabled}/>)
}

export default function SignIn () {
  return ((config.classic) ? <ClassicSignIn/> : <ConnectSignIn/>)
}
