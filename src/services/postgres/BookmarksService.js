import pkg from "pg";
const { Pool } = pkg;

class BookmarksService {
    constructor() {
        this._pool = new Pool();
    }

    async addBookmark({ id, jobId, userId }) {
        await this._pool.query(
            "INSERT INTO bookmarks(id, job_id, user_id) VALUES($1,$2,$3)",
            [id, jobId, userId],
        );
    }

    async getBookmarks(userId) {
        const result = await this._pool.query(
            "SELECT id, job_id FROM bookmarks WHERE user_id=$1",
            [userId],
        );

        return result.rows;
    }

    async getBookmarkById(id) {
        const result = await this._pool.query(
            "SELECT id, job_id, user_id FROM bookmarks WHERE id=$1",
            [id],
        );

        if (!result.rows.length) {
            throw new Error("NOT_FOUND");
        }

        return result.rows[0];
    }

    async deleteBookmark(id, userId) {
        const result = await this._pool.query(
            "DELETE FROM bookmarks WHERE id=$1 AND user_id=$2 RETURNING id",
            [id, userId],
        );

        if (!result.rows.length) {
            throw new Error("NOT_FOUND");
        }
    }

    async deleteBookmarkByJob(jobId, userId) {
        const result = await this._pool.query(
            "DELETE FROM bookmarks WHERE job_id=$1 AND user_id=$2 RETURNING id",
            [jobId, userId],
        );

        if (!result.rows.length) {
            throw new Error("NOT_FOUND");
        }
    }
}

export default BookmarksService;
