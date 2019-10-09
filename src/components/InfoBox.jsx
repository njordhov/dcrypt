import React from 'react'

import css from './InfoBox.css'

export function InfoToggle ({target}) {
  return(
    <i className="btn fas fa-info-circle text-info InfoToggle"
       style={{fontSize: "1.3rem"}}
       data-toggle="collapse" data-target={target}>
    </i>)
}

export default function InfoBox ({id, children, show}) {
  return(
    <div id={id} className={"InfoBox collapse" + (!show && " hide")}>
      <div className="alert alert-info text-center">
        {children}
      </div>
    </div>
  )
}
