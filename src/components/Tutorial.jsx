import React, { useState, useCallback, useReducer, useEffect } from 'react'
import { useBlockstack } from 'react-blockstack'
import { Atom, swap, useAtom, deref} from "@dbeining/react-atom"
import { isNil } from 'lodash'
import {DropEncrypt} from './Encrypt'
import {DropDecrypt} from './Decrypt'
import Dropzone, { SaveButton, OpenLink, encryptedFilename, decryptedFilename } from './Dropzone.jsx'
import InfoBox, {InfoToggle} from './InfoBox'
import KeyField from './KeyField'
import Editor, { editorMarkup, draftFromMarkup, ViewEditor } from './Editor'
import {usePublicKey, usePrivateKey} from './cipher'
import {classNames} from './library'
import { features } from './config'

function Card (props) {
  return (
  <div className={classNames("card bg-secondary", props.active && "border-warning", props.className)}
       {...props} active={null}>
    {props.children}
  </div>
  )
}

function useAtomReducer (atom, reducer) {
  const state = useAtom(atom)
  const dispatch = useCallback((event) => swap(atom, (state) => reducer(state, event)))
  return [state, dispatch]
}

const tutorialAtom = Atom.of({step: null})

const useTutorialReducer = (reducer) => useAtomReducer(tutorialAtom, reducer)

function safekeepingReducer (state, event) {
  console.log("Reduce:", state, event)
  switch (event.type) {
    case "content":
      return({...state, content: event.content, step: "save"})
    case "encrypted":
      return({...state, encrypted: event.encrypted, step: "save"})
    case "saved":
      return({...state, saved: true, step: "decrypt"})
    case "decrypted":
      return({...state, decrypted: event.decrypted, step: "export"})
    case "done":
      return({...state, done:true, step: "done"})
    case "reset":
      return({step: "import"})
    default:
      console.error("Unknown dispatch:", event.type, event)
      throw new Error();
  }
}

function StepHeader ({completed, children}) {
  return(
    <h5 className="card-header">
      {completed ? <i class="fas fa-check-circle mr-2 text-primary"></i>
                 : <i class="far fa-circle mr-2 text-primary"></i>}
      {children}
    </h5>
  )
}

function PublicKeyField ({username, publicKey, className}) {
  return (
    <KeyField className={classNames("PublicKeyField", className)}
      label="Public Key"
      isOwner={true}
      username={username}
      publicKey={publicKey}/>
  )
}

function PrivateKeyField ({username, privateKey, className}) {
  return(
    <KeyField className={classNames("PrivateKeyField", className)}
      label="Private Key"
      username={username}
      privateKey={privateKey}/>
    )
}

function contentReducer (state, event) {
  // console.log("contentReducer:", state, event)
  switch (event.type) {
    case "message":
      return {...state, message: event.message}
    case "files":
      return {...state, files: event.files}
    default:
      return state
  }
}

function ImportCard ({active, completed, onComplete, onChange, publicKey, username}) {
  const tooltip = publicKey && ("Your public key is " + publicKey + " and can be freely shared.")
  const [state, dispatch] = useTutorialReducer(contentReducer)
  const {message} = state
  const onMessageChange = useCallback((message) => {
    dispatch({type: "message", message: message})
  }, [dispatch])
  const onFilesChange = useCallback((files) => {
    dispatch({type: "files", files: files})
  }, [dispatch])
  const done = useCallback(() => {
    if (message) {
      const markup = editorMarkup(message)
      console.log("Markup:", markup, "from", message)
      onChange && onChange(markup)
      onComplete()
    }
  }, [message])
  const disabled = (message === undefined || message == "")
  return (
    <Card active={active}>
      <StepHeader completed={completed}>
        Step 1: Encrypt a {features.message ? "Message" : "File"}
      </StepHeader>
      {features.message &&
       <div className="card-body">
         { !completed &&
         <div className={classNames("alert text-center", active ? "alert-primary" : "alert-dark")}>
           Type a message into the editor, then click the button below to encrypt it.
         </div>}
         <Editor active={active} onChange={onMessageChange} content={message}/>
         <div className="d-flex justify-content-center align-items-center w-100 mt-3">
           <a className={[disabled ? "disabled" : null, "btn btn-outline-primary center-text"].join(" ")}
              onClick={done}
              disabled={disabled}>
              Encrypt
           </a>
          </div>
       </div>}
      {features.files &&
       <div className="card-body">
        { !completed &&
          <div className={classNames("alert text-center", active ? "alert-primary" : "alert-dark")}>
            Add a file to be encrypted using&nbsp;
            <mark data-toggle="tooltip" title={tooltip}>your public key:</mark>
          </div>}
        { (!active && completed) &&
          <div className="alert alert-success text-center">
            The file has been encrypted with your
            <mark data-toggle="tooltip" title={tooltip}>your public key.</mark>
            It can only be decrypted using your private key.
          </div>}
        <DropEncrypt disabled={ !active } setResult={onComplete}
                     gotResult={ completed }/>
       </div>}
   </Card>
 )
}

function SaveCard ({active, onComplete, completed, content}) {
  const filename = (content && content.filename)
                    ? encryptedFilename(content.filename)
                    : "message.html.dcrypt"
  return (
    <Card active={active}>
      <StepHeader completed={completed}>
        Step 2: Save as Encrypted File
      </StepHeader>
      <div className="card-body">
        { completed ?
          <div className="alert alert-success text-center mb-4">
               The encrypted file has been saved.
          </div> :
          (active && !completed) ?
          <div className="alert alert-info text-center mb-4">
               The encrypted file is ready to be saved:
          </div> :
          <div className="alert alert-dark text-center mb-4">
            When you have completed the first step, there will be an encrypted file to save.
          </div>}
        <div className="d-flex justify-content-center align-items-center w-100 mt-1">
            <SaveButton content={content} onComplete={ onComplete }
                        filename={filename}>
              Save Encrypted File
            </SaveButton>
        </div>
      </div>
    </Card>
)}

function DecryptStep ({active, completed, onCompleted, username, privateKey}) {
  const [error, onError] = useState()
  useEffect(() => {
    if (completed) {onError(null)}
  },[completed])
  const tooltip = privateKey && ("Your private key is " + privateKey + " but it's supposed to be a secret, so keep it to yourself.")
  return (
    <Card active={active}>
       <StepHeader completed={completed}>
         Step 3: Decrypt the Encrypted File
       </StepHeader>
       <div className="card-body">
       {active &&
        <div className="alert alert-info text-center mb-4">
           Decrypt the saved file using
           <mark data-toggle="tooltip" title={tooltip}>your private key:</mark>
        </div>}
       {(error) ?
        <div className="alert alert-danger text-center mb-4">
          Can't decrypt this file. Is it really the encrypted file you saved in the
          earlier step?
        </div> :
        (!completed && !active) &&
        <div className="alert alert-dark text-center mb-4">
          When you have completed the earlier steps,
          there will be an encrypted file to decrypt.
        </div>
        }
        {completed &&
          <div className="alert alert-success text-center mb-4">
            The encrypted file has been decrypted using&nbsp;
            <mark data-toggle="tooltip" title={tooltip}>your private key.</mark>
          </div>}
         <div className="mt-4"></div>
         <DropDecrypt setResult={onCompleted} gotResult={completed}
                      onError={onError}/>
       </div>
    </Card>
  )
}

function FinalStep ({active, decrypted, completed, onCompleted}) {
  console.log("FinalStep:", active, decrypted, completed)
  return (
    <Card active={active}>
      <StepHeader completed={completed}>
        Step 4: {features.message ? "View Deciphered Message"
                                  : "Save the Restored File"}
      </StepHeader>
      <div className="card-body">
        {(!completed && !active) &&
          <div className="alert alert-dark text-center mb-4">
            When you've completed the earlier steps, you will be able to
            {features.message ? " view the decrypted message from the file."
                              : " save a decrypted file that has the same content as the original."}
          </div>}
        {(active && features.message && decrypted) &&
         <div className="card-body">
           <ViewEditor active={active} decrypted={decrypted}/>
         </div>}
        {(active && !features.message) &&
          <div className="alert alert-info text-center mb-4">
            You can now open the file - it should have the same content as the original.
          </div>}
        {completed &&
        <div className="alert alert-success text-center mb-4">
          <p>The restored file is opened or saved.</p>
        </div>}
        { !completed &&
          ( false ?
            <OpenLink content={decrypted}>Open Decrypted File</OpenLink>
          : !features.message ?
            <SaveButton content={decrypted} onComplete={ onCompleted }
                        filename={decrypted && decrypted.filename && decryptedFilename(decrypted.filename)}>
               Save decrypted file
            </SaveButton>
          : null
          )}
      </div>
    </Card>
)}

function SafeKeeping (props) {
  const {userData, userSession} = useBlockstack()
  const {username} = userData || {}
  const publicKey = usePublicKey()
  const privateKey = usePrivateKey()
  const [{step, content, encrypted, saved, decrypted, done}, dispatch]
        = useTutorialReducer(safekeepingReducer)
  const onContent = (content) => dispatch({type: "content", content: content})
  const onEncrypted = (encrypted) => dispatch({type: "encrypted", encrypted: encrypted})
  useEffect(() => {
    if (content) {
      const options = publicKey ? {publicKey: publicKey} : null
      console.log("Content:", content)
      const cipherObject = userSession.encryptContent(content, options)
      const encrypted = new Blob([cipherObject], { type: "ECIES" })
      console.log("ENCRYPT:", encrypted)
      onEncrypted(encrypted)
    }
  }, [userSession, content, publicKey])
  const onSaved = () => dispatch({type: "saved"})
  const onDecrypted = (decrypted) => dispatch({type: "decrypted", decrypted: decrypted})
  const onDone = () => dispatch({type: "done"})
  const isInitial = (step == null)
  return (
   <div className="mx-auto">
      <InfoBox>
        <div>This tutorial takes you through the steps of safekeeping a
        confidential {features.message ? "message" : "file"} by
        encrypting it using your public key then restore it with your&nbsp;private&nbsp;key.
        </div>
        { <button className={classNames("m-3 btn", isInitial ? "btn-primary" : "btn-outline-primary")}
                disabled={!isInitial && !encrypted}
                onClick={() => dispatch({type:"reset"})}>
           {isInitial ? "Start" : "Restart"}
          </button>}
      </InfoBox>

      <ul className="list-group">
        <li className="list-group-item">
          <div className="alert alert-secondary">
            <PublicKeyField className="" username={username} publicKey={publicKey}/>
          </div>
          <ImportCard active={(step == "import")} completed={!!encrypted}
                      onComplete={onEncrypted}
                      onChange={onContent}
                      username={username} publicKey={publicKey}/></li>
        <li className="list-group-item mt-4">
          <SaveCard active={(step == "save")} completed={!!saved} content={encrypted}
                onComplete={onSaved}/></li>
        <li className="list-group-item mt-4">
          <div className="alert alert-secondary">
            <PrivateKeyField className="" username={username} privateKey={privateKey}/>
          </div>
          <DecryptStep active={(step == "decrypt")} completed={!!decrypted} onCompleted={onDecrypted}
                       username={username} privateKey={privateKey}/></li>
        <li className="list-group-item mt-4">
          <FinalStep active={(step == "export")} decrypted={decrypted} completed={!!done}
                     onCompleted={onDone}/></li>
      </ul>

      {done &&
      <div className="alert alert-success text-center mt-4">
        <p>Congratulations! You have completed the tutorial.</p>
        <button className="btn btn-primary btn-large"
                onClick={() => dispatch({type:"reset"})}>
           Restart
        </button>
      </div>}
    </div>
  )
}

export default function Tutorial () {
  return (
   <div className="jumbotron">
     <div className="container">
        <SafeKeeping />
     </div>
   </div>
  )}
