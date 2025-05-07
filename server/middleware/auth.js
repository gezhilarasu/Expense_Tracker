const jwt=require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

const verifyToken = (req, res, next) => {
    const authheader=req.headers.authorization;

    if(!authheader ||!authheader.startsWith('Bearer'))
    {
        return res.status(401).json({message:'no token available or not send in proper format'});
    }
    const token=authheader.split(' ')[1];
    try{
        const decoded=jwt.verify(token,process.env.JWT_SECRET);
        req.user=decoded;
        next();
    }
    catch(err)
    {
        return res.status(401).json({message:'Invalid token'});
    }
}
module.exports={verifyToken};