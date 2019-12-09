import React, { useState, useEffect, useCallback, useRef } from 'react'
import FileSaver from 'file-saver'
import { useBlockstack } from 'react-blockstack'
import { ECPair /*, address as baddress, crypto as bcrypto*/ } from 'bitcoinjs-lib'
import { isNil, isNull } from 'lodash'
import KeyField from './KeyField.jsx'
import {usePublicKey, usePublishKey, useRemotePublicKey, trimId} from './cipher.jsx'
import Dropzone, { SaveButton, encryptedFilename } from './Dropzone.jsx'
import InfoBox, {InfoToggle} from './InfoBox'

function encryptHandler(file, encryptContent, setResult) {
  if (file) {
    var myReader = new FileReader()
    myReader.readAsArrayBuffer(file)
    myReader.addEventListener("loadend", (e) => {
      var buffer = e.srcElement.result;  //arraybuffer object
      const cipherObject = encryptContent(buffer)
      if (cipherObject) {
        const content = new Blob([cipherObject], { type: "ECIES" })  //  https://fileinfo.com/filetypes/encoded
        content.filename = file.name
        setResult(content)}
  })}}

export function DropEncrypt ({publicKey, setResult, gotResult, disabled}) {
    const { userSession } = useBlockstack()
    const [files, setFiles] = useState([])
    const options = publicKey ? {publicKey: publicKey} : null
    const encryptContent = useCallback(content => userSession.encryptContent(content, options),
                                       [userSession, publicKey])
    const file = files && files[0]
    useEffect( (() => encryptHandler(file, encryptContent, setResult)),[file, encryptContent])
    const onChange = (files) => {
      console.log("Current files:", files)
      setFiles(files)
    }
    const placeholder = <span>Drag &amp; drop a file to encrypt it in the browser, or click to select from your filesystem.</span>
    return (
       <>
        <Dropzone className="Dropzone" onChange = { onChange }>
          { (!isNull(gotResult) ? gotResult : file)
           ? <div className="m-auto text-center">
                <div><i className="fas fa-shield-alt"></i></div>
                <div className="mt-2">{file.name}</div>
             </div>
           : <div className="mx-auto text-center">
               <div>
                 <i className="fas fa-file-import m-auto"></i>
               </div>
               <div className="mt-4">
                 {placeholder}
               </div>
             </div>}
        </Dropzone>
      </>
)}

function ExplainDialog (props) {
  const {open, targetId, publicKey} = props
  const { userData } = useBlockstack()
  const username = trimId(targetId)
  const ref = useRef(null)
  const element = ref.current
  useEffect(() => {
    if (element) {
      element.click()
      // dialog.modal(open ? 'show' : 'hide')
    }
  }, [open, element])
  return (
  <>
  <button hidden={true} ref={ref} type="button" className="btn btn-primary" data-toggle="modal" data-target="#ExplainDialog">
    Explain
  </button>
  <div className="modal fade" id="ExplainDialog" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div className="modal-dialog modal-dialog-centered" role="document">
      <div className="modal-content">
        <div className="modal-header">
          <h5 className="modal-title" id="exampleModalLabel"></h5>
          <button type="button" className="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div className="modal-body">
          <div className="mb-4 w-100 text-center" >
            <img className="mx-auto" src="/media/logo.svg" style={{width: "50%", maxWidth: "12em"}}/>
          </div>
          <p>Hi! Welcome to <i>d</i>Crypt. Seems like somebody we know as <cite>{username}</cite> directed you here
             to encrypt a file so you can send it to them confidentially.</p>

          { isNull(publicKey) &&
          <div className="alert alert-warning">
            Unfortunately, the public key of {username} is not available.
            Possible they haven't yet signed in to the app.
          </div>
          }

          { publicKey &&
          <p>When receiving the encrypted file from you, they can decrypt it to restore the
             original file you encrypted.</p>
           }

          {publicKey &&
          <p>As soon as you close this dialog, you will find a page that takes you through
             the steps to encrypt the file.</p>
           }

          <p>You are welcome to check out the rest of the site for explanations
             about how such end-to-end cryptography works.</p>
             {!userData &&
               <p>After signing in, you
                will get your own encryption key and have access to
                a hands-on tutorial that walks you through the process.</p>}
        </div>
        <div className="modal-footer">
          <button type="button" className="btn btn-primary" data-dismiss="modal">Enter</button>
        </div>
      </div>
    </div>
  </div>
  </>)
}

export default function Encrypt (props) {
  const { userData, userSession, targetId } = useBlockstack()
  const {username} = userData || {}
  const publicKey = usePublicKey()
  const remoteKey = useRemotePublicKey(targetId)
  const [content, setResult] = useState()
  const saveName = content && content.filename && encryptedFilename(content.filename)
  const resetForm = useCallback(() => {setResult(null); })
  usePublishKey(publicKey)
  const activeKey = remoteKey || publicKey
  const activeId = remoteKey ? targetId : username
  const isRemote = !!remoteKey
  useEffect( () => {
    if (remoteKey) {
      document.documentElement.className += " encrypting"
    } else {
      document.documentElement.className =
      document.documentElement.className.replace("encrypting", '')
    }
  }, [remoteKey])
  return (
      <div className="jumbotron">
        <div className="container">
          {targetId && <ExplainDialog targetId={targetId} publicKey={remoteKey}/>}
          {!isRemote &&
           <InfoBox className="mb-5" dismissible={true}>
            Securely encrypt a file using your public key.
            The content is encrypted in the browser and kept on your computer.
          </InfoBox>}
          {isRemote &&
          <InfoBox className="mb-5" dismissible={true}>
              Securely encrypt a file in the browser using the public key of
              &nbsp;<cite>{trimId(targetId)}.</cite>
              <InfoToggle toggle="modal" target="#ExplainDialog"/>
              {false &&
               <button type="button" className="btn btn-primary" data-toggle="modal" data-target="#ExplainDialog">
                Explain
               </button>}
          </InfoBox>}
          <div className="d-flex justify-content-center align-items-center w-100">
            <KeyField className="PublicKeyField"
              label="Public Key"
              isOwner={!isRemote}
              username={activeId}
              publicKey={activeKey}/>
          </div>

          <div className="mt-4 pt-4 m-auto align-items-center">
            <DropEncrypt publicKey={activeKey} setResult={setResult} gotResult={!!content}/>

            { content &&
               <div className="alert alert-info text-center mt-4">
                  The file has been encrypted.
                </div> }

            <div className="d-flex justify-content-center align-items-center w-100 mt-3">
              <SaveButton content={content} onComplete={ resetForm }
                          filename={saveName}>
                Save Encrypted File
              </SaveButton>
          </div>
        </div>
       </div>
      </div>
    )
  }
