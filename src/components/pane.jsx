import React, { useEffect, useReducer } from 'react'
import $ from 'jquery'

export function clickPane (id) {
  const tab = document.getElementById("" + id + "-tab")
  if (tab) {
    tab.click()
  } else {
    console.warn("Unknown reference to a pane:", id)
  }
}

function goPane (id) {
  return (props) => {
    console.log("Go pane:", id, props)
    useEffect( () => clickPane(id))
    return (null)
  }
}

export function initPanes () {
  // going beyond bootstraps events to control panes
  const handleTabShown = (e) => {
      //e.target // newly activated tab
      //e.relatedTarget // previous active tab
      const id = e.target.getAttribute("aria-controls")
      console.log("Routing pane", id, e.target.tab, e.target, e.relatedTarget)
      window.history.replaceState({}, document.title, "/" + id)
  }
  $('a[data-toggle="tab"]').on('show.bs.tab', handleTabShown)
  console.log("route panes:", $('a[data-toggle="tab"]'))
}

export function usePane (pane) {
  initPanes()
  useEffect( () => {
    if (pane) {
      clickPane(pane)
    }}, [pane])
}
