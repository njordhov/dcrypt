import React, { useState, useEffect, useCallback } from 'react'
import FileSaver from 'file-saver'
import { useBlockstack } from 'react-blockstack'
import { ECPair /*, address as baddress, crypto as bcrypto*/ } from 'bitcoinjs-lib'
import KeyField from './KeyField.jsx'
import {usePublicKey} from './cipher.jsx'
import Dropzone, { DownloadButton } from './Dropzone.jsx'

function saveEncrypted (files, encrypt) {
  // consider using filesaver package or similar
    console.log("Save encrypted:", files)
    //var file = new File(["Hello, world!"], "hello world.txt", {type: "text/plain;charset=utf-8"})
    //FileSaver.saveAs(file)
    // ## FIX: handle multiple files
    // ## TODO: Notify blockstack that encryptContent should take a file (it's a blob)
    const reader = new FileReader()
    const file = files[0]
    console.log("Save encrypted file:", file)
    const url = window.URL.createObjectURL(file)
    console.log("Save url:", url)
    /*
    reader.onload = e => {
      const content = e.target.result
      const encrypted = encrypt(content)
      FileSaver.saveAs(JSON.stringify(encrypted))
    }
    reader.readAsArrayBuffer(file)*/
  }

function encryptHandler(file, encryptContent, setUrl) {
  if (file) {
    var myReader = new FileReader()
    myReader.readAsArrayBuffer(file)
    myReader.addEventListener("loadend", (e) => {
      var buffer = e.srcElement.result;  //arraybuffer object
      const cipherObject = encryptContent(buffer)
      console.log("Encrypted:", cipherObject)
      const encrypted = new Blob([cipherObject], { type: "ECIES" })  //  https://fileinfo.com/filetypes/encoded
      const url = window.URL.createObjectURL(encrypted)
      console.log("Save url:", url)
      setUrl(url)
  })}}

function DropEncrypt ({publicKey, setResult}) {
    const { userSession } = useBlockstack()
    const [files, setFiles] = useState([])
    const [url, setUrl] = useState()
    const encryptContent = useCallback(content => userSession.encryptContent(content, publicKey),
                                      [userSession, publicKey])
    const file = files &&  files[0]
    useEffect( (() => encryptHandler(file, encryptContent, setUrl)),[file, encryptContent])
    const onChange = (files) => {
      console.log("Current files:", files)
      setFiles(files)
    }
    useEffect( (() => setResult ? setResult(url) : null), [setResult, url])
    return (
       <>
        <Dropzone className="Dropzone" onChange = { onChange }>
          { files.length > 0
           ? <i class="fas fa-shield-alt m-auto"></i>
           : null}
        </Dropzone>
      </>
)}


export default function Encrypt (props) {
  const { userData, userSession } = useBlockstack()
  const [url, setUrl] = useState()
  const setResult = useCallback(setUrl)
  const publicKey = usePublicKey()
  useEffect( () => {
    if (publicKey && userSession) {
      userSession.putFile("public", JSON.stringify({publicKey: publicKey}))
    }}, [publicKey, userSession])
  return (
      <div className="jumbotron">

          <div className="d-flex justify-content-center align-items-center w-100">
            <KeyField className="PublicKeyField"
              label="Public Key" publicKey={publicKey}/>
          </div>

          <div className="mt-4">
            <DropEncrypt  setResult={setResult}/>
          </div>

          { url ?
             <div className="alert alert-info text-center mt-4">
                The file has been encrypted and the result is ready to be saved.
              </div>
            : null}

          <div className="d-flex justify-content-center align-items-center w-100 mt-3">
            <DownloadButton url={url} filename="encrypted">
              Save Encrypted File
            </DownloadButton>
          </div>

      </div>
    )
  }
