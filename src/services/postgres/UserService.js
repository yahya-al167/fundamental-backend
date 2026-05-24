import pkg from "pg";
import { nanoid } from "nanoid";

const { Pool } = pkg;

class UserService {
    constructor() {
        this._pool = new Pool();
    }

    async addUser({ name, email, password, role }) {
        const id = `user-${nanoid(16)}`;

        try {
            await this._pool.query(
                `INSERT INTO users (id, name, email, password, role)
       VALUES ($1, $2, $3, $4, $5)`,
                [id, name, email, password, role], // ✅ HARUS 5 PARAM
            );

            return id;
        } catch (err) {
            if (err.code === "23505") {
                throw new Error("EMAIL_ALREADY_EXISTS");
            }

            console.error("DB ERROR:", err);

            throw err;
        }
    }

    async getUserById(id) {
        const result = await this._pool.query(
            "SELECT id, name, email, role FROM users WHERE id = $1",
            [id],
        );

        if (!result.rows.length) {
            throw new Error("USER_NOT_FOUND");
        }

        return result.rows[0];
    }

    async getUserByEmail(email) {
        const result = await this._pool.query(
            "SELECT * FROM users WHERE email = $1",
            [email],
        );

        return result.rows[0]; // ❗ JANGAN THROW
    }
}

export default UserService;
