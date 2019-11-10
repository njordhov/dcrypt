import React, { useEffect, useReducer } from 'react'
import { BrowserRouter as Router, Route, Link, Redirect, Switch, useParams } from 'react-router-dom'
import { useBlockstack, AuthenticatedDocumentClass, setContext } from 'react-blockstack'
import Enter from './Enter.jsx'
import About from './About.jsx'
import Signin from './Signin.jsx'
import { ensureEndsWith } from './library'
import $ from 'jquery'

function clickPane (id) {
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

function initPanes () {
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

function appReducer (state, event) {
  switch (event.type) {
    case "encrypt":
      const userId = ensureEndsWith(event.userId, ".id.blockstack")
      return ({...state, pane: "encrypt", userId: userId})
    case "goPane":
      return (event.pane == state.pane ? state : {...state, pane: event.pane})
    default:
      return (state)
  }
}

export default function App () {
  const { userData } = useBlockstack()
  const [state, dispatch] = useReducer(appReducer, {})
  const goPane = (id) => (props) => {
    dispatch({type: "goPane", pane: id})
    return (null)
  }
  const EncryptFor = (props) => {
    const {userId} = useParams()
    console.debug("Encrypt For:", userId )
    useEffect( () => dispatch({type: "encrypt", userId: userId}))
    return null
  }
  const {pane, userId} = state
  useEffect( () => {
    if (pane) {
      clickPane(pane)
    }}, [pane])
  useEffect( () => {
    if (userId) {
      setContext({targetId: userId})
    }}, [userId])
  initPanes()
  return (
      <>
         <AuthenticatedDocumentClass name="authenticated" />
         <div></div>
         <Router>
                <Switch>
                  <Route key="home" path="/home" exact={true} component={goPane('home')} />
                  <Route key="about" path="/about" exact={true} component={goPane('about') } />
                  {userData && <Route key="encrypt" path="/encrypt" exact={true} component={goPane('encrypt') } />}
                  {true && <Route key="custom" path="/encrypt/for/:userId" exact={true}
                                  component={ EncryptFor } />}
                  {userData && <Route key="decrypt" path="/decrypt" exact={true} component={goPane('decrypt') } />}
                  {userData ? <Redirect to="/about"/> : <Redirect to="/home"/>}
                </Switch>
              </Router>
      </>
    )
}
