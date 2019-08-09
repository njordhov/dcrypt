import React, { Component,  useCallback} from 'react';
import {useDropzone} from 'react-dropzone'

export default function Dropzone(props) {
  console.log("Dropzone:", props)
  // https://react-dropzone.js.org/
  const onDrop = useCallback(acceptedFiles => {
    if (props && props.onChange) {
      // ## FIX: include eventual previous files
      props.onChange(acceptedFiles)
    } else {
      console.log("Dropped in Dropzone:", acceptedFiles)
    }
  }, [])
  const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop})

  return (
    <div {...getRootProps(props)}>
      <input {...getInputProps()} />
      {props.children ||
        (isDragActive ?
          <p>Drop the files here to encrypt</p> :
          <p>Drag 'n' drop some files here, or click to select files</p>)
      }
    </div>
  )
}
