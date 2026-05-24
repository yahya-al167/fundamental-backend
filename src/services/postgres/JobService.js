import pkg from "pg";
const { Pool } = pkg;

class JobsService {
    constructor() {
        this._pool = new Pool();
    }

    async addJob({ id, title, description, companyId, categoryId }) {
        await this._pool.query(
            `INSERT INTO jobs(id, title, description, company_id, category_id)
       VALUES($1,$2,$3,$4,$5)`,
            [id, title, description, companyId, categoryId],
        );
    }

    async getJobs() {
        const result = await this._pool.query(`
      SELECT 
        j.id, j.title, j.description,
        c.id as company_id, c.name as company_name,
        cat.id as category_id, cat.name as category_name
      FROM jobs j
      LEFT JOIN companies c ON j.company_id = c.id
      LEFT JOIN categories cat ON j.category_id = cat.id
    `);

        return result.rows;
    }

    async searchJobs(title, companyName) {
        let query = `
      SELECT 
        j.id, j.title, j.description,
        c.id as company_id, c.name as company_name,
        cat.id as category_id, cat.name as category_name
      FROM jobs j
      LEFT JOIN companies c ON j.company_id = c.id
      LEFT JOIN categories cat ON j.category_id = cat.id
      WHERE 1=1
    `;

        const params = [];
        let paramCount = 1;

        if (title) {
            query += ` AND j.title ILIKE $${paramCount}`;
            params.push(`%${title}%`);
            paramCount++;
        }

        if (companyName) {
            query += ` AND c.name ILIKE $${paramCount}`;
            params.push(`%${companyName}%`);
            paramCount++;
        }

        const result = await this._pool.query(query, params);
        return result.rows;
    }

    async getJobsByCompanyId(companyId) {
        const result = await this._pool.query(
            `
      SELECT 
        j.id, j.title, j.description,
        c.id as company_id, c.name as company_name,
        cat.id as category_id, cat.name as category_name
      FROM jobs j
      LEFT JOIN companies c ON j.company_id = c.id
      LEFT JOIN categories cat ON j.category_id = cat.id
      WHERE j.company_id = $1
      `,
            [companyId],
        );

        return result.rows;
    }

    async getJobsByCategoryId(categoryId) {
        const result = await this._pool.query(
            `
      SELECT 
        j.id, j.title, j.description,
        c.id as company_id, c.name as company_name,
        cat.id as category_id, cat.name as category_name
      FROM jobs j
      LEFT JOIN companies c ON j.company_id = c.id
      LEFT JOIN categories cat ON j.category_id = cat.id
      WHERE j.category_id = $1
      `,
            [categoryId],
        );

        return result.rows;
    }

    async getJobById(id) {
        const result = await this._pool.query(
            `
      SELECT 
        j.id, j.title, j.description,
        c.id as company_id, c.name as company_name,
        cat.id as category_id, cat.name as category_name
      FROM jobs j
      LEFT JOIN companies c ON j.company_id = c.id
      LEFT JOIN categories cat ON j.category_id = cat.id
      WHERE j.id = $1
      `,
            [id],
        );

        if (!result.rows.length) {
            throw new Error("NOT_FOUND");
        }

        return result.rows[0];
    }

    async getCompanies() {
        const result = await this._pool.query(
            "SELECT id FROM companies LIMIT 1",
        );
        return result.rows;
    }

    async getCategories() {
        const result = await this._pool.query(
            "SELECT id FROM categories LIMIT 1",
        );
        return result.rows;
    }

    async updateJob(id, { title, description, companyId, categoryId }) {
        const result = await this._pool.query(
            `UPDATE jobs 
       SET title=$1, description=$2, company_id=$3, category_id=$4
       WHERE id=$5 RETURNING id`,
            [title, description, companyId, categoryId, id],
        );

        if (!result.rows.length) {
            throw new Error("NOT_FOUND");
        }
    }

    async deleteJob(id) {
        const result = await this._pool.query(
            `DELETE FROM jobs WHERE id=$1 RETURNING id`,
            [id],
        );

        if (!result.rows.length) {
            throw new Error("NOT_FOUND");
        }
    }
}

export default JobsService;
