export const defaultHandler = (req, res) => {
  res.send('Successful response.')
}

export const directPostCredentialsHandler = (req, res) => {
  const credentials = req.body
  console.log('Received Credentials!')
  console.log(credentials)
  res.send('OK')
}
