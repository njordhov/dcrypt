import React, {useEffect} from 'react'
import { BrowserRouter as Router, Route, Link, Redirect, Switch } from 'react-router-dom'
import { useBlockstack, AuthenticatedDocumentClass } from 'react-blockstack'
import Enter from './Enter.jsx'
import About from './About.jsx'
import Signin from './Signin.jsx'
import $ from 'jquery'

function Exit (props) {

}

function Empty (props) {
  return (<span></span>)
}


function goPane (id) {
  return () => {
    console.log("Go pane:", id)
    useEffect( () => {
      const tab = document.getElementById("" + id + "-tab")
      if (tab) {
        tab.click()
      } else {
        console.warn("Unknown reference to a pane:", id)
      }
    })
    return (<Empty/>)
  }
}

function initPanes () {
  // going beyond bootstraps events to control panes
  const handleTabShown = (e) => {
      //e.target // newly activated tab
      //e.relatedTarget // previous active tab
      const id = e.target.getAttribute("aria-controls")
      console.log("Routing pane", id, e.target.tab, e.target, e.relatedTarget)
      window.history.replaceState({}, document.title, id)
  }
  $('a[data-toggle="tab"]').on('show.bs.tab', handleTabShown)
  console.log("route panes:", $('a[data-toggle="tab"]'))
}

export default function App () {
  const { userData } = useBlockstack()
  initPanes()
  return (
      <>
         <AuthenticatedDocumentClass name="authenticated" />
         <Router>
                <Switch>
                  <Route key="home" path="/home" component={goPane('home')} />
                  <Route key="about" path="/about" component={goPane('about') } />
                  <Route key="encrypt" path="/encrypt" component={goPane('encrypt') } />
                  <Route key="decrypt" path="/decrypt" component={goPane('decrypt') } />
                  { userData ? <Redirect to="/about"/> : null }
                </Switch>
              </Router>
      </>
    )
}
