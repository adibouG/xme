const express = require('express')
const router = require('./server/routes')

const app = express()
const port = 3000


app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(express.static('public'))

app.use('/api', router)


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
