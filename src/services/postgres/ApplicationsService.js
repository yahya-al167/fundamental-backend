import pkg from "pg";
const { Pool } = pkg;

class ApplicationsService {
    constructor() {
        this._pool = new Pool();
    }

    async addApplication({ id, userId, jobId }) {
        await this._pool.query(
            `INSERT INTO applications(id, user_id, job_id, status)
       VALUES($1,$2,$3,'pending')`,
            [id, userId, jobId],
        );
    }

    async getApplications() {
        const result = await this._pool.query(`
      SELECT 
        a.id,
        a.status,
        u.id as user_id,
        u.name as user_name,
        j.id as job_id,
        j.title as job_title
      FROM applications a
      LEFT JOIN users u ON a.user_id = u.id
      LEFT JOIN jobs j ON a.job_id = j.id
    `);

        return result.rows;
    }

    async getApplicationById(id) {
        const result = await this._pool.query(
            `SELECT * FROM applications WHERE id=$1`,
            [id],
        );

        if (!result.rows.length) {
            throw new Error("NOT_FOUND");
        }

        return result.rows[0];
    }

    async getApplicationsByJobId(jobId) {
        const result = await this._pool.query(
            "SELECT id, user_id, job_id, status FROM applications WHERE job_id = $1",
            [jobId],
        );

        return result.rows;
    }

    async getApplicationsByUserId(userId) {
        const result = await this._pool.query(
            "SELECT id, user_id, job_id, status FROM applications WHERE user_id = $1",
            [userId],
        );

        return result.rows;
    }

    async updateApplication(id, status) {
        const result = await this._pool.query(
            `UPDATE applications SET status=$1 WHERE id=$2 RETURNING id`,
            [status, id],
        );

        if (!result.rows.length) {
            throw new Error("NOT_FOUND");
        }
        return result.rows[0]; 
    }

    async deleteApplication(id) {
        const result = await this._pool.query(
            `DELETE FROM applications WHERE id=$1 RETURNING id`,
            [id],
        );

        if (!result.rows.length) {
            throw new Error("NOT_FOUND");
        }
    }
}

export default ApplicationsService;
