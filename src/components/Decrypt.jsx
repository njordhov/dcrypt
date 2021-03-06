import React, { useEffect, useCallback, useReducer } from 'react'
import { useBlockstack } from 'react-blockstack'
import { isNil, isEmpty, reduce } from 'lodash'
import JSZip from 'jszip'
import KeyField from './KeyField.jsx'
import { usePrivateKey, useDecryptContent } from './cipher.jsx'
import Dropzone, { SaveButton, decryptedFilename } from './Dropzone.jsx'
import InfoBox from './InfoBox'
import { ViewEditor } from './Editor'
import { features } from './config'

import 'text-security/dist/text-security.css'

// TODO: Simplify using the similar code in dCrypt Drop
// This implementation can likely be much faster!

function decryptHandler(file, decryptContent, addResult, onError) {
  if (file) {
    var myReader = new FileReader()
    myReader.addEventListener("loadend", (e) => {
      var buffer = e.srcElement.result; //arraybuffer object
      if (buffer) {
        const bufferCharCodes = new Uint8Array(buffer)
        // NOTE: var decodedString = String.fromCharCode(...bufferCharCodes) -> buffer overflow for large files in some browsers
        const f = (out, code, ix) => out += String.fromCharCode(code)
        const decodedString = reduce(bufferCharCodes, f, "")
        // const encryptedItems = decodedString.split(/(?!})/g)
        const encryptedItems = decodedString.match(/[^}]+}?|}/g) // split out each {...}
        //console.log("Items to decrypt:", decodedString, encryptedItems
        encryptedItems.forEach ( encryptedContent => {
          decryptContent(encryptedContent)
          .then((originalObject) => {
            const decrypted = new Blob([originalObject])  // https://fileinfo.com/filetypes/encoded
            decrypted.filename = decryptedFilename(file.name)
            addResult(decrypted)})
          .catch (err => {
            console.error("File not decrypted:", file, err)
            onError && onError({type: "decrypt failed", error: err, 
                                message: "Can't decrypt the file, possibly because it is not encrypted with your public key."})
            addResult(null)})
        })
      } else {
        console.warn("Failed to read file:", file)
        addResult(null)
      }
    })
    myReader.readAsArrayBuffer(file)
  }}


function decryptReducer (state, action) {
  // shared for multiple components
  switch (action.type) {
    case "files":
      const files = action.files
      const file = files && files[0]
      return({...state, file: file, message: null})
    case "content":
      return({...state, content: action.content})
    case "result":
      // accumulator
      if (isNil(state.content)) {
        return ({...state, content: action.result})
      } else {
        return({...state, result: [...state.result || [], action.result]})
      }
    case "message":
      return({...state, message: action.message})
    case "error":
      return({error: action.error})
    case "reset":
      return({})
    default:
      throw new Error("Unknown event option:", action.type);
  }
}


export function DropDecrypt ({addResult, gotResult, onError, filename}) {
  const [{file}, dispatch] = useReducer(decryptReducer, {});
  const setFiles = useCallback((files) => {
    dispatch({type: "files", files: files })
  }, [dispatch])
  const decryptContent = useDecryptContent()
  const handleDecrypt = useCallback ( (file) => {
    decryptHandler(file, decryptContent, addResult, onError)
  }, [decryptContent, addResult, onError])
  
  useEffect(() => {
    if (!gotResult) {
      setFiles([])
    }
  }, [gotResult, setFiles])
  useEffect( () => {
    handleDecrypt(file)
  }, [file, handleDecrypt])
  
  const placeholder = <span>Drag & drop a <cite>dCrypt</cite> encrypted file here, or click to select from your filesystem.</span>

  return (
      <>
        <Dropzone className="Dropzone" onChange = { setFiles }
                  placeholder={placeholder}>
        { !file ?
          <div className="mx-auto text-center">
              <div>
                <i className="fas fa-file-import m-auto"></i>
              </div>
              <div className="mt-4">
                {placeholder}
              </div>
            </div>
          : !gotResult ?
          <div className="m-auto text-center">
              <div className="spinner-border text-success" role="status">
                <span className="sr-only">Decrypting...</span>
              </div>
           </div>
          : gotResult ?
           <div className="mx-auto text-center">
              <div><i className="fas fa-unlock-alt text-primary m-auto"></i></div>
              <div className="mt-2">{filename || (file && file.name)}</div>
           </div>
         : <div>Error</div>}
         </Dropzone>
      </>
    );
  }

export default function Decrypt (props) {
  const { userData } = useBlockstack()
  const {username} = userData || {}
  const privateKey = usePrivateKey()

  const [{content, result, error}, dispatch] = useReducer(decryptReducer, {});
  const addResult = useCallback((content) => {
    dispatch({type: "result", result: content})
  }, [dispatch])
  const setError = useCallback((note) => {
    dispatch({type: "error", error: note})
  }, [dispatch])
  const filename  = content && content.filename && decryptedFilename(content.filename)
  const onError = useCallback(({type, message}) => {
    console.warn("Problem during decryption:", type, message)
    setError(message)
  }, [setError])
  const resetForm = useCallback(() => dispatch({type: "reset"}), [dispatch])
  const decryptedThunk = useCallback( (content || !isEmpty(result)) && (() => {
    if (isEmpty(result)) {
      return content
    } else {
      var zip = new JSZip()
      const root = zip.folder("Decrypted Archive")
      root.file("message.html", content)
      const folder = root.folder("Attachments")
      var i = 0
      result.forEach( (attachment) => {
        i = i + 1
        folder.file(attachment.filename || ("" + i), attachment)
      })
      return(zip.generateAsync({type:"blob"}))
    }
  }), [content, result])
  // console.debug("DECRYPT:", content)
  return (
    <div className="jumbotron">
     <div className="container">
      <InfoBox className="mb-5" dismissible={true}>
       Decrypt an encrypted {(features.message && !features.files) ? "message" : ""} file using your private key.
       The content is decrypted in the browser and kept on your computer.
     </InfoBox>
      <div className="d-flex justify-content-center align-items-center w-100">
        <KeyField className="PrivateKeyField"
          username={username}
          label="Private Key" privateKey={privateKey} />
      </div>

      <div className="mt-4 pt-4 m-auto align-items-center">
       {!(features.message && !!content) &&
        <DropDecrypt addResult={addResult} gotResult={!!content} onError={onError}
                     filename={filename}/>}
        { error &&
          <div className="alert alert-warning text-center mt-4">
            {error}
          </div>
        }
        {(features.message && !!content) &&
          <ViewEditor active={true} decrypted={content}/>}
        { features.files && result &&
          <div className="alert alert-dark text-center mt-4">
            {(result.length > 0) &&
              ("" + result.length + " Attachment" + (result.length > 1 ? "s" : ""))}
          </div>
        }
        { content &&
           <div className="alert alert-info text-center mt-4">
              The file has been decrypted and the result is ready to be saved.
            </div> }
        <div className="d-flex justify-content-center align-items-center mt-3">
          <SaveButton content={decryptedThunk}
                      onComplete={ resetForm }
                      filename={"Decrypted" || filename}>
            Save Decrypted {
              !features.files ? "Message" : !features.message ? "File" : "Archive"
            }
          </SaveButton>
        </div>
       </div>
      </div>
    </div>
  )
}
