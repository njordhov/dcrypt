import React from 'react'

import css from './About.css'

const wikiBobAlice = "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f9/Public_key_encryption.svg/800px-Public_key_encryption.svg.png"
//   align-items-center justify-content-center

function EFF (props) {
  return (
  <div>
    <a href="https://www.eff.org/join">
      <img src="https://www.eff.org/files/eff-join1.png" alt="Join EFF!" border="0"/>
    </a>
  </div>
  )
}

function Credits () {
  return (
      <div class="Credits d-flex alert alert-dark mt-5">
        <img className="mx-2 mh-100" src="https://i.creativecommons.org/l/by/3.0/us/88x31.png"
             alt="Creative Commons logo"/>
        <div className="flex-grow-1">
        Parts of this page has been adapted from
        the <a target="_blank" href="https://ssd.eff.org/en/module/deep-dive-end-end-encryption-how-do-public-key-encryption-systems-work">
        EFF Deep Dive on End-to-End Encryption</a> which is a good destination if you would
        like to know more.
        This content may be freely distributed under
        the <a target="_blank" href="https://creativecommons.org/licenses/by/3.0/us/">
         Creative Commons license.</a>
         </div>
       </div>
     )
}

function AboutText () {
  return (
  <div className="jumbotron mb-0" id="AboutText">
     <h5 className="text-center pb-2">What is Public Key Cryptography?</h5>
    <div className="card-columns">
       <div className="card border-primary">
         <div class="card-body">
            <p>The internet runs on public-key cryptography! It is an essential technology to
            communicate secrets online, but
            can be confusing to understand and hard to use.</p>
         </div>
      </div>

      <div className="card border-primary">
        <div class="card-body">
          <p>Here is how encryption works when communicating a message:</p>
          <ol>
            <li>A clearly readable message such as <cite>"Meet me in the garden"</cite> is encrypted into an
            incomprehensible scrambled message like <cite>6EB6957008E03CE4</cite>.</li>
            <li>The encrypted message is sent over the Internet, where eavesdroppers
                can only see the scrambled message.</li>
            <li>When it arrives at its destination, only the intended recipient
                has the code to decrypting the transmission back into the original message.</li>
          </ol>
        </div>
      </div>

      <div className="card border-info">
         <div class="card-body">
            <p>But what if the parties don't have a way to agree on the encryption
                      cipher in advance?</p>
            <p>Public key cryptography solves the chicken/egg problem of <cite>how to communicate securely with
               somebody without already being able to communicate securely.</cite>
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
            online but prefer to keep the content
            of the invoice a secret. We'll show you how.
          </p>
         </div>
      </div>


      <div className="card border-success">
        <div className="card-body">
          <h6 className="card-title">Example: Safekeeping Confidential Files</h6>
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
     <Credits/>
  </div>
  )
}

function Illustration ({src}) {
  return (
    <div className="alert alert-dark w-80 mt-4">
      <img style={{maxWidth: "100%"}}
           src={src}/>
    </div>
  )
}

function AboutVisual () {
  return (
    <div className="jumbotron mb-0">
     <div style={{maxWidth: "60em", margin: "auto"}}>
       <h5 className="text-center">A Primer On End-To-End Encryption:</h5>
       <h5 className="text-center pb-2">How Does Public-Key Cryptography Work?</h5>

      <p>End-to-end encryption let you communicate with others while
         keeping your content confidential. The content is encrypted on your device and
         first decrypted on the device of the receiver. No one can listen in and eavsdrop on
         your communication.</p>

      <Illustration src="https://ssd.eff.org/files/2018/11/20/7.comparison-encryptedmessage.png"/>

       {/* <h5>What Does Encryption Do?</h5> */}
          <p>Here is how encryption works when communicating a message:</p>
          <ol>
            <li>A clearly readable message such as <cite>Hello Alice!</cite> is encrypted into an
            incomprehensible scrambled message like <cite>6EB6957008E03CE4</cite>.</li>
            <li>The encrypted message is sent over the Internet, where eavesdroppers
                can only see the scrambled message.</li>
            <li>When it arrives at its destination, only the intended recipient
                has the code to decrypting the transmission back into the original message.</li>
          </ol>

          <Illustration src="https://ssd.eff.org/files/2018/05/14/6_0.png"/>
 <p>Before you begin using end-to-end encryption tools, we strongly recommend
taking the time to understand the basics of public key cryptography,
the foundation for many end-to-end encryption systems.</p>

        <p>Public key cryptography lets you encrypt and send messages safely to
        anyone whose public key you know.</p>

        <Illustration src="https://ssd.eff.org/files/2018/05/14/5_0.png"/>

       <p>But how does the recipient get to know the key to decrypt your message if
          you cannot communucate safely in the first place?</p>
      <p>
          Public key cryptography makes it so you don’t need to smuggle the decryption
       key to the recipient of your secret message because that person already has the
       decryption key. The decryption key is their private key. Therefore, all you need
        to send a message is knowing your recipient’s matching public, encrypting key. And you
         can obtain this easily because your recipient can share their public key
         with anyone, since public keys are only used to encrypt messages, not decrypt
         them.</p>

        <Illustration src="https://ssd.eff.org/files/2018/11/20/2.symmetric-asymmetric.png"/>

        <div className="alert alert-warning">
          Keep your private key very safe. If somebody get to know your private key,
          they can read your encrypted messages, even impersonate you. Only share your public key.
        </div>
       <Credits/>
     </div>
    </div>
  )
}

export default function About ({visual}) {
  const visual_mode = true
  return (visual_mode ? <AboutVisual/> : <AboutText/>)
}
