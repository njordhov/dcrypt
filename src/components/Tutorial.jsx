import React, { useState, useCallback } from 'react'
import {DropEncrypt} from './Encrypt.jsx'
import {DropDecrypt} from './Decrypt.jsx'
import Dropzone, { SaveButton, OpenLink } from './Dropzone.jsx'
import {usePublicKey} from './cipher.jsx'

function SafeKeeping (props) {
  const publicKey = usePublicKey()
  const [encrypted, setEncrypted] = useState()
  const [saved, setSaved] = useState()
  const [decrypted, setDecrypted] = useState()
  const onSaved = useCallback( () => {
    console.log("Saved!")
    setSaved(true)
  })
  const [done, setDone] = useState()
  return (
    <div>
      <div className="alert alert-info text-center mt-4">
          { !encrypted ? <span>Add a file to be encrypted:</span>
                       : <span>The file has been encrypted using your <strong>Public Key</strong></span>}
      </div>
      <DropEncrypt setResult={setEncrypted} />
      { encrypted &&
        <div>
          {!saved &&
          <div className="alert alert-info text-center mt-4">
               The encrypted file is ready to be saved:
          </div>}
        {!saved &&
          <div className="d-flex justify-content-center align-items-center w-100 mt-3">
            <SaveButton content={!saved && encrypted} onComplete={ onSaved }>
              Save Encrypted File
            </SaveButton>
          </div>}
        </div>}
      {saved && !decrypted &&
       <div className="alert alert-info text-center mt-4">
            The encrypted file has been saved. Decrypt the file to get back the original:
       </div>}
      {saved &&
        <DropDecrypt setResult={setDecrypted} />}
      {decrypted &&
        <div>
          <div className="alert alert-info text-center mt-4">
              The encrypted file was decrypted using your <strong>Private Key</strong>.
              You can now open the file - it should have the same content as the original.
          </div>
          { !done &&
            ( false ?
              <OpenLink content={decrypted}>Open Decrypted File</OpenLink>
            : <SaveButton content={decrypted} onComplete={ () => setDone(true) }/> )}
       </div>}


    </div>
  )
}

export default function Tutorial () {
  return (
   <div className="jumbotron mb-0"
        style={{minHeight: "100vh"}}>
      <SafeKeeping />
   </div>
  )}
