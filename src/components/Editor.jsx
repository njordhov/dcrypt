import React, { useState, useCallback, useReducer, useEffect } from 'react'
import { EditorState, convertFromRaw, convertToRaw } from 'draft-js'
import { Editor as DraftEditor } from 'react-draft-wysiwyg'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'

export default function Editor ({onChange}) {
  // https://github.com/jpuri/react-draft-wysiwyg
  const [content, setContent] = useState()
  useEffect(() => {
    onChange && content && onChange(convertFromRaw(content))
  }, [content, onChange])
  return(
    <div className="MsgEditor w-100 border-primary bg-dark text-dark border border-dark"
         style={{minHeight: "20em"}}>
      <DraftEditor
        wrapperClassName=""
        editorClassName="text-light mx-2 my-0"
        toolbarClassName=""
        toolbar={{options: ['blockType', 'inline', 'link', 'colorPicker', 'emoji', 'history'],
                  inline: {options: ['bold', 'italic', 'underline']}}}
        onChange={setContent}
      />
    </div>
  )
}
