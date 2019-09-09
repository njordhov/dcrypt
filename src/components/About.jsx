import React from 'react'

const wikiBobAlice = "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f9/Public_key_encryption.svg/800px-Public_key_encryption.svg.png"
//   align-items-center justify-content-center

export default function About () {
  return (
  <div className="jumbotron mb-0"
       style={{minHeight: "100vh"}}>
     <h5 className="text-center pb-2">What is Public Key Cryptography?</h5>
    <div className="card-columns">
       <div className="card border-primary">
         <div class="card-body">
            <p>The internet runs on public key cryptography! It is an essential technology to
            communicate secrets online, but
            can be confusing to understand and hard to use.</p>
         </div>
      </div>

      <div className="card border-info">
         <div class="card-body">
            <p>Public key cryptography solves the chicken/egg problem of how to communicate securely with
               somebody without already having a way to communicate securely.
               Like if the two parties cannot meet to agree on a secret cipher for their messages.
               </p>
        </div>
      </div>

     <div className="card border-info">
        <div class="card-body">
            <p>
              The solution is to have a public sharable key to encrypt the message and a different
              secret key to decrypt it back to the original. That's why it is also known
              as <cite>assymetric cryptography</cite>.</p>
        </div>
      </div>

      <div className="card bg-dark">
        <div class="card-body">
           {<img className="img-responsive" src={wikiBobAlice}
                 style={{maxWidth: "100%", maxHeight: "auto", objectFit: "contain"}}/>}
        </div>
       </div>

     <div className="card border-info">
        <div class="card-body">
            <p>In a nutshell, assymetric cryptography is like giving out padlocks
            that anyone can use to secure confidential material but where only
             you have the key to unlock it. That way, anyone
           can transmit confidentially to you by securing the material with the padlock,
           while only you can get access using your private key.</p>
         </div>
      </div>

     <div className="card border-danger">
        <div class="card-body">
            <div class="card-media text-center mb-1">
              <i class="fas fa-bolt" style={{color: "gold", fontSize: "300%"}}></i>
            </div>
            <p>Public-key cryptography has many uses.
            For example, say you want to request funds from somebody
          with a Bolt11 Lightning invoice but prefer to keep the content
          of the invoice a secret. We'll show you how.
          </p>
         </div>
      </div>


      <div className="card border-success">
        <div className="card-body">
          <h6 className="card-title">Example: Safekeeping</h6>
          <ol className="list-group list-group-flush">
            <li className="list-group-item">Encrypt the file with your public key.</li>
            <li className="list-group-item">Store the encrypted content on your filesystem
                or online.</li>
            <li className="list-group-item">Decrypt the content using your private key
            to get back the original file.</li>
          </ol>
        </div>
      </div>

      <div className="card border-success">
        <div className="card-body">
          <h6 className="card-title">Example: Send a Confidential File</h6>
          <ol className="list-group list-group-flush">
            <li className="list-group-item">Encrypt the file with the public key of the recipient.</li>
            <li className="list-group-item">Transmit the encrypted content to the recipient.</li>
            <li className="list-group-item">The receiver decrypt the content using their private key.</li>
          </ol>
        </div>
      </div>

      <div className="card border-success">
        <div className="card-body">
          <h6 className="card-title">Example: Request a Confidential File</h6>
          <ol className="list-group list-group-flush">
            <li className="list-group-item">Share your public key with the sender</li>
            <li className="list-group-item">The sender encrypts the file with your public key.</li>
            <li className="list-group-item">Upon receipt you decrypt the file using your private key.</li>
          </ol>
        </div>
      </div>


     </div>
  </div>
  )
}
