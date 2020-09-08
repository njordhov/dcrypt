import React, { useEffect, useReducer } from 'react'
import { BrowserRouter as Router, Route, Link, Redirect, Switch, useParams } from 'react-router-dom'
import { useBlockstack, AuthenticatedDocumentClass, setContext, useConnectOptions } from 'react-blockstack'
// import { Connect } from '@blockstack/connect-react'
import KeyField from './KeyField'
import InfoBox, {InfoToggle} from './InfoBox'
import { untrimId, usePublicKey, usePrivateKey } from './cipher'
import {usePane} from './pane'
import config from './config'

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

function KeyPair (props) {
  const {userData} = useBlockstack()
  const {username} = userData || {}
  const publicKey = usePublicKey()
  const privateKey = usePrivateKey()
  return (
    <div className="KeyPair alert alert-light text-dark text-center m-auto pt-4 mb-0">
      <div className="text-center">
        <div className="lead mb-4 d-none">
          Your public key:
          <InfoToggle target="#KeyPairExplainDialog"/>
          <InfoBox id="KeyPairExplainDialog" className="mb-5" dismissible={true} hide={true}>
            Your public key is used to encrypt confidential messages that only you can decrypt.
            It can be freely shared&nbsp;with&nbsp;others.
          </InfoBox>
        </div>
        <div>
          <KeyField className="PublicKeyField"
             label="Public Key"
             isOwner={true}
             username={username}
             publicKey={publicKey}/>
          {false &&
          <KeyField className="PrivateKeyField"
            label="Private Key"
            username={username}
            privateKey={privateKey}/>
          }
        </div>
        <Link to="/about">
          <button className="btn btn-primary btn-lg mt-4 mb-2">
            <i className="far fa-question-circle mr-2"></i>
            About Cryptography
          </button>
        </Link>
      </div>
    </div>
  )
}

function useEncryptFor ({setId}) {
  const [_pane, setPane] = usePane()
  const EncryptFor = (props) => {
    const {userId} = useParams()
    console.debug("Encrypt For:", userId )
    useEffect( () => {
      setPane("encrypt")
      setId(userId)
    })
    return null
  }
  return EncryptFor
}

function Routes () {
  const { userData, authenticated } = useBlockstack()
  const [state, dispatch] = useReducer(appReducer, {})
  const [_pane, setPane] = usePane()
  const goPane = (id) => (props) => {
    // dispatch({type: "goPane", pane: id})
    if (setPane) {
      setPane(id)
    }
    return (null)
  }
  const EncryptFor = useEncryptFor({setId: (userId) => dispatch({type: "encrypt", userId})})
  const {userId} = state
  useEffect( () => {
    if (userId) {
      setContext({targetId: userId})
    }}, [userId])
  return (
      <Switch>
        <Route key="home" path="/home" exact={true} component={goPane('home')} />
        <Route key="about" path="/about" exact={true} component={goPane('about') } />
        {authenticated && <Route key="tutorial" path="/tutorial" exact={true} component={goPane('tutorial') } />}
        {true && <Route key="encrypt" path="/encrypt" exact={true} component={goPane('encrypt') } />}
        {true && <Route key="custom" path="/encrypt/for/:userId" exact={true}
                        component={ EncryptFor } />}
        {authenticated && <Route key="decrypt" path="/decrypt" exact={true} component={goPane('decrypt') } />}
        {authenticated && <Route key="share" path="/share" exact={true} component={goPane('share') } />}
        {(false && userData) ? <Redirect to="/about"/> : <Redirect to="/home"/>}
        <Redirect to="/home"/>
      </Switch>
    )
}

function AppCore () {
  return (
    <>
      <AuthenticatedDocumentClass name="authenticated" />
      <Router>
        <KeyPair/>
        <Routes/>
      </Router>
    </>
  )
}

/*
function ConnectApp () {
  const authOptionDefaults = {appDetails: { name: config.title, icon: config.icon}}
  const authOptions = useConnectOptions(authOptionDefaults)
  return (
    <Connect authOptions={authOptions}>
      <AppCore/>
    </Connect>
  )
}*/

export default function App () {
  return <AppCore/>
}
