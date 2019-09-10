import React, { useState, useEffect, useCallback } from 'react'
import { useBlockstack } from 'react-blockstack'
import KeyField from './KeyField.jsx'
import { usePrivateKey } from './cipher.jsx'
import Dropzone, { DownloadButton } from './Dropzone.jsx'

function decryptHandler(file, decryptContent, setResult) {
  if (file) {
    var myReader = new FileReader()
    myReader.readAsArrayBuffer(file)
    myReader.addEventListener("loadend", (e) => {
      var buffer = e.srcElement.result;//arraybuffer object
      var decodedString = String.fromCharCode.apply(null, new Uint8Array(buffer));
      const cipherObject = decryptContent(decodedString)
      const decrypted = new Blob([cipherObject])  // https://fileinfo.com/filetypes/encoded
      setResult(decrypted)
  })}}

function DropDecrypt ({setResult}) {
  const { userSession } = useBlockstack()
  const [files, setFiles] = useState([])
  const [message, setMessage] = useState()
  const decryptContent = useCallback((content => {
    try {
      return( userSession.decryptContent(content) )
    } catch (err) {
      console.info("Failed to decrypt:", err)
      setFiles([])
      setMessage("Can't decrypt the file, possibly because it is not encrypted with your public key.")
    }
  }), [userSession])
  const file = files && files[0]
  const placeholder = message || "Drag & drop an encrypted file here, or click to select from your filesystem."
  useEffect( () => decryptHandler(file, decryptContent, setResult), [file, decryptContent])

  return (
      <>
        <Dropzone className="Dropzone" onChange = { setFiles }
                  placeholder={placeholder}>
        { message ||
         (file
         ? <i className="fas fa-unlock-alt m-auto"></i>
         : <i className="fas fa-file-import m-auto"></i>)}
         </Dropzone>
      </>
    );
  }

export default function Decrypt (props) {
  const [url, setUrl] = useState()
  const setResult = useCallback( decrypted => setUrl(window.URL.createObjectURL(decrypted)) )
  const privateKey = usePrivateKey()
  const resetForm = () => console.log("File saved, ready to reset the form")
  return (
    <div className="jumbotron">

      <div className="d-flex justify-content-center align-items-center w-100">
        <KeyField className="PrivateKeyField"
          label="Private Key" privateKey={privateKey} />
      </div>

      <div className="mt-4">
        <DropDecrypt setResult={setResult}/>
      </div>
      { url ?
         <div className="alert alert-info text-center mt-4">
            The file has been decrypted and the result is ready to be saved.
          </div>
        : null}
      <div className="d-flex justify-content-center align-items-center w-100 mt-3">
        <DownloadButton url={url} filename="decrypted" onComplete={ resetForm }>
          Save Decrypted File
        </DownloadButton>
      </div>
    </div>
  )
}
