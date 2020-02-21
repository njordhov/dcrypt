import React, { useState, useCallback, useReducer, useEffect, useRef, useLayoutEffect } from 'react'
import { debounce } from 'lodash'
import { EditorState, ContentState, convertFromRaw, convertToRaw } from 'draft-js'
import { Editor as DraftEditor } from 'react-draft-wysiwyg'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'
import draftToHtml from 'draftjs-to-html'
import htmlToDraft from 'html-to-draftjs'

export function editorMarkup (raw) {
  return (draftToHtml(raw))
}

export function contentFromMarkup (markup) {
  const blocksFromHtml = htmlToDraft(markup)
  const { contentBlocks, entityMap } = blocksFromHtml
  const contentState = ContentState.createFromBlockArray(contentBlocks, entityMap)
  return (contentState)
}

function draftFromMarkup (markup) {
  const contentState = contentFromMarkup(markup)
  const editorState = EditorState.createWithContent(contentState)
  return (editorState)
}


const toolbar = {
  none: {options: []},
  basic: {options: ['blockType', 'inline', 'link', 'emoji', 'history'],
            inline: {options: ['bold', 'italic', 'underline']}}
}

export default function Editor ({active, onChange, defaultEditorState, readOnly}) {
  // https://github.com/jpuri/react-draft-wysiwyg
  console.log("Editor:", active)
  const [contentState, setContentState] = useState({})
  const editor = useRef(null);
  function focusEditor() {
    editor && editor.current && editor.current.focus()
  }
  const resetEditor = useCallback( () => {
    // https://stackoverflow.com/questions/52646426/set-editorstate-without-the-application-state-in-draft-js
    console.log("ACTIVE RESET:", active)
    const content = ContentState.createFromText('')
    const editorState = EditorState.createWithContent(content)
    //EditorState.push(editorState, content)
    editor.current.update(editorState)
    //editor.current.forceUpdate()
  },[editor.current, active])

  console.log("ACTIVE:", active)
  useEffect(() => {
    if (active) {
      focusEditor() // has to be before reset...
      resetEditor()
    }
  }, [active])
  const changeCallback = useCallback(onChange && debounce(onChange, 500),[onChange])
  useEffect(() => {
    onChange && contentState && changeCallback(contentState)
  }, [contentState, onChange])
  return(
    <div className="MsgEditor w-100 border-primary bg-dark text-dark border border-dark"
         style={{minHeight: "20em"}}>
      <button hidden={true} onClick={() => resetEditor()}>Reset</button>
      <DraftEditor
        editorRef={(ref) => {editor.current = ref}}
        //initialContentState={initial}
        {...(readOnly ? {editorState:defaultEditorState} : null)}
        // editorState={readOnly ? defaultEditorState : null}
        // defaultContentState={defaultEditorState}
        // defaultEditorState={defaultEditorState}
        onContentStateChange={!readOnly ? setContentState : null}
        wrapperClassName=""
        editorClassName="text-light mx-2 my-0"
        toolbarClassName=""
        ReadOnly={readOnly}
        toolbar={readOnly ? toolbar.none : toolbar.basic}
      />
    </div>
  )
}

export function ViewEditor ({active, decrypted}) {
  const [editorState, setEditorState] = useState(null)
  console.log("DECRYPTED:", decrypted, (typeof decrypted), editorState)
  useEffect(() => {
    // decrypted is a blob
    if (decrypted && (typeof decrypted === "object")) {
      decrypted.text()
      .then((markup) => {
        console.log("MARKUP:", markup)
        setEditorState(draftFromMarkup(markup))
      })
    }
  }, [decrypted])
  return (
    editorState && <Editor active={false} readOnly={true} defaultEditorState={editorState}/>
  )
}
