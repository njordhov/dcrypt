import React, { useState } from 'react';
import { ECPair /*, address as baddress, crypto as bcrypto*/ } from 'bitcoinjs-lib'
import { useBlockstack } from 'react-blockstack'

function getPublicKeyFromPrivate(privateKey: string) {
  // from blockstack.js internal key module
  const keyPair = ECPair.fromPrivateKey(Buffer.from(privateKey, 'hex'))
  return keyPair.publicKey.toString('hex')
}

function copyLink () {
    console.log("Copy encrypt link to clipboard")
  }

function KeyLink ({ publicKey }) {
   // note: hash should be after query string
   const url = window.location.origin + "?public-key=" + publicKey + "#encrypt"
   return (
     <div className="public-key-link">
        <button onClick={ copyLink }>copy</button>
        <a href={url}>{url}</a>
     </div>)
  }

function Enter (props) {
    const { userData } = useBlockstack()
    const [hiddenKey, setHidden] = useState()
    const privateKey = userData && userData.appPrivateKey
    const publicKey = privateKey && getPublicKeyFromPrivate(privateKey)
    const toggleKey = () => setHidden(!hiddenKey)
    return (
      <div>
        <p className="lead">
          We've made public-key cryptography so easy you don't actually need to know
          your public key. Click on the field below if you still want to check
          it out:
        </p>
        <p>Public key:
        <input value={publicKey} style={{width: "30em"}} readOnly={true}
               type={hiddenKey? "password" : "text"}
               onClick={ toggleKey }/></p>
        {!hiddenKey ?
          <p>Cryptic, you may say. Definitely not something you'd like to try to remember.
          Fortunately, you don't have to.</p>
          : null}

        <div hidden={true}>
          <p>Instead, just share the link below with people so they easily can use your
          public key to encrypt files before sending them to you.</p>

          <p>Well, this is not much better, but it's only for now
            until I figure out how to shorten it:</p>
            <KeyLink publicKey={publicKey}/>
        </div>
        <button class="btn btn-primary" role="button"
           onClick={() => document.getElementById('encrypt-tab').click()}>Next: Encrypt a File</button>
      </div>
    );
  }


export default function Profile () {
  const { userSession } = useBlockstack()
  if (!userSession.isSignInPending()) {
    return(<Enter/>)
  }
}
