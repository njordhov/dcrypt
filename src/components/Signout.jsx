import React, { Component } from 'react';

export default class Signout extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { handleSignOut } = this.props;

    return (
          <button
            className="btn btn-primary btn-lg"
            id="signin-button"
            onClick={ handleSignIn.bind(this) }
          >
            Sign In with Blockstack
          </button>
        </p>
      </div>
    );
  }
}
