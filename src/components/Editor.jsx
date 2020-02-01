import React, { useState, useCallback, useReducer, useEffect } from 'react'
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

export default function Editor ({onChange}) {
  // https://github.com/jpuri/react-draft-wysiwyg
  const [content, setContent] = useState()
  useEffect(() => {
    onChange && content && onChange(content)
  }, [content, onChange])
  return(
    <div className="MsgEditor w-100 border-primary bg-dark text-dark border border-dark"
         style={{minHeight: "20em"}}>
      <DraftEditor
        wrapperClassName=""
        editorClassName="text-light mx-2 my-0"
        toolbarClassName=""
        toolbar={toolbar.basic}
        onChange={setContent}
      />
    </div>
  )
}
