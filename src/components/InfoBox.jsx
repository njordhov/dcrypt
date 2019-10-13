import React from 'react'

import css from './InfoBox.css'

export function InfoToggle ({toggle, target}) {
  return(
    <i className="btn fas fa-info-circle text-info InfoToggle"
       style={{fontSize: "1.3rem"}}
       data-toggle={toggle || "collapse"} data-target={target}>
    </i>)
}

export default function InfoBox ({id, className, children, hide, dismissible}) {
  console.debug("InfoBox:", id, hide)
  return(
    <div id={id} className={["alert alert-info text-center", "InfoBox", dismissible && "alert-dismissible", "collapse", (hide ? "hide" : "show"), className].join(" ")}>
        {children}
        {dismissible &&
        <button type="button" className="close" data-dismiss="alert" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>}
    </div>
  )
}
