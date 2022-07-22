import ErrorHander from '../utils/errorHander.js'

export const errorMiddleware = (err, req, res, next) => {
  err.message = err.message || 'Internal Server Error'
  err.statusCode = err.statusCode || 500

  // Wrong MongoDb Id
  if (err.name === 'CastError') {
    const message = `Resource not found, Invalid: ${err.path}`
    err = new ErrorHander(message, 400)
  }

  // Mongoose duplicate error
  if (err.code === 11000) {
    const message = `Duplicate ${Object.keys(err.keyValue)} Entered`
    err = new ErrorHander(message, 400)
  }

  //Wrong JWT error
  if (err.name === 'JsonWebTokenError') {
    const message = `Json Web Token is invalid, try again`
    err = new ErrorHander(message, 400)
  }

  //JWT Expire Error
  if (err.name === 'TokenError') {
    const message = `Json Web Token is expired, try agina`
    err = new ErrorHander(message, 400)
  }

  res.status(err.statusCode).json({
    success: false,
    message: err.message,
  })
}
