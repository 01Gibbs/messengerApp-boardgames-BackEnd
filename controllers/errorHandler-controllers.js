const express = require('express')

exports.handle404s = (request, response, next) => {
  response.status(404).send({ msg: 'path not found' })
}

exports.handleCustomErrors = (error, request, response, next) => {
  if (error.status && error.msg) {
    response.status(404).send({ msg: error.msg })
  } else {
    next(error)
  }
}

exports.handle500s = (error, request, response, next) => {
  console.log(error)
  response.status(500).send({
    msg: "We've lost a game piece under the sofa! We will fix the server as soon as we get back!",
  })
}
