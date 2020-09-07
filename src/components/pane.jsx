import { useEffect, useState } from 'react'
import $ from 'jquery'
import { useHistory } from 'react-router-dom'

function clickPane (id) {
  const tab = document.getElementById("" + id + "-tab")
  if (tab) {
    tab.click()
  } else {
    console.warn("Unknown reference to a pane:", id)
  }
}

function initPanes (setPane, history) {
  // going beyond bootstraps events to control panes
  const handleTabShown = (e) => {
      //e.target // newly activated tab
      //e.relatedTarget // previous active tab
      const id = e.target.getAttribute("aria-controls")
      console.log("Routing pane", id, e.target.tab, e.target, e.relatedTarget)
      // window.history.replaceState({}, document.title, "/" + id)
      history.push("/" + id)
      setPane(id)
  }
  $('a[data-toggle="tab"]').on('show.bs.tab', handleTabShown)
  console.log("route panes:", $('a[data-toggle="tab"]'))
}

export function usePane (init) {
  const [pane, setPane] = useState(init || null)
  const history = useHistory()
  useEffect(() => {
    if (history) {
      initPanes(setPane, history)
    }
  },[history])
  useEffect( () => {
    if (pane) {
      clickPane(pane)
    }
  }, [pane])
  return [pane, setPane]
}
