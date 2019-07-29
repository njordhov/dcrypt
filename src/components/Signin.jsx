import React, { Component } from 'react';

export default class Signin extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { handleSignIn } = this.props;

    return (
      <div className="">
        <p className="lead">
          Sign in to get access to the tools and your own public key that can be used to
          send you encrypted files:
        </p>
        <button
            className="btn btn-primary btn-lg"
            id="signin-button"
            onClick={ handleSignIn.bind(this) }
          >
            Sign In with Blockstack
          </button>
      </div>
    );
  }
}
