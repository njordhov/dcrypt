import React, { useState, useEffect, useCallback } from 'react'
import FileSaver from 'file-saver'
import { useBlockstack } from 'react-blockstack'
import { ECPair /*, address as baddress, crypto as bcrypto*/ } from 'bitcoinjs-lib'
import { isNil, isNull } from 'lodash'
import KeyField from './KeyField.jsx'
import {usePublicKey, usePublishKey, useRemotePublicKey} from './cipher.jsx'
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
                <div><i class="fas fa-shield-alt"></i></div>
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
  return (
      <div className="jumbotron">
        <div className="m-auto" style={{maxWidth: "40em"}}>
          {!targetId &&
           <InfoBox className="mb-4" dismissible={true}>
            Securely encrypt a file in the browser using your public key.
            The content is encrypted in the browser and kept on your computer.
          </InfoBox>}
          {targetId &&
          <InfoBox className="mb-4" dismissible={true}>
              Securely encrypt a file in the browser using the public key of
              user&nbsp;{targetId.replace(/.id.blockstack/, "")}.
          </InfoBox>}
          <div className="d-flex justify-content-center align-items-center w-100">
            <KeyField className="PublicKeyField"
              label="Public Key"
              username={targetId || username}
              publicKey={activeKey}/>
          </div>

          <div className="mt-4 pt-4 m-auto align-items-center"
               style={{maxWidth: "40em"}}>
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
