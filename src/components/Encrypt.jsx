import React, { useState } from 'react'
import FileSaver from 'file-saver'
import { useBlockstack } from 'react-blockstack'
import { ECPair /*, address as baddress, crypto as bcrypto*/ } from 'bitcoinjs-lib'
import Dropzone from './Dropzone.jsx'

function getPublicKeyFromPrivate(privateKey: string) {
  // from blockstack.js internal key module
  const keyPair = ECPair.fromPrivateKey(Buffer.from(privateKey, 'hex'))
  return keyPair.publicKey.toString('hex')
}

function saveEncrypted (files, encrypt) {
    console.log("Save encrypted:", files)
    //var file = new File(["Hello, world!"], "hello world.txt", {type: "text/plain;charset=utf-8"})
    //FileSaver.saveAs(file)
    // ## FIX: handle multiple files
    // ## TODO: Notify blockstack that encryptContent should take a file (it's a blob)
    const reader = new FileReader()
    const file = files[0]
    reader.onload = e => {
      const content = e.target.result
      const encrypted = encrypt(content)
      FileSaver.saveAs(JSON.stringify(encrypted))
    }
    reader.readAsArrayBuffer(file)
  }

function copyLink () {
      console.log("Copy encrypt link to clipboard")
    }

function KeyLink ({ publicKey }) {
     // note: hash should be after query string
     const url = window.location.origin + "/encrypt?public-key=" + publicKey
     return (
       <span className="public-key-link">
          <button className="btn btn-secondary" onClick={ copyLink }>
            <i className="far fa-copy"></i> Magic Link
          </button>
          <a hidden={true} href={url}>{url}</a>
       </span>)
    }

function DropEncrypt ({publicKey}) {
    const { userSession } = useBlockstack()
    const [files, setFiles] = useState([])
    const encryptContent = content => userSession.encryptContent(content, publicKey)
    function onChange (files) {
      console.log("Current files:", files)
      setFiles(files)
    }
    return (
       <>
        <Dropzone className="Dropzone" onChange = { onChange }>
          { files.length > 0
           ? <i class="fas fa-shield-alt m-auto"></i>
           : null}
        </Dropzone>
        <button className="btn btn-success btn-block mt-4"
                    disabled= { files.length === 0}
                    onClick={ () => saveEncrypted( files, encryptContent)}>
                    Save Encrypted
        </button>
        { files.length > 0
                  ? <div className="alert alert-info text-center mt-4">
                      The file has been encrypted and the result is ready to be saved.</div>
                  : null}
      </>
)}

export default function Encrypt (props) {
  const { userData } = useBlockstack()
  // const params = new URLSearchParams(window.location.search);
  // const publicKey = params.get('public-key')
  const [hiddenKey, setHidden] = useState()
  const privateKey = userData && userData.appPrivateKey
  const publicKey = privateKey && getPublicKeyFromPrivate(privateKey)
  const toggleKey = () => setHidden(!hiddenKey)

  return (
      <div className="jumbotron">

            <p>Public key:
              <input value={publicKey} style={{width: "30em"}} readOnly={true}
                     type={hiddenKey? "password" : "text"}
                     onClick={ toggleKey }/>
              <KeyLink publicKey={publicKey}/>
            </p>
            {!hiddenKey ?
              <p>Use the button to copy a link with your public key.</p>
              : null}


          <DropEncrypt />

      </div>
    )
  }
