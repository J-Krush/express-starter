const express = require('express')

// Create express app
const app = express()
const bodyParser = require('body-parser')
const port = 5000

// Middleware
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.post('/elemental-code', async function (req, res) {
    console.log('elemental code endpoint: ', req.body)
    
    res.sendStatus(200)
})


app.listen(port, () => {
    console.log(`Now listening on port ${port}`);
}); 