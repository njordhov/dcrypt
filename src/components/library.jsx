import React from 'react'

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
