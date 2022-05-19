const express = require('express')
const dotenv = require('dotenv')
const bodyParser = require('body-parser')

// Load environment variables from .env
dotenv.config()

// Create express app
const app = express()
const port = 5000

// Middleware
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.get('/test', async function (req, res) {

    console.log('query params: ', req.query)

    // Check for query params
    if (!req.query || !req.query.test) {
        res.send({
            message: "Missing arguments",
            code: 422,
            error: true
        })
        return
    }

    // res.sendStatus(200)
    res.send(req.query.test)
})


app.listen(port, () => {
    console.log(`Now listening on port ${port}`);
})


module.exports = {
    app
}