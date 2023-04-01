// const express = require('express')
// const axios = require('axios')
// const bodyParser = require('body-parser')
// const jwt_decode = require('jwt-decode')

import express from 'express'
import bodyParser from 'body-parser'
import jwt_decode from 'jwt-decode'
import axios from 'axios'

const app = express()
const jsonParser = bodyParser.json()

let jwt = {}
let proof = {}
let did
let didDocument = {}

app.get('/', (req, res) => {
  res.send('Successful response.')
})

app.post('/credential', jsonParser, (req, res) => {
  proof = req.body.body
  jwt = proof.proof.jwt
  did = jwt_decode(jwt, { header: true }).kid
  // didDocument = axiosClient.get(
  //   'http://localhost:8080/1.0/identifiers/did:indy:idunion:BDrEcHc8Tb4Lb2VyQZWEDE'
  // )

  console.log(didDocument)
  res.send('OK')
})

axios
  .get(' http://localhost:8080/1.0/identifiers/did:ebsi:ziE2n8Ckhi6ut5Z8Cexrihd')
  .then((respones) => console.log(respones.data.verificationMethod))

//Retrieve key from

app.listen(8079)
