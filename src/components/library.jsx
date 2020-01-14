import React, {useState, useEffect} from 'react'
import { useBlockstack } from 'react-blockstack'

export function trimEnding (s, ending) {
  if (s.endsWith(ending)) {
    return (s.substring(0, s.length - ending.length))
  } else {
    return (s)
  }
}

export function ensureEndsWith (s, ending) {
  // after: string ends with ending if it didn't already
  return (
    s.endsWith(ending) ? s : s + ending
  )
}

export const classNames = (...list) => list.join(" ")

// soon to be in react-blockstack...
export function usePerson() {
  // Also see useProfile in react-blockstack
  // TODO: memoize avatar url so it is only fetched once
  const { userData, person } = useBlockstack()
  const { username } = userData || {}
  const [avatarUrl, setAvatar] = useState(null)
  useEffect(() => {
    const avatarUrl = (person && person.avatarUrl && person.avatarUrl())
    // const icon = avatarUrl && proxyUrl(avatarUrl)
    fetch(avatarUrl, {method: "GET", mode: 'cors'})
      .then((response) => {
        response.blob()
        .then((blob) => URL.createObjectURL(blob))
        .then((url) => setAvatar(url))
      })
      .catch((err) => console.warn("Avatar Failed fetching url:", err))
  }, [person])
  // need better replace here!
  const username2 = username && username.replace(/.id.blockstack$/, "")

  return { avatarUrl , username: username2 }
}
