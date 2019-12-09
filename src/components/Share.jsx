import React from 'react'
import { useBlockstack } from 'react-blockstack'
import KeyField from './KeyField.jsx'
import InfoBox, {InfoToggle} from './InfoBox'
import { useEncryptionUrl, usePublicKey } from './cipher.jsx'

function copyToClipboard(id) {
    var range = document.createRange();
    range.selectNode(document.getElementById(id));
    window.getSelection().removeAllRanges(); // clear current selection
    window.getSelection().addRange(range); // to select text
    document.execCommand("copy");
    window.getSelection().removeAllRanges();// to deselect
  }

function ClipButton ({target}) {
  return(
  <button className="btn btn-primary" type="button"
          dataToggle="tooltip" dataPlacement="top" title="Copy link to clipboard"
          onClick={() => copyToClipboard(target)}>
    <i className="fas fa-clone"></i>
  </button>
  )
}

//  input-group-lg my-4 mx-auto

function LinkCard (props) {
  const link = useEncryptionUrl()
  return (
   <div className="card border-light">
      <div class="card-body">
        <h5 className="card-title text-center">Link to Share</h5>
        <div className="d-flex justify-content-center align-items-center w-100">
          <div>
            <div className="input-group input-group-lg mx-auto my-4">
              <span id="link" className="input-group-text bg-dark">{link}</span>
              <div className="input-group-append">
                <ClipButton target="link"/>
              </div>
            </div>
          </div>
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
