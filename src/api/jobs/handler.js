import { nanoid } from "nanoid";

class JobsHandler {
    constructor(service) {
        this._service = service;
    }

    postJobHandler = async (req, res) => {
        try {
            const {
                title,
                description,
                company_id: companyId,
                category_id: categoryId,
            } = req.body || {};

            if (
                !title ||
                typeof title !== "string" ||
                title.trim() === "" ||
                !description ||
                typeof description !== "string" ||
                description.trim() === "" ||
                !companyId ||
                typeof companyId !== "string" ||
                companyId.trim() === "" ||
                !categoryId ||
                typeof categoryId !== "string" ||
                categoryId.trim() === ""
            ) {
                return res.status(400).json({
                    status: "failed",
                    message: "Invalid payload",
                });
            }

            const id = `job-${nanoid(16)}`;

            await this._service.addJob({
                id,
                title: title.trim(),
                description: description.trim(),
                companyId: companyId.trim(),
                categoryId: categoryId.trim(),
            });

            return res.status(201).json({
                status: "success",
                data: { id },
            });
        } catch (err) {
            console.error(err);

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

    getJobsHandler = async (req, res) => {
        try {
            const { title, "company-name": companyName } = req.query;

            let jobs;
            if (title || companyName) {
                jobs = await this._service.searchJobs(title, companyName);
            } else {
                jobs = await this._service.getJobs();
            }

            return res.status(200).json({
                status: "success",
                data: {
                    jobs,
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

    getJobByIdHandler = async (req, res) => {
        try {
            const jobId = req.params.id?.trim();

            if (!jobId) {
                return res.status(400).json({
                    status: "failed",
                    message: "Invalid id",
                });
            }

            const job = await this._service.getJobById(jobId);

            return res.status(200).json({
                status: "success",
                data: {
                    id: job.id,
                    title: job.title,
                    description: job.description,
                    companyId: job.company_id,
                    companyName: job.company_name,
                    categoryId: job.category_id,
                    categoryName: job.category_name,
                },
            });
        } catch (err) {
            if (err.message === "NOT_FOUND") {
                return res.status(404).json({
                    status: "failed",
                    message: "Job not found",
                });
            }

            console.error(err);

            return res.status(500).json({
                status: "failed",
                message: "Internal server error",
            });
        }
    };

    getJobsByCompanyHandler = async (req, res) => {
        try {
            const { companyId } = req.params;

            if (!companyId) {
                return res.status(400).json({
                    status: "failed",
                    message: "Invalid id",
                });
            }

            const jobs = await this._service.getJobsByCompanyId(companyId);

            return res.status(200).json({
                status: "success",
                data: { jobs },
            });
        } catch (err) {
            console.error(err);

            return res.status(500).json({
                status: "failed",
                message: "Internal server error",
            });
        }
    };

    getJobsByCategoryHandler = async (req, res) => {
        try {
            const { categoryId } = req.params;

            if (!categoryId) {
                return res.status(400).json({
                    status: "failed",
                    message: "Invalid id",
                });
            }

            const jobs = await this._service.getJobsByCategoryId(categoryId);

            return res.status(200).json({
                status: "success",
                data: { jobs },
            });
        } catch (err) {
            console.error(err);

            return res.status(500).json({
                status: "failed",
                message: "Internal server error",
            });
        }
    };

    putJobHandler = async (req, res) => {
        try {
            const jobId = req.params.id?.trim();
            if (!jobId) {
                return res.status(400).json({
                    status: "failed",
                    message: "Invalid id",
                });
            }

            const {
                title,
                description,
                companyId: bodyCompanyId,
                categoryId: bodyCategoryId,
                company_id: bodyCompanyIdAlt,
                category_id: bodyCategoryIdAlt,
            } = req.body || {};

            const job = await this._service.getJobById(jobId);

            const updatedTitle =
                typeof title === "string" ? title.trim() : job.title;
            const updatedDescription =
                typeof description === "string"
                    ? description.trim()
                    : job.description;
            const updatedCompanyId =
                typeof bodyCompanyId === "string" && bodyCompanyId.trim() !== ""
                    ? bodyCompanyId.trim()
                    : typeof bodyCompanyIdAlt === "string" &&
                        bodyCompanyIdAlt.trim() !== ""
                      ? bodyCompanyIdAlt.trim()
                      : job.company_id;
            const updatedCategoryId =
                typeof bodyCategoryId === "string" &&
                bodyCategoryId.trim() !== ""
                    ? bodyCategoryId.trim()
                    : typeof bodyCategoryIdAlt === "string" &&
                        bodyCategoryIdAlt.trim() !== ""
                      ? bodyCategoryIdAlt.trim()
                      : job.category_id;

            if (!updatedTitle || !updatedDescription) {
                return res.status(400).json({
                    status: "failed",
                    message: "Invalid payload",
                });
            }

            await this._service.updateJob(jobId, {
                title: updatedTitle,
                description: updatedDescription,
                companyId: updatedCompanyId,
                categoryId: updatedCategoryId,
            });

            return res.status(200).json({
                status: "success",
                message: "Job updated",
            });
        } catch (err) {
            if (err.message === "NOT_FOUND") {
                return res.status(404).json({
                    status: "failed",
                    message: "Job not found",
                });
            }

            if (err.code === "23503") {
                return res.status(400).json({
                    status: "failed",
                    message: "Invalid payload",
                });
            }

            console.error(err);

            return res.status(500).json({
                status: "failed",
                message: "Internal server error",
            });
        }
    };

    deleteJobHandler = async (req, res) => {
        try {
            const jobId = req.params.id?.trim();
            if (!jobId) {
                return res.status(400).json({
                    status: "failed",
                    message: "Invalid id",
                });
            }

            await this._service.deleteJob(jobId);

            return res.status(200).json({
                status: "success",
                message: "Job deleted",
            });
        } catch (err) {
            if (err.message === "NOT_FOUND") {
                return res.status(404).json({
                    status: "failed",
                    message: "Job not found",
                });
            }

            console.error(err);

            return res.status(500).json({
                status: "failed",
                message: "Internal server error",
            });
        }
    };
}

export default JobsHandler;
