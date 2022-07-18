import ErrorHander from '../utils/errorHander.js'

export const errorMiddleware = (err, req, res, next) => {
  err.message = err.message || 'Internal Server Error'
  err.statusCode = err.statusCode || 500

  if (err.name === 'CastError') {
    const message = `Resource not found, Invalid: ${err.path}`
    err = new ErrorHander(message, 400)
  }

  res.status(err.statusCode).json({
    success: false,
    message: err.message,
  })
}
