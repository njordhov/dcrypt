import React, { useState, useEffect, useCallback } from 'react'
import { useBlockstack, useProfile } from 'react-blockstack'

export default function KeyField (props) {
    const {className, label, publicKey, privateKey, username, isOwner } = props
    const url = window.location.origin + "/encrypt?public-key=" + publicKey
    const copyLink = () => {
          console.log("Copy encrypt link to clipboard")
          // FIX: Implement copy functionality
        }
    const [hiddenKey, setHidden] = useState(true)
    const toggleKey = () => setHidden(!hiddenKey)
    //const profile = useProfile(username, null) // FIX: Use profile
    //console.log("Profile:", profile)
    const tooltip =
           privateKey ? "This is your private key used to decrypt messages. Keep it secret, keep it safe, and don't share your private key with anybody." :
           publicKey ? "This is your public key used to encrypt messages. It can be shared freely with others." : null
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
         {privateKey &&
          <span className="input-group-text">{username}</span>}
         {publicKey &&
           <button className="btn btn-outline-secondary bg-dark" type="button">
             {username}
           </button>}
         {false && publicKey &&
          <button className="btn btn-outline-secondary dropdown-toggle bg-dark" type="button"
                  data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
            {username}
          </button>}
         {false && publicKey &&
          <div class="dropdown-menu px-3">
            <p>The public key is associated with your own Blockstack ID. Use it to encrypt content for yourself, not others.</p>
          </div>}
         </div>}
        <input className={"form-control key-field"}
               style={{maxWidth: "6rem"}}
               datatoggle="tooltip"
               title={tooltip}
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
