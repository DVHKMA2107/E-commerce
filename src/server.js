import express from 'express'
import { env } from './config/environment.js'
import { apiV1 } from './routes/index.js'
import { connectDB } from './controllers/mongodb.js'

connectDB()
const app = express()

app.use(express.json())

app.use('/api/v1', apiV1)

app.listen(env.PORT, () => {
  console.log(`Server is running at port: ${env.PORT}`)
})
