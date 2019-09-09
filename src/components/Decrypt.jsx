import React, { useState, useEffect, useCallback } from 'react'
import { useBlockstack } from 'react-blockstack'
import Dropzone, {DownloadButton} from './Dropzone.jsx'


function decryptHandler(file, decryptContent, setUrl) {
  if (file) {
    var myReader = new FileReader()
    myReader.readAsArrayBuffer(file)
    myReader.addEventListener("loadend", (e) => {
      var buffer = e.srcElement.result;//arraybuffer object
      var decodedString = String.fromCharCode.apply(null, new Uint8Array(buffer));
      const cipherObject = decryptContent(decodedString)
      const decrypted = new Blob([cipherObject])  // https://fileinfo.com/filetypes/encoded
      const url = window.URL.createObjectURL(decrypted)
      setUrl(url)
  })}}

function DropDecrypt (props) {
  const { userSession } = useBlockstack()
  const [files, setFiles] = useState([])
  const [url, setUrl] = useState()
  const decryptContent = useCallback((content => userSession.decryptContent(content)), [userSession])
  const file = files && files[0]
  const placeholder = "Drag & drop an encrypted file here, or click to select from your filesystem."
  useEffect( () => decryptHandler(file, decryptContent, setUrl), [file, decryptContent])

  return (
      <>
        <Dropzone className="Dropzone" onChange = { setFiles }
                  placeholder={placeholder}>
        { files.length > 0
         ? <i className="fas fa-unlock-alt m-auto"></i>
         : null}
         </Dropzone>
      </>
    );
  }

export default function Decrypt (props) {
  const [url, setUrl] = useState()
  const setResult = useCallback(setUrl)
  return (
    <div className="jumbotron">
      <div className="mt-4">
        <DropDecrypt  setResult={setResult}/>
      </div>
      { url ?
         <div className="alert alert-info text-center mt-4">
            The file has been encrypted and the result is ready to be saved.
          </div>
        : null}
      <div className="d-flex justify-content-center align-items-center w-100 mt-3">
        <DownloadButton url={url} filename="decrypted">
          Save Decrypted File
        </DownloadButton>
      </div>
    </div>
  )
}
