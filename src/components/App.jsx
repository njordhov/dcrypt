import React from 'react'
import { BrowserRouter as Router, Route, Link, Redirect, Switch } from 'react-router-dom'
import { useBlockstack, AuthenticatedDocumentClass } from 'react-blockstack'
import Enter from './Enter.jsx'
import Signin from './Signin.jsx'

function Exit (props) {

}

function goEncrypt () {
  document.getElementById('encrypt-tab').click();
  return (null)
}

export default function App () {
  const { userData } = useBlockstack()
  if (!userData) {
    return null
  } else {
    return (
      <>
         <AuthenticatedDocumentClass name="authenticated" />
         <Router>
                <Switch>
                  <Route key="enter" path="/enter" component={Enter} />
                  <Route key="encrypt" path="/encrypt"
                         render={ goEncrypt() } />
                  <Redirect to="/enter"/>
                </Switch>
              </Router>
      </>
    )
  }
}
