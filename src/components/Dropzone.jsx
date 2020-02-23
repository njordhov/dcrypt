import React, { useCallback, useEffect, useState } from 'react';
import FileSaver, { saveAs } from 'file-saver'
import {useDropzone} from 'react-dropzone'
import { isFunction } from 'lodash'

import css from './Dropzone.css'

function useObjectUrl (content) {
  const [url, setUrl] = useState()
  useEffect( () => {
      setUrl(content ? window.URL.createObjectURL(content) : null)
    }, [content])
  return (url)
}

export function DownloadButton (props) {
  // Download file from URL
  const {url, filename, children, onComplete, icon} = props
  return (
      <div data-toggle="tooltip" title={filename ? "Save as: " + filename : null}>
        <a className={[!url ? "disabled":null, "btn btn-outline-primary center-text"].join(" ")}
         role="button"
         download = {"" + filename}
         onClick={onComplete || undefined} // best we can do as there are no event triggered upon download complete
         disabled= { !url }
         aria-disabled={ !url }
         rel="noopener noreferrer"
         href={url} target="_blank">
         <i className={icon || "fas fa-file-download mr-2"}></i>
         {children || <span>Save File</span>}
        </a>
      </div>
  )
}

function DownloadContentButton (props) {
  // Using download link for client-side content
  const { content, filename } = props
  const url = useObjectUrl(content)
  const custom = Object.assign({}, props, {url: url})
  return (DownloadButton(custom))
}

export function ExportContentButton (props) {
  // content can be a function->blob or a blob
  const { content, filename, children, onComplete, icon } = props
  const saveFile = useCallback(() => {
    const data = content && (isFunction(content) ? content() : content)
    if (data && !(data instanceof Blob)) {
      console.warn("Expected a Blob")
    }
    if(data instanceof Promise) {
      data.then((data) => saveAs(data, filename))
    } else {
      saveAs(data, filename)
    }
  }, [content, filename])
  const disabled = !content
  return (
    <div data-toggle="tooltip" title={filename ? "Save as: " + filename : null}>
      <a className={[disabled && "disabled", "btn btn-outline-primary center-text"].join(" ")}
         role="button"
         onClick={!disabled ? (() => {saveFile(); onComplete()}) : undefined}
         disabled= { disabled }
         aria-disabled={ disabled }>
         <i className={icon || "fas fa-file-export mr-2"}></i>
         { children }
      </a>
    </div>
  )
}

export function decryptedFilename (filename) {
  return (filename && filename.replace(/.dcrypt$/, ""))
}

export function encryptedFilename (filename) {
  return (decryptedFilename(filename) + ".dcrypt")
}

export function SaveButton (props) {
  const { content, filename } = props
  const [name, setName] = useState()
  useEffect( () => {
      setName(filename) // keeps it around beyond the click
    }, [filename])
  const custom = Object.assign({}, props, {filename: name})
  return (
    <div className="d-flex justify-content-center align-items-center w-100">
      {ExportContentButton(custom)}
    </div>)
}

export function OpenLink (props) {
  const { content } = props
  const url = useObjectUrl(content)
  return (
    <a href={url} target="_blank" rel="noopener noreferrer">
      {props.children}
    </a>
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
  const rootProps = getRootProps(Object.assign({}, props, {className: isDragActive ? props.className + " dragging" : props.className}))
  const inputProps = getInputProps()
  return (
    <div {...rootProps}>
      <input {...inputProps} />
      {props.children ||
        (isDragActive ?
          <div>Drop the files here</div> :
          <div>{props.placeholder || "Drag & drop a file here, or click to select from your filesystem."}</div>)
      }
    </div>
  )
}
