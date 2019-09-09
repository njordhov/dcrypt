import React, { useCallback } from 'react';
import {useDropzone} from 'react-dropzone'

export function DownloadButton (props) {
  const {url, filename, children} = props
  return (
    <div className="d-flex justify-content-center align-items-center w-100">
      <div>
        <a className={[!url ? "disabled":null, "btn btn-success center-text"].join(" ")}
         role="button"
         download={ filename || true}
         disabled= { !url }
         aria-disabled={ !url }
         href={url} target="_blank">
         <i className="fas fa-file-download mr-2"></i>
         {children || <span>Save File</span>}
        </a>
      </div>
    </div>
  )
}

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
          <div>Drop the files here</div> :
          <div>{props.placeholder || "Drag & drop a file here, or click to select from your filesystem."}</div>)
      }
    </div>
  )
}
