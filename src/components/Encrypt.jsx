import React, { Component,  useCallback} from 'react';
import {useDropzone} from 'react-dropzone'

function Dropzone() {
  // https://react-dropzone.js.org/
  const onDrop = useCallback(acceptedFiles => {
    console.log("Dropped:", acceptedFiles);
    // Do something with the files
  }, [])
  const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop})

  return (
    <div {...getRootProps()}>
      <input {...getInputProps()} />
      {
        isDragActive ?
          <p>Drop the files here to encrypt</p> :
          <p>Drag 'n' drop some files here, or click to select files</p>
      }
    </div>
  )
}

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
        <Dropzone />
      </div>
    );
  }
}
