const Admin = require("../Models/admin.model.js")
const { asyncHandler } = require("../utils/asyncHandler.js");
const jwt = require("jsonwebtoken");

const extractTokenFromHeader = (authorizationHeader) => {
    if (!authorizationHeader || !authorizationHeader.startsWith("Bearer")) {
        return null;
    }
    return authorizationHeader.split(" ")[1];
};

const verifyAdminJWT = asyncHandler(async (req, res, next) => {
    const token = extractTokenFromHeader(req.headers.authorization);
    if (!token) {
        return res.status(401).json({ error: "Not authorized, no token" });
    }

    try {
        const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
        const admin = await Admin.findById(decoded.id).select("-password");

        if (!admin) {
            return res.status(403).json({ error: "Access denied: Admin not found" });
        }

        req.admin = admin;
        next();
    } catch (error) {
        if (error.name === "TokenExpiredError") {
            return res.status(401).json({ error: "Token expired, please log in again" });
        }
        return res.status(401).json({ error: "Not authorized, token invalid" });
    }
});

module.exports = { verifyAdminJWT };
