import jwt from "jsonwebtoken";

const auth = (req, res, next) => {
    try {
        const header = req.headers.authorization;

        // Header tidak ada
        if (!header) {
            return res.status(401).json({
                status: "failed",
                message: "Unauthorized",
            });
        }

        // Format salah
        if (!header.startsWith("Bearer ")) {
            return res.status(401).json({
                status: "failed",
                message: "Unauthorized",
            });
        }

        const token = header.split(" ")[1];

        // Token kosong
        if (!token) {
            return res.status(401).json({
                status: "failed",
                message: "Unauthorized",
            });
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_KEY);

        // Pastikan field ada
        req.user = {
            id: decoded.id,
            role: decoded.role || "user", // default kalau tidak ada
        };

        next();
    } catch (err) {
        console.error("AUTH ERROR:", err.message);

        return res.status(401).json({
            status: "failed",
            message: "Unauthorized",
        });
    }
};

export default auth;
