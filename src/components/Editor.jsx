import React, { useState, useCallback, useReducer, useEffect, useRef } from 'react'
import { EditorState, convertFromRaw, convertToRaw } from 'draft-js'
import { Editor as DraftEditor } from 'react-draft-wysiwyg'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'
import draftToHtml from 'draftjs-to-html';

export function editorMarkup (raw) {
  return (draftToHtml(raw))
}

const toolbar = {
  empty: {options: []},
  basic: {options: ['blockType', 'inline', 'link', 'colorPicker', 'emoji', 'history'],
            inline: {options: ['bold', 'italic', 'underline']}}
}

export default function Editor ({active, onChange}) {
  // https://github.com/jpuri/react-draft-wysiwyg
  const [editorState, setEditorState] = useState({})
  const editor = useRef(null);
  function focusEditor() {
    editor && editor.current && editor.current.focus()
  }
  useEffect(() => {
    if (active) {
      focusEditor()
    }
  }, [active])
  useEffect(() => {
    onChange && editorState && onChange(editorState)
  }, [editorState, onChange])
  return(
    <div className="MsgEditor w-100 border-primary bg-dark text-dark border border-dark"
         style={{minHeight: "20em"}}>
      <DraftEditor
        editorRef={(ref) => {editor.current = ref}}
        //initialContentState={editorState}
        //editorState={editorState}
        onContentStateChange={setEditorState}
        wrapperClassName=""
        editorClassName="text-light mx-2 my-0"
        toolbarClassName=""
        toolbar={toolbar.basic}
      />
    </div>
  )
}
