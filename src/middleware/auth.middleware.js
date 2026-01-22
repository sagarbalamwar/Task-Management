import jwt from 'jsonwebtoken';
function verifyToken(req,res,next){
    const header=req.header("Authorization");
    if(!header) {
      return   res.status(401).json({error: "Access Denied"});
    }
    const token=header.split(" ")[1];
    if(!token){
        return res.status(401).json({error:"Invalid Token"})
    }
    try {
       const decoded =jwt.verify(token,process.env.JWT_SECRET_KEY)
       req.user={
        userId:decoded.userId,
        Email:decoded.email
       }
       next()
    } catch (error) {
        res.status(401).json({error:"Invalid or expired token"});
    }
}
export{
    verifyToken
}