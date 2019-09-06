import React, { useState, useEffect, useCallback } from 'react'
import FileSaver from 'file-saver'
import { useBlockstack } from 'react-blockstack'
import { ECPair /*, address as baddress, crypto as bcrypto*/ } from 'bitcoinjs-lib'
import Dropzone, {DownloadButton} from './Dropzone.jsx'

function getPublicKeyFromPrivate(privateKey: string) {
  // from blockstack.js internal key module
  const keyPair = ECPair.fromPrivateKey(Buffer.from(privateKey, 'hex'))
  return keyPair.publicKey.toString('hex')
}

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
      var buffer = e.srcElement.result;//arraybuffer object
      const cipherObject = encryptContent(buffer)
      console.log("Encrypted:", cipherObject)
      const encrypted = new Blob([cipherObject], { type: "ECIES" })  //  https://fileinfo.com/filetypes/encoded
      const url = window.URL.createObjectURL(encrypted)
      console.log("Save url:", url)
      setUrl(url)
  })}}


function PublicKey (props) {
    const {publicKey} = props
    const url = window.location.origin + "/encrypt?public-key=" + publicKey
    const copyLink = () => {
          console.log("Copy encrypt link to clipboard")
        }
    const [hiddenKey, setHidden] = useState(true)
    const toggleKey = () => setHidden(!hiddenKey)
    return (
    <div className="PublicKeyField">

      <div className="input-group ">
        <div className="input-group-prepend">
          <span className="input-group-text">
            Public Key
          </span>
        </div>
        <input className="form-control"
               id="public-key-fieldxx"
               value={publicKey} readOnly={true}
               type={hiddenKey? "password" : "text"}
               onClick={ toggleKey }/>
        <div className="input-group-append">
                  <button className="btn btn-outline-secondary" type="button"
                          onClick={ copyLink }>
                    <i className="far fa-clipboard"></i> Magic Link
                  </button>
        </div>
      </div>
          {!hiddenKey && false ?
            <p>Use the button to copy a link with your public key.</p>
            : null}
    </div>
    )
  }


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
  const { userData } = useBlockstack()
  // const params = new URLSearchParams(window.location.search);
  // const publicKey = params.get('public-key')
  const privateKey = userData && userData.appPrivateKey
  const publicKey = privateKey && getPublicKeyFromPrivate(privateKey)
  const [url, setUrl] = useState()
  const setResult = useCallback(setUrl)
  return (
      <div className="jumbotron">

          <PublicKey publicKey={publicKey}/>

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
