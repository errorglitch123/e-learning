import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './configs/mongodb.js'
import { clerkWebhooks, stripeWebhooks } from './controllers/webhooks.js'
import educatorRouter from './routes/educatorRouter.js'
import { clerkMiddleware } from '@clerk/express'
import connectCloudinary from './controllers/cloudinaryController.js'
import courseRouter from './routes/courseRouter.js'
import userRouter from './routes/userRounter.js'
const app = express()
//connect to db
await connectDB()
await connectCloudinary();
app.use(cors())
app.use(clerkMiddleware())

//routes
app.get('/',(req,res)=> res.send("API WORKING"));
app.post('/clerk',express.json(),clerkWebhooks);
app.use('/api/educator',express.json(),educatorRouter);
app.use('/api/course',express.json(),courseRouter );
app.use('/api/user',express.json(),userRouter);
app.post('/stripe',express.raw({type:'application/json'}),stripeWebhooks)

//port 
const PORT = process.env.PORT || 5000

if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT,()=>{
    console.log(`Server is running on the Port ${PORT}`)
  })
}

export default app;