import React, { useState, useEffect, useCallback, useReducer } from 'react'
import { useBlockstack } from 'react-blockstack'
import { isNil, isNull } from 'lodash'
import KeyField from './KeyField.jsx'
import { usePrivateKey } from './cipher.jsx'
import Dropzone, { DownloadButton, decryptedFilename } from './Dropzone.jsx'

function decryptHandler(file, decryptContent, setResult) {
  if (file) {
    var myReader = new FileReader()
    myReader.readAsArrayBuffer(file)
    myReader.addEventListener("loadend", (e) => {
      var buffer = e.srcElement.result; //arraybuffer object
      if (buffer) {
        console.log("decryptHandler", file, buffer.length)
        var decodedString = String.fromCharCode.apply(null, new Uint8Array(buffer));
        const originalObject = decryptContent(decodedString)
        if (originalObject) {
          const decrypted = new Blob([originalObject])  // https://fileinfo.com/filetypes/encoded
          decrypted.filename = file.name
          setResult(decrypted)
        } else {
          console.warn("File not decrypted:", file)
          setResult(null)
        }
      } else {
        console.warn("Failed to read file:", file)
        setResult(null)
      }
  })}}

function decryptReducer (state, action) {
  switch (action.type) {
    case "files":
      const files = action.files
      const file = files && files[0]
      return({file: file, message: null})
    default:
      throw new Error();
  }
}

export function DropDecrypt ({setResult, gotResult, onError}) {
  const { userSession } = useBlockstack()

  const [{file}, dispatch] = useReducer(decryptReducer, {});
  const setFiles = (files) => dispatch({type: "files", files: files })
  const setMessage = (message) => dispatch({type: "message", message: message})

  const decryptContent = useCallback((content => {
    try {
      return( userSession.decryptContent(content) )
    } catch (err) {
      console.info("Failed to decrypt:", err)
      setFiles(null)
      onError && onError({type: "decrypt failed", error: err, message: "Can't decrypt the file, possibly because it is not encrypted with your public key."})
      return(null)
    }
  }), [userSession])
  const placeholder = "Drag & drop an encrypted file here, or click to select from your filesystem."

  useEffect( () => decryptHandler(file, decryptContent, setResult), [file, decryptContent])

  return (
      <>
        <Dropzone className="Dropzone" onChange = { setFiles }
                  placeholder={placeholder}>
        { ((!isNull(gotResult) ? gotResult : file)
         ? <i className="fas fa-unlock-alt m-auto"></i>
         : <div>
             <i class="fas fa-shield-alt"></i>
             <i className="fas fa-file-import m-auto"></i>
           </div>)}
         </Dropzone>
      </>
    );
  }

export default function Decrypt (props) {
  const [url, setUrl] = useState()
  const [filename, setName] = useState()
  const privateKey = usePrivateKey()
  const [message, setMessage] = useState()

  const setResult = useCallback( decrypted => {
    if (decrypted) {
      setName(decryptedFilename(filename))
      setUrl(window.URL.createObjectURL(decrypted))
      setMessage(null)
  }})
  const onError = ({type, message}) => {
    console.warn("", type, message)
    setMessage(message)
  }
  const resetForm = () => {
    console.log("File saved, ready to reset the form")
    setUrl(null)
    setMessage(null)
  }
  return (
    <div className="jumbotron">

      <div className="d-flex justify-content-center align-items-center w-100">
        <KeyField className="PrivateKeyField"
          label="Private Key" privateKey={privateKey} />
      </div>

      <div className="mt-4">
        <DropDecrypt setResult={setResult} gotResult={!!url} onError={onError}/>
      </div>
      { message &&
        <div className="alert alert-warning text-center mt-4">
          {message}
        </div>
      }
      { url ?
         <div className="alert alert-info text-center mt-4">
            The file has been decrypted and the result is ready to be saved.
          </div>
        : null}
      <div className="d-flex justify-content-center align-items-center w-100 mt-3">
        <DownloadButton url={url} onComplete={ resetForm } filename={filename}>
          Save Decrypted File
        </DownloadButton>
      </div>
    </div>
  )
}
