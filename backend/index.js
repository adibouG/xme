const express = require('express')
const cors = require('cors')
const router = require('./server/routes')
const server = require('./server/server')

const app = express()
const port = 3000


app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(express.static('public'))
app.use(cors())
app.use('/api', router)
server.initDB();


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
