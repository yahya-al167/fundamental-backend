import pkg from "pg";

const { Pool } = pkg;

class AuthenticationsService {
    constructor() {
        this._pool = new Pool();
    }

    async addRefreshToken(token) {
        await this._pool.query(
            "INSERT INTO authentications(token) VALUES($1)",
            [token],
        );
    }

    async verifyRefreshToken(token) {
        const result = await this._pool.query(
            "SELECT token FROM authentications WHERE token = $1",
            [token],
        );

        if (!result.rows.length) {
            throw new Error("INVALID_REFRESH_TOKEN");
        }
    }

    async deleteRefreshToken(token) {
        await this._pool.query("DELETE FROM authentications WHERE token = $1", [
            token,
        ]);
    }
}

export default AuthenticationsService;
