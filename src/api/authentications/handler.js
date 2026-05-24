import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

class AuthenticationsHandler {
    constructor(userService, authService) {
        this._userService = userService;
        this._authService = authService;
    }

    postAuthenticationHandler = async (req, res) => {
        try {
            const { email, password } = req.body || {};

            if (
                typeof email !== "string" ||
                typeof password !== "string" ||
                email.trim().length === 0 ||
                password.trim().length === 0
            ) {
                return res.status(400).json({
                    status: "failed",
                    message: "Invalid payload",
                });
            }

            const user = await this._userService.getUserByEmail(email);

            if (!user) {
                return res.status(401).json({
                    status: "failed",
                    message: "Invalid credentials",
                });
            }

            const match = await bcrypt.compare(password, user.password);

            if (!match) {
                return res.status(401).json({
                    status: "failed",
                    message: "Invalid credentials",
                });
            }

            const accessToken = jwt.sign(
                { id: user.id, role: user.role }, // ✅ WAJIB ADA ROLE
                process.env.ACCESS_TOKEN_KEY,
                { expiresIn: "3h" },
            );

            const refreshToken = jwt.sign(
                { id: user.id },
                process.env.REFRESH_TOKEN_KEY,
            );

            await this._authService.addRefreshToken(refreshToken);

            return res.status(200).json({
                status: "success",
                data: {
                    accessToken,
                    refreshToken,
                },
            });
        } catch (err) {
            console.error("LOGIN ERROR:", err);

            return res.status(500).json({
                status: "failed",
                message: "Internal server error",
            });
        }
    };

    putAuthenticationHandler = async (req, res) => {
        try {
            const { refreshToken } = req.body;

            if (!refreshToken) {
                return res.status(400).json({
                    status: "failed",
                    message: "Refresh token required",
                });
            }

            await this._authService.verifyRefreshToken(refreshToken);

            const decoded = jwt.verify(
                refreshToken,
                process.env.REFRESH_TOKEN_KEY,
            );

            const accessToken = jwt.sign(
                { id: decoded.id, role: decoded.role || "user" },
                process.env.ACCESS_TOKEN_KEY,
                { expiresIn: "3h" },
            );

            return res.status(200).json({
                status: "success",
                data: { accessToken },
            });
        } catch (err) {
            return res.status(400).json({
                status: "failed",
                message: "Invalid refresh token",
            });
        }
    };

    deleteAuthenticationHandler = async (req, res) => {
        try {
            const { refreshToken } = req.body;

            if (!refreshToken) {
                return res.status(400).json({
                    status: "failed",
                    message: "Refresh token required",
                });
            }

            await this._authService.verifyRefreshToken(refreshToken);

            await this._authService.deleteRefreshToken(refreshToken);

            return res.status(200).json({
                status: "success",
                message: "Logout success",
            });
        } catch (err) {
            return res.status(400).json({
                status: "failed",
                message: "Logout failed",
            });
        }
    };
}

export default AuthenticationsHandler;
