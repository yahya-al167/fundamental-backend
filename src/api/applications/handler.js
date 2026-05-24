import { nanoid } from "nanoid";

class ApplicationsHandler {
    constructor(service) {
        this._service = service;
    }

    postApplicationHandler = async (req, res) => {
        try {
            const jobId = req.body.job_id || req.body.jobId;

            if (!jobId || typeof jobId !== "string" || jobId.trim() === "") {
                return res.status(400).json({
                    status: "failed",
                    message: "Invalid payload",
                });
            }

            const id = `application-${nanoid(16)}`;
            const userId = req.user.id;

            await this._service.addApplication({
                id,
                jobId: jobId.trim(),
                userId,
            });

            return res.status(201).json({
                status: "success",
                data: { id },
            });
        } catch (err) {
            if (err.code === "23503") {
                return res.status(400).json({
                    status: "failed",
                    message: "Invalid payload",
                });
            }

            return res.status(500).json({
                status: "failed",
                message: "Internal server error",
            });
        }
    };

    getApplicationsHandler = async (req, res) => {
        try {
            const applications = await this._service.getApplications();

            return res.status(200).json({
                status: "success",
                data: { applications },
            });
        } catch {
            return res.status(500).json({
                status: "failed",
                message: "Internal server error",
            });
        }
    };

    getApplicationByIdHandler = async (req, res) => {
        try {
            const appId = req.params.id?.trim();

            if (!appId) {
                return res.status(400).json({
                    status: "failed",
                    message: "Invalid id",
                });
            }

            const application = await this._service.getApplicationById(appId);

            return res.status(200).json({
                status: "success",
                data: {
                    id: application.id,
                    jobId: application.job_id,
                    userId: application.user_id,
                    status: application.status,
                },
            });
        } catch (err) {
            if (err.message === "NOT_FOUND") {
                return res.status(404).json({
                    status: "failed",
                    message: "Application not found",
                });
            }

            return res.status(500).json({
                status: "failed",
                message: "Internal server error",
            });
        }
    };

    getApplicationsByJobIdHandler = async (req, res) => {
        try {
            const { jobId } = req.params;

            if (!jobId) {
                return res.status(400).json({
                    status: "failed",
                    message: "Invalid id",
                });
            }

            const applications =
                await this._service.getApplicationsByJobId(jobId);

            return res.status(200).json({
                status: "success",
                data: { applications },
            });
        } catch (err) {
            return res.status(500).json({
                status: "failed",
                message: "Internal server error",
            });
        }
    };

    getApplicationsByUserIdHandler = async (req, res) => {
        try {
            const { userId } = req.params;

            const applications =
                await this._service.getApplicationsByUserId(userId);

            return res.status(200).json({
                status: "success",
                data: { applications },
            });
        } catch {
            return res.status(500).json({
                status: "failed",
                message: "Internal server error",
            });
        }
    };

    putApplicationHandler = async (req, res) => {
        try {
            const { status } = req.body || {};

            if (!status) {
                return res.status(400).json({
                    status: "failed",
                    message: "Invalid payload",
                });
            }

            const application = await this._service.getApplicationById(
                req.params.id,
            );

            if (
                !req.user ||
                (req.user.role !== "admin" &&
                    req.user.id !== application.user_id)
            ) {
                return res.status(403).json({
                    status: "failed",
                    message: "Forbidden",
                });
            }

            await this._service.updateApplication(req.params.id, status);

            return res.status(200).json({
                status: "success",
                message: "Application updated",
            });
        } catch (err) {
            if (err.message === "NOT_FOUND") {
                return res.status(404).json({
                    status: "failed",
                    message: "Application not found",
                });
            }

            return res.status(500).json({
                status: "failed",
                message: "Internal server error",
            });
        }
    };

    deleteApplicationHandler = async (req, res) => {
        try {
            await this._service.deleteApplication(req.params.id);

            return res.status(200).json({
                status: "success",
                message: "Application deleted",
            });
        } catch (err) {
            if (err.message === "NOT_FOUND") {
                return res.status(404).json({
                    status: "failed",
                    message: "Application not found",
                });
            }

            return res.status(500).json({
                status: "failed",
                message: "Internal server error",
            });
        }
    };
}

export default ApplicationsHandler;
