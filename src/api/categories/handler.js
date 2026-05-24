import { nanoid } from "nanoid";

class CategoriesHandler {
    constructor(service) {
        this._service = service;
    }

    createCategory = async (req, res) => {
        try {
            const { name } = req.body || {};

            if (!name || typeof name !== "string") {
                return res.status(400).json({
                    status: "failed",
                    message: "Invalid payload",
                });
            }

            const id = `category-${nanoid(16)}`;

            await this._service.addCategory({ id, name });

            return res.status(201).json({
                status: "success",
                data: { id },
            });
        } catch {
            return res.status(500).json({
                status: "failed",
                message: "Internal server error",
            });
        }
    };

    getCategories = async (req, res) => {
        try {
            const categories = await this._service.getCategories();

            return res.status(200).json({
                status: "success",
                data: { categories },
            });
        } catch {
            return res.status(500).json({
                status: "failed",
                message: "Internal server error",
            });
        }
    };

    getCategoryById = async (req, res) => {
        try {
            const { id } = req.params;

            if (!id) {
                return res.status(400).json({
                    status: "failed",
                    message: "Invalid id",
                });
            }

            const category = await this._service.getCategoryById(id);

            return res.status(200).json({
                status: "success",
                data: {
                    id: category.id,
                    name: category.name,
                },
            });
        } catch (err) {
            if (err.message === "NOT_FOUND") {
                return res.status(404).json({
                    status: "failed",
                    message: "Category not found",
                });
            }

            return res.status(500).json({
                status: "failed",
                message: "Internal server error",
            });
        }
    };

    updateCategory = async (req, res) => {
        try {
            const { id } = req.params;
            const { name } = req.body || {};

            if (!id) {
                return res.status(400).json({
                    status: "failed",
                    message: "Invalid id",
                });
            }

            if (!name) {
                return res.status(400).json({
                    status: "failed",
                    message: "Invalid payload",
                });
            }

            await this._service.updateCategory(id, { name });

            return res.status(200).json({
                status: "success",
                message: "Category updated",
            });
        } catch (err) {
            if (err.message === "NOT_FOUND") {
                return res.status(404).json({
                    status: "failed",
                    message: "Category not found",
                });
            }

            return res.status(500).json({
                status: "failed",
                message: "Internal server error",
            });
        }
    };

    deleteCategory = async (req, res) => {
        try {
            const { id } = req.params;

            if (!id) {
                return res.status(400).json({
                    status: "failed",
                    message: "Invalid id",
                });
            }

            await this._service.deleteCategory(id);

            return res.status(200).json({
                status: "success",
                message: "Category deleted",
            });
        } catch (err) {
            if (err.message === "NOT_FOUND") {
                return res.status(404).json({
                    status: "failed",
                    message: "Category not found",
                });
            }

            return res.status(500).json({
                status: "failed",
                message: "Internal server error",
            });
        }
    };
}

export default CategoriesHandler;
