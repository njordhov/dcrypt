import React, {useCallback} from 'react'

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
  const copyAction = useCallback(() => {
    console.log("Clip:", targetRef.current)
    copyToClipboard({target: targetRef.current})  // ref not reactive
  })
  return(
  <button className="btn btn-primary" type="button"
          dataToggle="tooltip" dataPlacement="top" title="Copy link to clipboard"
          onClick={copyAction}>
    <i className="fas fa-clone"></i>
  </button>
  )
}
