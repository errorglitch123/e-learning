import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './configs/mongodb.js'
import { clerkWebhooks } from './controllers/webhooks.js'

const app = express()
//connect to db
await connectDB()
app.use(cors())

//routes
app.get('/',(req,res)=> res.send("API WORKING"));
app.post('/clerk',express.json(),clerkWebhooks)

//port 
const PORT = process.env.PORT || 5000

if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT,()=>{
    console.log(`Server is running on the Port ${PORT}`)
  })
}

export default app;