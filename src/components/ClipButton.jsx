import React from 'react'

function copyToClipboard({target}) {
    const range = document.createRange()
    // const element = document.getElementById(id)
    // TODO: Use clipboard library
    range.selectNode(target)
    window.getSelection().removeAllRanges() // clear current selection
    window.getSelection().addRange(range) // to select text
    document.execCommand("copy")
    window.getSelection().removeAllRanges() // to deselect
  }

export default function ClipButton ({targetRef}) {
  console.log("CLIP:", targetRef.current)
  const copyAction = () => {
    copyToClipboard({target: targetRef.current})
  }
  return(
  <button className="btn btn-primary" type="button"
          dataToggle="tooltip" dataPlacement="top" title="Copy link to clipboard"
          disabled={!targetRef.current}
          onClick={copyAction}>
    <i className="fas fa-clone"></i>
  </button>
  )
}
