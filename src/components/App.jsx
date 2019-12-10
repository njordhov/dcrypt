import React, { useEffect, useReducer } from 'react'
import { BrowserRouter as Router, Route, Link, Redirect, Switch, useParams } from 'react-router-dom'
import { useBlockstack, AuthenticatedDocumentClass, setContext } from 'react-blockstack'
import Enter from './Enter'
import About from './About'
import Signin from './Signin'
import { untrimId } from './cipher'
import {usePane} from './pane'

function appReducer (state, event) {
  switch (event.type) {
    case "encrypt":
      const userId = untrimId(event.userId)
      return ({...state, userId: userId})
    // case "goPane":
    //  return (event.pane == state.pane ? state : {...state, pane: event.pane})
    default:
      return (state)
  }
}

export default function App () {
  const { userData } = useBlockstack()
  const [state, dispatch] = useReducer(appReducer, {})
  const [pane, setPane] = usePane()
  const goPane = (id) => (props) => {
    // dispatch({type: "goPane", pane: id})
    console.log("GoPane:", id)
    setPane(id)
    return (null)
  }
  const EncryptFor = (props) => {
    const {userId} = useParams()
    console.debug("Encrypt For:", userId )
    useEffect( () => {
      setPane("encrypt")
      dispatch({type: "encrypt", userId: userId})
    })
    return null
  }
  const {userId} = state
  useEffect( () => {
    if (userId) {
      setContext({targetId: userId})
    }}, [userId])
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
              {userData ? <Redirect to="/about"/>
                        : <Redirect to="/home"/>}
            </Switch>
          </Router>
      </>
    )
}
