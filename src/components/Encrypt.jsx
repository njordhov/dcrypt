import React, { useState } from 'react'
import FileSaver from 'file-saver'
import { useBlockstack } from 'react-blockstack'
import Dropzone from './Dropzone.jsx'

export default function Encrypt (props) {
  const { userSession } = useBlockstack()
  const [files, setFiles] = useState([])
  const params = new URLSearchParams(window.location.search);
  const publicKey = params.get('public-key')

  function onChange (files) {
    console.log("Current files:", files)
    setFiles(files)
  }

  function saveEncrypted (files, publicKey) {
    console.log("Save encrypted:", files, publicKey)
    //var file = new File(["Hello, world!"], "hello world.txt", {type: "text/plain;charset=utf-8"})
    //FileSaver.saveAs(file)
    // ## FIX: handle multiple files
    // ## TODO: Notify blockstack that encryptContent should take a file (it's a blob)
    const reader = new FileReader()
    const file = files[0]
    reader.onload = e => {
      const content = e.target.result
      const encrypted = userSession.encryptContent(content, publicKey)
      FileSaver.saveAs(JSON.stringify(encrypted))
    }
    reader.readAsArrayBuffer(file)
  }

  return (
      <div className="jumbotron">
        <p className="lead">
          Encrypt! {publicKey}
        </p>
        <Dropzone className="Dropzone" onChange = { onChange }>
          { files.length > 0
           ? <i class="fas fa-shield-alt m-auto"></i>
           : null}
        </Dropzone>
        <button className="btn btn-success btn-block mt-4"
                    disabled= { files.length === 0}
                    onClick={ () => saveEncrypted( files, publicKey)}>
                    Save Encrypted
        </button>
        { files.length > 0
                  ? <div className="alert alert-info text-center mt-4">
                      The file has been encrypted and the result is ready to be saved.</div>
                  : null}

      </div>
    )
  }
