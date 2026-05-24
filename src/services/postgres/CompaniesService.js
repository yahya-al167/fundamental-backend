import pkg from "pg";
const { Pool } = pkg;

class CompaniesService {
    constructor() {
        this._pool = new Pool();
    }

    async addCompany({ id, name, description }) {
        const query = {
            text: `
                INSERT INTO companies(id, name, description)
                VALUES($1, $2, $3)
                RETURNING id
            `,
            values: [id, name, description || null],
        };

        const result = await this._pool.query(query);

        if (!result.rows.length) {
            throw new Error("INSERT_FAILED");
        }

        return result.rows[0].id;
    }

    async getCompanies() {
        const query = {
            text: `
                SELECT id, name, description
                FROM companies
                ORDER BY created_at DESC
            `,
        };

        const result = await this._pool.query(query);

        return result.rows;
    }

    async getCompanyById(id) {
        const query = {
            text: `
                SELECT id, name, description
                FROM companies
                WHERE id = $1
            `,
            values: [id],
        };

        const result = await this._pool.query(query);

        if (!result.rows.length) {
            throw new Error("NOT_FOUND");
        }

        return result.rows[0];
    }

    async updateCompany(id, { name, description }) {
        const query = {
            text: `
                UPDATE companies
                SET name = $1,
                    description = $2
                WHERE id = $3
                RETURNING id
            `,
            values: [name, description || null, id],
        };

        const result = await this._pool.query(query);

        if (!result.rows.length) {
            throw new Error("NOT_FOUND");
        }

        return result.rows[0].id;
    }

    async deleteCompany(id) {
        const query = {
            text: `
                DELETE FROM companies
                WHERE id = $1
                RETURNING id
            `,
            values: [id],
        };

        const result = await this._pool.query(query);

        if (!result.rows.length) {
            throw new Error("NOT_FOUND");
        }

        return result.rows[0].id;
    }
}

export default CompaniesService;
