import React, { Component,  useCallback} from 'react'
import FileSaver from 'file-saver'
import Dropzone from './Dropzone.jsx'
import {userSession} from './Global.js'

export default class Encrypt extends Component {
  constructor(props) {
    super(props);
    const params = new URLSearchParams(window.location.search);
    const publicKey = params.get('public-key')
    console.log("Public Key:", publicKey)
    this.state = {
        files: [],
        publicKey: publicKey
      }
  }

  onChange (files) {
    console.log("Current files:", files)
    this.setState({
      files: files
    })
  }

  saveEncrypted (files, publicKey) {
    console.log("Save encrypted:", files, publicKey)
    //var file = new File(["Hello, world!"], "hello world.txt", {type: "text/plain;charset=utf-8"})
    //FileSaver.saveAs(file)
    // ## FIX: handle multiple files
    // ## TODO: Notify blockstack that encryptContent should take a file (it's a blob)
    const reader = new FileReader()
    const file = files[0]
    reader.onload = e => {
      const content = e.target.result
      const encrypted = userSession.encryptContent(content, publicKey)
      FileSaver.saveAs(JSON.stringify(encrypted))
    }
    reader.readAsArrayBuffer(file)
  }

  render() {
    const { handleSignIn } = this.props;

    return (
      <div className="jumbotron">
        <p className="lead">
          Encrypt! {this.state.publicKey}
        </p>
        <Dropzone className="Dropzone" onChange = {this.onChange.bind(this)}/>
        <button className="btn btn-success btn-block"
                onClick={ () => this.saveEncrypted(this.state.files, this.state.publicKey)}>
                Save Encrypted
        </button>
      </div>
    );
  }
}
