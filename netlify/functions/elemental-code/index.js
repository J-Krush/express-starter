// This module can be used to serve the express app
// as a lambda function

const serverless = require('serverless-http')

const { app } = require("./bundle/server")

module.exports.handler = serverless(app)