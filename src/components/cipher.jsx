import React, { useState, useEffect, useCallback } from 'react'
import { useBlockstack } from 'react-blockstack'
import { get } from 'lodash'
import { ECPair /*, address as baddress, crypto as bcrypto*/ } from 'bitcoinjs-lib'

export function trimId (id) {
  return (id.replace(/.id.blockstack/, ""))
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
    }, [userData, ...args])
    return (value)
  })
}

const getPrivateKey = (userData) => userData && userData.appPrivateKey

export const usePrivateKey = createUserDataEffect( getPrivateKey )

const getPublicKey = ( userData ) => {
  // just take from profile?
  const privateKey = getPrivateKey(userData)
  const publicKey = privateKey && getPublicKeyFromPrivate(privateKey)
  return (publicKey)
}

export const usePublicKey = createUserDataEffect( getPublicKey )

const unsafePublicKeyFilename = "public" // bw compatibility
const publicKeyFilename = "public.key"

export function publishPublicKey (userSession, publicKey) {
  userSession.putFile(publicKeyFilename, JSON.stringify({key: publicKey}), {encrypt: false, sign:true})
  userSession.deleteFile(unsafePublicKeyFilename)
  .then (() => null)
  .catch((err) => {
    switch(err.name) {
      case "FileNotFound": break;
      default: console.warn("Failed deleting legacy public key:", err)
    }})
}

export function usePublishKey(publicKey) {
  const { userSession } = useBlockstack()
  useEffect( () => {publicKey && publishPublicKey(userSession, publicKey)}, [publicKey])
}

export function useRemotePublicKey (username) {
  // fetches the public key of another user
  //value is undefined if not yet determined, usually a string, but null if not existing
  const { userSession } = useBlockstack()
  const [value, setValue] = useState()
  useEffect( () => {
    if (username) {
      userSession.getFile(publicKeyFilename, {username: username, decrypt: false, verify:true})
      .then((content) => (console.debug("Remote key:", content), content))
      .then((content) => {
        if (content) {
          setValue(content && get(JSON.parse (content), "key"))
        } else { // fallback for unsigned public key in original release, can be removed
          userSession.getFile(unsafePublicKeyFilename, {username: username, decrypt: false})
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
  }, [username])
  return (value)
}

function encryptionUrl (username) {
  const name = trimId(username)
  return (window.location.origin + "/encrypt/for/" + encodeURIComponent(name))
}

export function useEncryptionUrl () {
    const { userData } = useBlockstack()
    const { username } = userData || {}
    return (username && encryptionUrl(username) )
}
