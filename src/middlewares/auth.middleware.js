import jwt from "jsonwebtoken";

export function authArtist(req, res, next) {
    const token = req.cookies.token;
    
    if(!token) {
        return res.status(401).json({message: "Unauthorized"});
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if(decoded.role !== "artist") {
            return res.status(403).json({message: "Forbidden"});
        }

        req.user = decoded;

        next();
    }
    catch(error) {
        return res.status(401).json({message: "Invalid token"});
    }
}