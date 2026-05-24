import pkg from "pg";
const { Pool } = pkg;

class DocumentsService {
    constructor() {
        this._pool = new Pool();
    }

    async addDocument({ id, userId, filename, path }) {
        await this._pool.query(
            `INSERT INTO documents(id, user_id, filename, path)
       VALUES($1,$2,$3,$4)`,
            [id, userId, filename, path],
        );
    }

    async getDocuments(userId) {
        const result = await this._pool.query(
            `SELECT id, filename, path FROM documents WHERE user_id=$1`,
            [userId],
        );

        return result.rows;
    }

    async getAllDocuments() {
        const result = await this._pool.query(
            `SELECT id, filename, path, user_id FROM documents`,
        );

        return result.rows;
    }

    async getDocumentById(id) {
        const result = await this._pool.query(
            `SELECT id, filename, path, user_id FROM documents WHERE id=$1`,
            [id],
        );

        if (!result.rows.length) {
            throw new Error("NOT_FOUND");
        }

        return result.rows[0];
    }

    async deleteDocument(id) {
        const result = await this._pool.query(
            `DELETE FROM documents WHERE id=$1 RETURNING id`,
            [id],
        );

        if (!result.rows.length) {
            throw new Error("NOT_FOUND");
        }
    }
}

export default DocumentsService;
