import pkg from "pg";
const { Pool } = pkg;

class CategoriesService {
    constructor() {
        this._pool = new Pool();
    }

    async addCategory({ id, name }) {
        await this._pool.query(
            "INSERT INTO categories(id, name) VALUES($1,$2)",
            [id, name],
        );
    }

    async updateCategory(id, { name }) {
        const result = await this._pool.query(
            "UPDATE categories SET name=$1 WHERE id=$2 RETURNING id",
            [name, id],
        );

        if (!result.rows.length) {
            throw new Error("NOT_FOUND");
        }
    }

    async deleteCategory(id) {
        const result = await this._pool.query(
            "DELETE FROM categories WHERE id=$1 RETURNING id",
            [id],
        );

        if (!result.rows.length) {
            throw new Error("NOT_FOUND");
        }
    }

    async getCategories() {
        const result = await this._pool.query(
            "SELECT id, name FROM categories",
        );
        return result.rows;
    }

    async getCategoryById(id) {
        const result = await this._pool.query(
            "SELECT * FROM categories WHERE id=$1",
            [id],
        );

        if (!result.rows.length) {
            throw new Error("NOT_FOUND");
        }

        return result.rows[0];
    }
}

export default CategoriesService;
