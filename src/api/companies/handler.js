import { nanoid } from "nanoid";

class CompaniesHandler {
    constructor(service) {
        this._service = service;
    }

    createCompany = async (req, res) => {
        try {
            const { name, description } = req.body || {};

            if (
                !name ||
                typeof name !== "string" ||
                name.trim() === "" ||
                (description && typeof description !== "string")
            ) {
                return res.status(400).json({
                    status: "failed",
                    message: "Invalid payload",
                });
            }

            const id = `company-${nanoid(16)}`;

            await this._service.addCompany({
                id,
                name: name.trim(),
                description,
            });

            return res.status(201).json({
                status: "success",
                data: { id },
            });
        } catch (err) {
            console.error(err);

            return res.status(500).json({
                status: "failed",
                message: "Internal server error",
            });
        }
    };

    getCompanies = async (req, res) => {
        try {
            const companies = await this._service.getCompanies();

            return res.status(200).json({
                status: "success",
                data: {
                    companies,
                },
            });
        } catch (err) {
            console.error(err);

            return res.status(500).json({
                status: "failed",
                message: "Internal server error",
            });
        }
    };

    getCompanyById = async (req, res) => {
        try {
            const company = await this._service.getCompanyById(req.params.id);

            return res.status(200).json({
                status: "success",
                data: {
                    id: company.id,
                    name: company.name,
                    description: company.description,
                },
            });
        } catch (err) {
            if (err.message === "NOT_FOUND") {
                return res.status(404).json({
                    status: "failed",
                    message: "Company not found",
                });
            }

            return res.status(500).json({
                status: "failed",
                message: "Internal server error",
            });
        }
    };

    updateCompany = async (req, res) => {
        try {
            const { name, description } = req.body || {};

            if (
                !name ||
                typeof name !== "string" ||
                name.trim() === "" ||
                (description && typeof description !== "string")
            ) {
                return res.status(400).json({
                    status: "failed",
                    message: "Invalid payload",
                });
            }

            await this._service.updateCompany(req.params.id, {
                name: name.trim(),
                description,
            });

            return res.status(200).json({
                status: "success",
                message: "Company updated",
            });
        } catch (err) {
            if (err.message === "NOT_FOUND") {
                return res.status(404).json({
                    status: "failed",
                    message: "Company not found",
                });
            }

            return res.status(500).json({
                status: "failed",
                message: "Internal server error",
            });
        }
    };

    deleteCompany = async (req, res) => {
        try {
            await this._service.deleteCompany(req.params.id);

            return res.status(200).json({
                status: "success",
                message: "Company deleted",
            });
        } catch (err) {
            if (err.message === "NOT_FOUND") {
                return res.status(404).json({
                    status: "failed",
                    message: "Company not found",
                });
            }

            return res.status(500).json({
                status: "failed",
                message: "Internal server error",
            });
        }
    };
}

export default CompaniesHandler;
