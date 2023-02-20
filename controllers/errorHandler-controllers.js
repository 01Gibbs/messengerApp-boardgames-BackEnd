const express = require('express')

exports.handle500s = (error, request, response, next) => {
  console.log(error)
  response.status(500).send({
    msg: "We've lost a game piece under the sofa! We will fix the server as soon as we get back!",
  })
}
