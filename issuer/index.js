import express from 'express'
import bodyParser from 'body-parser'
import jwt_decode from 'jwt-decode'
import axios from 'axios'
import jwt from 'jsonwebtoken'
import * as fs from 'fs'

const app = express()
const jsonParser = bodyParser.json()

// Example key from https://github.com/decentralized-identity/uni-resolver-driver-did-key#example-dids
const issuerDid = 'did:key:z6MksQ35B5bwZDQq4QKuhQW2Sv6dcqwg4PqcSFf67pdgrtjB'

app.get('/', (req, res) => {
  res.send('Successful response.')
})

app.post('/credential', jsonParser, async (req, res) => {
  const walletJwt = req.body.body.proof.jwt
  const walletDid = jwt_decode(walletJwt, { header: true }).kid
  const nonce = jwt_decode(walletJwt, { header: false }).nonce

  // TODO: validate token

  const doc = await axios.get(`http://localhost:8080/1.0/identifiers/${walletDid}`)

  if (doc.status !== 200) {
    // TODO: 5.2/5.3 Authorization Responses?
    res.send({ error: 'invalid_request' })
    res.sendStatus(400)
  }

  const credential = {
    '@context': [
      'https://www.w3.org/2018/credentials/v1',
      'https://www.w3.org/2018/credentials/examples/v1',
    ],
    id: 'https://example.com/credentials/1872',
    type: ['VerifiableCredential', 'UniversityDegreeCredential'],
    issuer: {
      id: issuerDid,
    },
    issuanceDate: '2010-01-01T19:23:24Z',
    credentialSubject: {
      id: `${walletDid}`,
      degree: {
        type: 'BachelorDegree',
        name: 'Bachelor of Science and Arts',
      },
    },
  }

  const payload = {
    vc: credential,
    iss: 'https://issuer.example.com',
    aud: req.headers['host'],
    nbf: Date.now(),
    nonce: nonce,
    sub: walletDid,
  }
  const options = {
    algorithm: 'RS256',
  }
  const privateKey = fs.readFileSync('issuer_jwtRS256.key')

  const token = jwt.sign(payload, privateKey, options)

  const response = {
    format: 'jwt_vc_json',
    credential: token,
    c_nonce: nonce,
    c_nonce_expires_in: 86400,
  }

  res.send(response)
})

app.listen(8079)
