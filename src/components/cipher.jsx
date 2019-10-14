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

const publicKeyFilename = "public"

export function publishPublicKey (userSession, publicKey) {
  userSession.putFile(publicKeyFilename, JSON.stringify({key: publicKey}), {encrypt: false})
}

export function usePublishKey(publicKey) {
  const { userSession } = useBlockstack()
  useEffect( () => {publicKey && publishPublicKey(userSession, publicKey)}, [publicKey])
}

export function useRemotePublicKey (username) {
  // fetches the public key of another user
  const { userSession } = useBlockstack()
  const [value, setValue] = useState()
  useEffect( () => {
    if (username) {
      userSession.getFile(publicKeyFilename, {username: username, decrypt: false})
      .then((content) => (console.debug("Remote key:", content), content))
      .then((content) => setValue(get(JSON.parse (content), "key")))
      .catch((err) => console.warn("Failed to get remote public key:", err))
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
