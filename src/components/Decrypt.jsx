import React, { useState } from 'react';
import Dropzone from './Dropzone.jsx'

export default function Decrypt (props) {
  const [files, setFiles] = useState([])

  function onChange (files) {
      console.log("Current files:", files)
      setFiles(files)
    }

  return (
      <div className="jumbotron">
        <p className="lead">
          Decrypt!
        </p>
        <Dropzone className="Dropzone" onChange = { onChange }>
        { files.length > 0
         ? <i className="fas fa-unlock-alt m-auto"></i>
         : null}
         </Dropzone>
         { files.length > 0
           ? <div className="alert alert-info text-center mt-4">Your file has been decrypted</div>
           : null}
      </div>
    );
  }
