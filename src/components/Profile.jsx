import React, { Component } from 'react';
import {
  Person,
} from 'blockstack';
import { ECPair, address as baddress, crypto as bcrypto } from 'bitcoinjs-lib'

const avatarFallbackImage = 'https://s3.amazonaws.com/onename/avatar-placeholder.png';

function getPublicKeyFromPrivate(privateKey: string) {
  // from blockstack.js internal key module
  const keyPair = ECPair.fromPrivateKey(Buffer.from(privateKey, 'hex'))
  return keyPair.publicKey.toString('hex')
}

export default class Profile extends Component {
  constructor(props) {
  	super(props);

  	this.state = {
      hiddenKey: true,
  	  person: {
  	  	name() {
          return 'Anonymous';
        },
  	  	avatarUrl() {
  	  	  return avatarFallbackImage;
  	  	},
  	  },
  	};
  }

  copyLink () {
    console.log("Copy encrypt link to clipboard")
  }

  toggleKey () {
    this.setState({
      hiddenKey: !this.state.hiddenKey
    })
  }

  renderLink (publicKey) {
   // note: hash should be after query string
   const url = window.location.origin + "?public-key=" + publicKey + "#encrypt"
   return (
     <div className="public-key-link">
        <button onClick={this.copyLink.bind(this)}>copy</button>
        <a href={url}>{url}</a>
     </div>)
  }

  renderCore () {
    const { handleSignOut, userSession } = this.props;
    const { person, hiddenKey } = this.state;
    const privateKey = userSession.loadUserData().appPrivateKey
    const publicKey = getPublicKeyFromPrivate(privateKey)

    return (
      <div>
        <p className="lead">
          We've made public-key cryptography so easy you don't actually need to know
          the public key. Click on the field below if you still want to check
          it out:
        </p>
        <p>Public key:
        <input value={publicKey} style={{width: "30em"}} readOnly={true}
               type={hiddenKey? "password" : "text"}
               onClick={ this.toggleKey.bind(this) }/></p>
        {!hiddenKey ?
          <p>Cryptic, you may say. Definitely not something you'd like to try to remember.</p>
          : null}

        <div hidden={true}>
          <p>Instead, just share the link below with people so they easily can use your
          public key to encrypt files before sending them to you.</p>

          <p>Well, this is not much better, but it's only for now
            until I figure out how to shorten it:</p>
            {this.renderLink(publicKey)}
        </div>
        <button class="btn btn-primary" role="button"
           onClick={() => $('#encrypt-tab').click()}>Next: Encrypt a File</button>
      </div>
    );
  }

  render () {
      const { userSession } = this.props;
      if (!userSession.isSignInPending()) {
        return(this.renderCore())
      }
  }


  componentWillMount() {
    const { userSession } = this.props;
    this.setState({
      person: new Person(userSession.loadUserData().profile),
    });
  }
}
