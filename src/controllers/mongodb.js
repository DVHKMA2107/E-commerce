import mongoose from 'mongoose'
import { env } from '../config/environment.js'

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
    .catch((err) => {
      console.log(err)
    })
}
