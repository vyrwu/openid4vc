import * as fs from 'fs'
import { issue, validate } from './credentials.js'

const mode = process.argv[2]

if (mode == 'issue') {
  const result = await issue()
  const credential = result.credential
  const credentialId = credential.substring(credential.length - 6)
  fs.writeFile(`./credentials/${credentialId}.json`, JSON.stringify(result, null, 2), (err) => {
    err && console.log(err)
  })
} else if (mode == 'verify') {
  verifyCredential()
} else {
  console.log('usage: node index.js <issue/verify>')
}
