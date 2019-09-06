import React from 'react'


export default function About () {
  return (
  <div class="h-80 jumbotron mb-0 row align-items-center justify-content-center"
       style={{minHeight: "100vh"}}>
    <p className="col col-12 col-sm-6 col-md-5
                  alert alert-info">
      Public key cryptography is an essential technology to
      communicate secrets online, but
      can be confusing to understand and hard to use.
      It is like having a padlock with one key code
     to lock it and another secret key to unlock. That way, anyone
     can send you a secret by locking it, while only you get access.</p>
  </div>
  )
}
