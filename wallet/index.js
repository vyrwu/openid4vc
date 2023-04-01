import axios from 'axios'

// const result = await axios.post(
//   'http://localhost:8080/credential',
//   {
//     format: 'jwt_vc_json',
//     types: ['VerifiableCredential', 'UniversityDegreeCredential'],
//     proof: {
//       proof_type: 'jwt',
//       jwt: 'eyJraWQiOiJkaWQ6ZXhhbXBsZTplYmZlYjFmNzEyZWJjNmYxYzI3NmUxMmVjMjEva2V5cy8xIiwiYWxnIjoiRVMyNTYiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJzNkJoZFJrcXQzIiwiYXVkIjoiaHR0cHM6Ly9zZXJ2ZXIuZXhhbXBsZS5jb20iLCJpYXQiOiIyMDE4LTA5LTE0VDIxOjE5OjEwWiIsIm5vbmNlIjoidFppZ25zbkZicCJ9.ewdkIkPV50iOeBUqMXCC_aZKPxgihac0aW9EkL1nOzM',
//     },
//   },
//   {
//     headers: {
//       'content-type': 'application/json; charset=utf-8',
//       host: 'issuer.example.com',
//       Authorization: 'ACCESSTOKEN123456',
//     },
//   }
// )

const result = await axios.post('http://localhost:8079/credential', {
  body: {
    format: 'jwt_vc_json',
    types: ['VerifiableCredential', 'UniversityDegreeCredential'],
    proof: {
      proof_type: 'jwt',
      jwt: 'eyJraWQiOiJkaWQ6ZXhhbXBsZTplYmZlYjFmNzEyZWJjNmYxYzI3NmUxMmVjMjEva2V5cy8xIiwiYWxnIjoiRVMyNTYiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJzNkJoZFJrcXQzIiwiYXVkIjoiaHR0cHM6Ly9zZXJ2ZXIuZXhhbXBsZS5jb20iLCJpYXQiOiIyMDE4LTA5LTE0VDIxOjE5OjEwWiIsIm5vbmNlIjoidFppZ25zbkZicCJ9.ewdkIkPV50iOeBUqMXCC_aZKPxgihac0aW9EkL1nOzM',
    },
  },
})

// const result = await axios.post(
//   'http://localhost:8080/credential',
//   {
//     name: 'name',
//   },
//   {
//     headers: {
//       'content-type': 'application/json; charset=utf-8',
//     },
//   }
// )

console.log(result.status)
