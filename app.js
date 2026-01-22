import express from 'express';

const app=express();


app.use(express.json());
app.use(express.urlencoded({extended:true}))
app.get("/",(req,res)=>{
    res.json({
        message:"root"
    });
})
import { verifyToken } from './src/middleware/auth.middleware.js';
app.get("/protected",verifyToken,(req,res)=>{
    res.status(200).json({message:"Protected route Access"})
})
import { router as userRouter } from './src/routes/user.routes.js';
app.use("/auth",userRouter)
import { router as taskRouter } from './src/routes/task.routes.js';
app.use("/task",taskRouter)



export default app;