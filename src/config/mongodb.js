import mongoose from 'mongoose'
import { env } from './environment.js'

export const connectDB = () => {
  mongoose
    .connect(env.DB_URI, {
      useNewUrlParser: true,
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then((data) => {
      console.log(`Mongodb is connected with server: ${data.connection.host}`)
    })
}
