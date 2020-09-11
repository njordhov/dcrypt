import { useState, useEffect } from 'react'
import { useBlockstack } from 'react-blockstack'
import { get, isNil, isEmpty } from 'lodash'
import { ECPair /*, address as baddress, crypto as bcrypto*/ } from 'bitcoinjs-lib'
import { trimEnding, ensureEndsWith } from './library'

// /encrypt/for/x1234567.id.blockstack

const defaultIdEnding = ".id.blockstack" // can abbreviate ids with this ending

export function trimId (id) {
  // Only case is when id ends with the default and the result is single name (no periods)
  const short = trimEnding(id, defaultIdEnding)
  return (short.includes(".") ? id : short)
}

export function untrimId (id) {
  return (id.includes(".") ? id : ensureEndsWith(id, defaultIdEnding))
}

function getPublicKeyFromPrivate(privateKey: string) {
  // from blockstack.js internal key module
  const keyPair = ECPair.fromPrivateKey(Buffer.from(privateKey, 'hex'))
  return keyPair.publicKey.toString('hex')
}

function createUserDataEffect(f, ...args) {
  return ( () => {
    const [value, setValue] = useState()
    const { userData } = useBlockstack()
    useEffect( () => {
      const result = f(userData, ...args)
      setValue(result)
    }, [userData])
    return (value)
  })
}

const getPrivateKey = (userData) => userData && userData.appPrivateKey

export const usePrivateKey = createUserDataEffect(getPrivateKey)

const getPublicKey = ( userData ) => {
  // just take from profile?
  const privateKey = getPrivateKey(userData)
  const publicKey = privateKey && getPublicKeyFromPrivate(privateKey)
  return (publicKey)
}

export const usePublicKey = createUserDataEffect(getPublicKey)

const legacyPublicKeyFilename = "public" // bw compatibility
const publicKeyFilename = "public.key"

function deleteLegacyPublicKey (userSession) {
  userSession.deleteFile(legacyPublicKeyFilename)
  .then (() => null)
  .catch((err) => {
    switch(err.name) {
      case "FileNotFound": break;
      case "DoesNotExist": break;
      default: console.warn("Failed deleting legacy public key:", err)
    }})  
}

function publishPublicKey (userSession, publicKey) {
  console.info("Publish public key as:", publicKeyFilename) 
  const putOptions = {encrypt: false, sign: true, dangerouslyIgnoreEtag: true}
  userSession.putFile(publicKeyFilename, JSON.stringify({key: publicKey}), putOptions)
  .catch((err) => {
    console.warn("Failed publishing public key:", err)
  })
}

export function usePublishKey(publicKey) {
  const { userSession } = useBlockstack()
  useEffect( () => {
    userSession && deleteLegacyPublicKey(userSession)
  }, [userSession])
  useEffect( () => {
    userSession && publicKey && publishPublicKey(userSession, publicKey)
  }, [userSession, publicKey])
}

export function useRemotePublicKey (username) {
  // fetches the public key of another user
  // value is undefined if not yet determined, usually a string, but null if not existing
  // Important: user may not be logged in so don't depend on userSession
  const { userSession } = useBlockstack()
  const [value, setValue] = useState()
  useEffect( () => {
    if (username) {
      userSession.getFile(publicKeyFilename, {username: username, decrypt: false, verify:true})
      .then((content) => {
        if (content) {
          setValue(content && get(JSON.parse (content), "key"))
        } else { // fallback for unsigned public key in original release, can be removed
          userSession.getFile(legacyPublicKeyFilename, {username: username, decrypt: false})
          .then((content) => setValue(content && get(JSON.parse (content), "key")))
          .catch((err) => console.warn("Failed to get unsigned public key:", err))
        }})
      .catch((err) => {
        console.warn("Failed to get remote public key:", err)
        // FIX: verify file was not found before setting value to null
        setValue(null)
      })
    } else {
      setValue(null)
    }
  }, [username, userSession])
  return (value)
}

function encryptionUrl (username) {
  const name = trimId(username)
  return (window.location.origin + "/encrypt/for/" + encodeURIComponent(name))
}

export function useEncryptionUrl () {
    const { userData } = useBlockstack()
    const { username } = userData || {}
    if ( !isNil(userData) && isEmpty(username) ) {
      console.warn("Cannot generate encryption-url without a username")
    }
    return (!isEmpty(username) ? encryptionUrl(username) : null)
}

export function encryptHandler(file, encryptContent, setResult) {
  if (file) {
    var myReader = new FileReader()
    myReader.readAsArrayBuffer(file)
    myReader.addEventListener("loadend", (e) => {
      var buffer = e.srcElement.result;  //arraybuffer object
      const cipherObject = encryptContent(buffer)
      if (cipherObject) {
        const content = new Blob([cipherObject], { type: "ECIES" })  //  https://fileinfo.com/filetypes/encoded
        content.filename = file.name
        setResult(content)}
  })}}
