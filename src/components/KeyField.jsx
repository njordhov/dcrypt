import React, { useState, useEffect, useCallback } from 'react'
import { useBlockstack } from 'react-blockstack'

export default function KeyField (props) {
    const {className, label, publicKey, privateKey, username } = props
    const url = window.location.origin + "/encrypt?public-key=" + publicKey
    const copyLink = () => {
          console.log("Copy encrypt link to clipboard")

        }
    const [hiddenKey, setHidden] = useState(true)
    const toggleKey = () => setHidden(!hiddenKey)
    return (
    <div className={className}>

      <div className="input-group">
        {label &&
         <div className="input-group-prepend">
          <span className="input-group-text">
            {label}
          </span>
         </div>}
        {username &&
         <div className="input-group-prepend">
          <span className="input-group-text">
            {username}
          </span>
         </div>}
        <input className={"form-control key-field"}
               style={{maxWidth: "34rem"}}
               dataToggle="tooltip"
               title={privateKey ? "This is your private key used to decrypt messages. Keep it secret, keep it safe, and don't share it with anybody." :
                      publicKey ? "This is your public key used to encrypt messages. It can be shared freely with others." : null }
               value={publicKey || privateKey} readOnly={true}
               type={hiddenKey? "text" : "text"}
               onClick={ toggleKey }/>
        {/*
        <div className="input-group-append">
                  <button className="btn btn-outline-secondary" type="button"
                          onClick={ copyLink }>
                    <i className="far fa-clipboard"></i> Magic Link
                  </button>
        </div> */}
      </div>
          {!hiddenKey && false ?
            <p>Use the button to copy a link with your public key.</p>
            : null}
    </div>
    )
  }
