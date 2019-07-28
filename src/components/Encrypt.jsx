import React, { Component } from 'react';

export default class Encrypt extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { handleSignIn } = this.props;

    return (
      <div className="jumbotron">
        <p className="lead">
          Encrypt!
        </p>
      </div>
    );
  }
}
