import express from 'express'
import bodyParser from 'body-parser'
import { defaultHandler, issueCredentialHandler, directPostCredentialsHandler } from './handlers.js'

const app = express()
const jsonParser = bodyParser.json()

app.get('/', defaultHandler)
app.post('/credential', jsonParser, issueCredentialHandler)
app.post('/post', jsonParser, directPostCredentialsHandler)

app.listen(8079)
