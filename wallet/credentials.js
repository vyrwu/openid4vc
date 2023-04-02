import axios from 'axios'
import jwt from 'jsonwebtoken'
import * as fs from 'fs'
import { v4 as uuidv4 } from 'uuid'
import nonce from 'nonce-generator'

// TODO: Validate nonce everywhere

// Example key from https://github.com/decentralized-identity/uni-resolver-driver-did-key#example-dids
const subjectDid = 'did:key:z6MkpTHR8VNsBxYAAWHut2Geadd9jSwuBV8xRoAnwWsdvktH'
const walletDid = 'did:key:z6Mkfriq1MqLBoPWecGoDLjguo1sB9brj6wT3qZ5BxkKpuP6'

export const issue = async () => {
  const payload = {
    iss: walletDid,
    aud: 'https://issuer.example.com',
    iat: Date.now(),
    nonce: nonce(10),
  }
  const options = {
    keyid: subjectDid,
    algorithm: 'RS256',
  }
  const privateKey = fs.readFileSync('wallet_jwtRS256.key')
  const token = jwt.sign(payload, privateKey, options)

  const result = await axios.post(
    'http://localhost:8079/credential',
    {
      format: 'jwt_vc_json',
      proof: {
        proof_type: 'jwt',
        jwt: token,
      },
    },
    {
      headers: {
        'content-type': 'application/json; charset=utf-8',
        host: 'issuer.example.com',
        // TODO: Get token from OAuth 2.0 Authorization Code Flow (Wallet - Issuer)
        Authorization: 'BEARER abcdefghijklmnoprstuvwz',
      },
    }
  )

  const vcResponse = result.data
  return vcResponse
}

export const verify = async () => {
  const sessionNonce = nonce(10)
  // TODO: RECOMMENDED to load this from external endpoint (f.x. issuer hosted)
  const redirect_url = 'http://localhost:8081/post'
  const authorizationRequest = {
    id: 'fa90b67b-8421-4a9c-81cb-e65e6c4ba956',
    input_descriptors: [
      {
        id: '71cc0ed1-a5f2-4138-95a5-77811e59ea95',
        format: {
          jwt_vc_json: {
            alg: ['RS256'],
          },
        },
        constraints: {
          limit_disclosure: 'required',
          // TODO: selective disclosure
          fields: [
            {
              path: ['$.type'],
              filter: {
                type: 'string',
                pattern: 'UniversityDegreeCredential',
              },
            },
            {
              path: ['$.credentialSubject.degree.type'],
            },
            {
              path: ['$.credentialSubject.degree.name'],
            },
          ],
        },
      },
    ],
  }

  const pathToCredentials = `${process.cwd()}/credentials`
  const allCredentials = fs
    .readdirSync(pathToCredentials)
    .map((filename) => `${pathToCredentials}/${filename}`)
    .map((filepath) => fs.readFileSync(filepath, { encoding: 'utf-8' }))
    .map((filestring) => JSON.parse(filestring).credential)

  const requestedCredential = allCredentials
    .map((credential) => {
      return {
        ...jwt.decode(credential).vc,
        encodedJwt: credential,
      }
    })
    .find((credential) => {
      const type = authorizationRequest.input_descriptors[0].constraints.fields.find(
        (field) => field.path == '$.type'
      ).filter.pattern

      return credential.type.find((credentialType) => credentialType == type)
    })

  const vp = {
    '@context': ['https://www.w3.org/2018/credentials/v1'],
    type: ['VerifiablePresentation'],
    verifiableCredential: requestedCredential.encodedJwt,
    id: uuidv4(),
    holder: walletDid,
  }

  const payload = {
    iss: walletDid,
    jti: uuidv4(),
    aud: 'https://issuer.example.com',
    iat: Date.now(),
    nonce: sessionNonce,
    vp: vp,
  }
  const options = {
    keyid: subjectDid,
    algorithm: 'RS256',
  }
  const privateKey = fs.readFileSync('wallet_jwtRS256.key')
  const vp_token = jwt.sign(payload, privateKey, options)

  const presentation_submission = {
    id: 'Selective disclosure example presentation',
    definition_id: 'Selective disclosure example',
    descriptor_map: [
      {
        id: uuidv4(),
        format: 'jwt_vp',
        path: '$',
        path_nested: {
          format: 'jwt_vp',
          path: '$.verifiableCredential[0]',
        },
      },
    ],
  }

  const authorizationResponse = {
    vp_token: vp_token,
    presentation_submission: presentation_submission,
    nonce: sessionNonce,
  }

  const result = await axios.post(
    redirect_url, // Verifier direct_post URL
    authorizationResponse,
    {
      headers: {
        'content-type': 'application/json; charset=utf-8',
        host: 'wallet.example.com',
      },
    }
  )

  console.log(result)
}
