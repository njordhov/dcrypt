import React, { useState } from 'react';
import { useBlockstack } from 'react-blockstack'

export default function Enter (props) {
    return (
      <div>
        <a className="btn btn-primary" role="button"
           href="/encrypt">
           Next: Encrypt a File</a>
      </div>
    )
  }
