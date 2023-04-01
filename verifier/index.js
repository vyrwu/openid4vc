const express = require('express')

const app = express()

app.get('/', (req, res) => {
  res.send('Successful response.')
  console.log('asd')
})

app.listen(8081)
