import React, { useRef } from 'react'
import { useBlockstack } from 'react-blockstack'
import KeyField from './KeyField'
import InfoBox, {InfoToggle} from './InfoBox'
import ClipButton from './ClipButton'
import { useEncryptionUrl, usePublicKey } from './cipher'

import css from './Share.css'

function LinkField ({link, className}) {
  const linkRef = useRef()
  return (
  <div className={["LinkField", className].join(" ")}>
    <div className="input-group input-group-lg">
      <div className="input-group-prepend">
        <span className="input-group-text bg-dark">
          <i className="fas fa-link text-primary"></i>
        </span>
      </div>
      <input className="form-control text-truncate"
             type="text" value={link} readOnly={true}/>
      <div className="input-group-append">
        <ClipButton targetRef={linkRef}/>
      </div>
    </div>
  </div>
  )
}

function LinkCard (props) {
  const link = useEncryptionUrl()
  return (
   <div className="card border-light">
      <div class="card-body">
        <h5 className="card-title text-center">Link to Share</h5>
        <div className="my-4">
          <LinkField link={link}/>
        </div>
        <div className="card-footer">
          <p>Copy the link and share it with others. You may tell them
          it <a href={link} target="_blank">opens a webpage</a> where they can encrypt a file that
          only you will be able to decrypt.</p>
        </div>
      </div>
   </div>
  )
}

export default function Share (props) {
  const { userData, userSession, targetId } = useBlockstack()
  const {username} = userData || {}
  const publicKey = usePublicKey()

  return(
  <div className="jumbotron">
    <div className="container">
      <InfoBox className="mb-4" dismissible={true}>
        <p>Here you can find a link to your public key.
          Share the link with others so they can encrypt
          confidential messages meant for you only.</p>
     </InfoBox>

     <LinkCard/>

     <InfoBox className="my-4">
       <p>When you receive the
       encrypted file, use the tool on
       the <cite>decrypt</cite> pane to restore&nbsp;its&nbsp;content.</p>
    </InfoBox>
    </div>
  </div>
  )
}
