import dotenv from 'dotenv'
dotenv.config({ path: './.env' })

import app from './app.js';
import mongoose from 'mongoose';
(async ()=>{
    try {
        mongoose.connect(`${process.env.MONGODB_URI}Userauthentication`)
        .then(()=>console.log("Database Connected"));
        app.listen(process.env.PORT,()=>{
            console.log(`App is litening on ${process.env.PORT}`)
        })
    } catch (error) {
        console.error("Error : ",error)
    }
})();