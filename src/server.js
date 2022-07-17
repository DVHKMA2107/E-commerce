import express from 'express'
import { env } from './config/environment.js'
import { apiV1 } from './routes/index.js'
import { connectDB } from './config/mongodb.js'
import { errorMiddleware } from './middlewares/error.js'

//Handling Uncaught Exception
process.on('uncaughtException', (err) => {
  console.log(`Error: ${err.message}`)
  console.log('Shutting down the server due to Uncaught Exception')
  process.exit(1)
})

connectDB()
const app = express()

app.use(express.json())

app.use('/api/v1', apiV1)

app.use(errorMiddleware)

const server = app.listen(env.PORT, () => {
  console.log(`Server is running at port: ${env.PORT}`)
})

// Unhandle Promise Rejection
process.on('unhandledRejection', (err) => {
  console.log(`Error: ${err.message}`)
  console.log(`Shutting down the server due to Unhandler Promise Rejection `)

  server.close(() => {
    process.exit(1)
  })
})
