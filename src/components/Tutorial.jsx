import React, { useState, useCallback, useReducer } from 'react'
import {DropEncrypt} from './Encrypt.jsx'
import {DropDecrypt} from './Decrypt.jsx'
import Dropzone, { SaveButton, OpenLink } from './Dropzone.jsx'
import {usePublicKey} from './cipher.jsx'

const classNames = (...list) => list.join(" ")

function Card (props) {
  return (
  <div className={classNames("card bg-secondary", props.active && "border-primary", props.className)}
       {...props}>
    {props.children}
  </div>
  )
}

function safekeepingReducer (state, event) {
  console.log("Reduce:", state, event)
  switch (event.type) {
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


function ImportCard ({active, completed, onComplete}) {
  return (
    <Card active={active}>
      <h5 className="card-header">Step 1: Encrypt a File</h5>
      <div className="card-body">
        { active &&
          <div className="alert alert-primary text-center mt-4">
            Add a file to be encrypted:
          </div>}
        { !active &&
          <div className="alert alert-success text-center mt-4">
            The file has been encrypted using your <strong>Public Key</strong>.
          </div>}
        <DropEncrypt disabled={ !active } setResult={onComplete}
                     gotResult={ completed }/>
      </div>
   </Card>
 )
}

function SaveCard ({active, onComplete, completed, content}) {
  return (
    <Card active={active}>
      <h5 className="card-header">Step 2: Save the Encrypted File</h5>
      <div className="card-body">
        { completed ?
          <div className="alert alert-success text-center mt-4">
               The encrypted file has been saved.
          </div> :
          (active && !completed) ?
          <div className="alert alert-info text-center mt-4">
               The encrypted file is ready to be saved:
          </div> :
          <div className="alert alert-warning text-center mt-4">
            When you have completed the first step, there will be an encrypted file to save.
          </div>}
        <div className="d-flex justify-content-center align-items-center w-100 mt-3">
            <SaveButton content={content} onComplete={ onComplete }>
              Save Encrypted File
            </SaveButton>
        </div>
      </div>
    </Card>
)}

function DecryptStep ({active, completed, onCompleted}) {
  return (
    <Card active={active}>
       <h5 className="card-header">Step 3: Decrypt the Encrypted File</h5>
       <div className="card-body">
        {(!completed && !active) &&
        <div className="alert alert-warning text-center mt-4">
          When you have completed the earlier steps,
          there will be an encrypted file to decrypt.
        </div>
        }
        {active &&
         <div className="alert alert-info text-center mt-4">
            Decrypt the saved file to get back the original:
         </div>}
         <DropDecrypt setResult={onCompleted}/>
       </div>
    </Card>
  )
}

function FinalStep ({active, decrypted, completed, onCompleted}) {
  return (
    <Card active={active}>
      <h5 className="card-header">Step 4: Save the Restored File</h5>
      <div className="card-body">
        {(!completed && !active) &&
          <div className="alert alert-warning text-center mt-4">
            When you've completed the earlier steps, you will be able to save a
            decrypted file that should have the same content as the original.
          </div>}
        {active &&
          <div className="alert alert-info text-center mt-4">
            The encrypted file was decrypted using your <strong>Private Key</strong>.
            You can now open the file - it should have the same content as the original.
          </div>}
        { !completed &&
          ( false ?
            <OpenLink content={decrypted}>Open Decrypted File</OpenLink>
          : <SaveButton content={decrypted} onComplete={ onCompleted }/> )}
      </div>
    </Card>
)}

function SafeKeeping (props) {
  const publicKey = usePublicKey()
  const [{step, encrypted, saved, decrypted, done}, dispatch]
        = useReducer(safekeepingReducer, {step: "import"})
  const onEncrypted = (encrypted) => dispatch({type: "encrypted", encrypted: encrypted})
  const onSaved = () => dispatch({type: "saved"})
  const onDecrypted = (decrypted) => dispatch({type: "decrypted", decrypted: decrypted})
  const onDone = () => dispatch({type: "done"})
  return (
   <div className="mx-auto"
        style={{width: "60em"}}>
      <div className="alert alert-dark text-center mt-4">
        This tutorial takes you through the steps of safekeeping a confidential file
        by encrypting it using your public key.
      </div>

      <ul className="list-group">
        <li className="list-group-item">
          <ImportCard active={(step == "import")} completed={!!encrypted} onComplete={onEncrypted}/></li>
        <li className="list-group-item">
          <SaveCard active={(step == "save")} completed={!!saved} content={encrypted}
                onComplete={onSaved}/></li>
        <li className="list-group-item">
          <DecryptStep active={(step == "decrypt")} completed={!!decrypted} onCompleted={onDecrypted} /></li>
        <li className="list-group-item">
          <FinalStep active={(step == "export")} decrypted={decrypted} completed={!!done} onCompleted={onDone} /></li>
      </ul>
      {done &&
      <div className="alert alert-success text-center mt-4">
        <p>Congratulations! You have completed the tutorial.</p>
        <button className="btn btn-primary btn-large"
                onClick={() => dispatch({type:"reset"})}>
           Restart
        </button>
      </div>
      }
    </div>
  )
}

export default function Tutorial () {
  return (
   <div className="jumbotron mb-0"
        style={{minHeight: "100vh"}}>
      <SafeKeeping />
   </div>
  )}
