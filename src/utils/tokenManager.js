import jwt from "jsonwebtoken";

const TokenManager = {
    generateAccessToken: (payload) =>
        jwt.sign(payload, "secret", { expiresIn: "1h" }),

    generateRefreshToken: (payload) => jwt.sign(payload, "refresh_secret"),

    verifyAccessToken: (token) => jwt.verify(token, "secret"), // 🔥 HARUS ADA

    verifyRefreshToken: (token) => jwt.verify(token, "refresh_secret"),
};

export default TokenManager;
