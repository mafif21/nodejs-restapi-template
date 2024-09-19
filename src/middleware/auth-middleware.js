import {prismaClient} from "../application/database.js";
import jwt from "jsonwebtoken";

export const authMiddleware = async (req, res, next) => {
    try {
        const authHeader = req.get('Authorization');

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                status: 401,
                message: "Unauthorized: No token provided"
            }).end();
        }

        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await prismaClient.user.findUnique({
            where: { email: decoded.email }
        });

        if (!user) {
            return res.status(401).json({
                status: 401,
                message: "Unauthorized: User not found"
            }).end();
        }

        if (user.token === null || new Date(user.tokenExpiration) < new Date()) {
            return res.status(401).json({
                status: 401,
                message: "Unauthorized: Token expired or logged out"
            }).end();
        }

        req.user = user;
        next();
    } catch (err) {
        res.status(401).json({
            status: 401,
            message: "Unauthorized: Invalid token"
        }).end();
    }
}