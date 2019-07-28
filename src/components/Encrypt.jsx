import React, { Component,  useCallback} from 'react';
import Dropzone from './Dropzone.jsx'

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
        <Dropzone className="Dropzone"/>
      </div>
    );
  }
}
