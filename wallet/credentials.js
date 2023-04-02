import axios from 'axios'
import jwt from 'jsonwebtoken'
import * as fs from 'fs'

// Example key from https://github.com/decentralized-identity/uni-resolver-driver-did-key#example-dids
const walletDid = 'did:key:z6Mkfriq1MqLBoPWecGoDLjguo1sB9brj6wT3qZ5BxkKpuP6'

export const issue = async () => {
  const payload = {
    iss: 's6BhdRkqt3',
    aud: 'https://issuer.example.com',
    iat: Date.now(),
    nonce: 'tZignsnFbp',
  }
  const options = {
    keyid: walletDid,
    algorithm: 'RS256',
  }
  const privateKey = fs.readFileSync('wallet_jwtRS256.key')
  const token = jwt.sign(payload, privateKey, options)

  const result = await axios.post(
    'http://localhost:8079/credential',
    {
      body: {
        format: 'jwt_vc_json',
        proof: {
          proof_type: 'jwt',
          jwt: token,
        },
      },
    },
    {
      headers: {
        'content-type': 'application/json; charset=utf-8',
        host: 'issuer.example.com',
        Authorization: 'BEARER abcdefghijklmnoprstuvwz',
      },
    }
  )

  const vcResponse = result.data
  // vcResponse.credential = jwt.decode(result.data.credential)
  // console.log(JSON.stringify(vcResponse, null, 2))
  return vcResponse
}

export const validate = async (credentialId) => {}
