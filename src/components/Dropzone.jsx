import React, { Component,  useCallback} from 'react';
import {useDropzone} from 'react-dropzone'

export default function Dropzone(props) {
  console.log("Dropzone:", props)
  // https://react-dropzone.js.org/
  const onDrop = useCallback(acceptedFiles => {
    console.log("Dropped:", acceptedFiles);
    // Do something with the files
  }, [])
  const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop})

  return (
    <div {...getRootProps(props)}>
      <input {...getInputProps()} />
      {
        isDragActive ?
          <p>Drop the files here to encrypt</p> :
          <p>Drag 'n' drop some files here, or click to select files</p>
      }
    </div>
  )
}
