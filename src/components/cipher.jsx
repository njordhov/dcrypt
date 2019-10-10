import React, { useState, useEffect, useCallback } from 'react'
import { useBlockstack } from 'react-blockstack'
import { ECPair /*, address as baddress, crypto as bcrypto*/ } from 'bitcoinjs-lib'

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
