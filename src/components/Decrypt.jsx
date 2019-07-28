import React, { Component,  useCallback} from 'react';
import Dropzone from './Dropzone.jsx'

export default class Decrypt extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { handleSignIn } = this.props;

    return (
      <div className="jumbotron">
        <p className="lead">
          Decrypt!
        </p>
        <Dropzone className="Dropzone"/>
      </div>
    );
  }
}
