import React from 'react'
import { Toast, ToastBody, ToastHeader } from 'reactstrap'

function copyToClipboard(element) {
    var range = document.createRange();
    // const element = document.getElementById(id)
    // TODO: Use clipboard library
    range.selectNode(element);
    window.getSelection().removeAllRanges(); // clear current selection
    window.getSelection().addRange(range); // to select text
    document.execCommand("copy");
    window.getSelection().removeAllRanges();// to deselect
  }

export default function ClipButton ({targetRef}) {
  console.log("CLIP:", targetRef.current)
  return(
  <button className="btn btn-primary" type="button"
          dataToggle="tooltip" dataPlacement="top" title="Copy link to clipboard"
          disabled={!targetRef.current}
          onClick={() => copyToClipboard(targetRef.current)}>
    <i className="fas fa-clone"></i>
  </button>
  )
}
