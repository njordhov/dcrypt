import React, { Component,  useCallback} from 'react';
import Dropzone from './Dropzone.jsx'

export default class Decrypt extends Component {
  constructor(props) {
    super(props);
    this.state = {
        files: []
      }
  }

  onChange (files) {
      console.log("Current files:", files)
      this.setState({
        files: files
      })
    }

  render() {
    const { handleSignIn } = this.props;

    return (
      <div className="jumbotron">
        <p className="lead">
          Decrypt!
        </p>
        <Dropzone className="Dropzone" onChange = {this.onChange.bind(this)}>
        {this.state.files.length > 0
         ? <i className="fas fa-unlock-alt m-auto"></i>
         : null}
         </Dropzone>
         {this.state.files.length > 0
           ? <div className="alert alert-info text-center mt-4">Your file has been decrypted</div>
           : null}
      </div>
    );
  }
}
