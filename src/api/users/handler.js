import bcrypt from "bcryptjs";
import { UserPayloadSchema } from "./schema.js";

class UsersHandler {
    constructor(userService) {
        this._userService = userService;
    }

    postUserHandler = async (req, res) => {
        try {
            const { error } = UserPayloadSchema.validate(req.body);

            if (error) {
                return res.status(400).json({
                    status: "failed",
                    message: error.message,
                });
            }

            const { name, email, password, role } = req.body;

            const hashedPassword = await bcrypt.hash(password, 10);

            const id = await this._userService.addUser({
                name,
                email,
                password: hashedPassword,
                role,
            });

            return res.status(201).json({
                status: "success",
                data: { id },
            });
        } catch (err) {
            return res.status(500).json({
                status: "failed",
                message: "Internal server error",
            });
        }
    };

    getUserByIdHandler = async (req, res) => {
        try {
            const user = await this._userService.getUserById(req.params.id);

            return res.json({
                status: "success",
                data: {
                    name: user.name,
                },
            });
        } catch {
            return res.status(404).json({
                status: "failed",
                message: "User not found",
            });
        }
    };
}

export default UsersHandler;
