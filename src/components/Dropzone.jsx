import React, { useCallback, useEffect, useState } from 'react';
import {useDropzone} from 'react-dropzone'

export function DownloadButton (props) {
  const {url, filename, children, onComplete} = props
  return (
    <div className="d-flex justify-content-center align-items-center w-100">
      <div data-toggle="tooltip" title={filename ? "Save as: " + filename : null}>
        <a className={[!url ? "disabled":null, "btn btn-outline-primary center-text"].join(" ")}
         role="button"
         download = {"" + filename}
         onClick={onComplete} // best we can do as there are no event triggered upon download complete
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

export function decryptedFilename (filename) {
  return (filename.replace(/.dcrypt$/, ""))
}

export function encryptedFilename (filename) {
  return (decryptedFilename(filename) + ".dcrypt")
}

export function SaveButton (props) {
  const { content, filename } = props
  const [url, setUrl] = useState()
  const [name, setName] = useState()
  useEffect( () => {
      setName(filename || (content && encryptedFilename(content.filename))) //keeps it around beyond the click
      setUrl(content? window.URL.createObjectURL(content) : null)
    }, [content, filename])
  const custom = {url: url, filename: name}
  return ( DownloadButton(Object.assign({}, props, custom)) )
}

export function OpenLink (props) {
  const { content } = props
  const [url, setUrl] = useState()
  useEffect( () => {
      setUrl(content? window.URL.createObjectURL(content) : null)
    }, [content])
  return (
  <a href={url} target="_blank">{props.children}</a>)
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
