import express from "express";
import JobsHandler from "./handler.js";
import JobService from "../../services/postgres/JobService.js";
import auth from "../../middleware/auth.js";

const router = express.Router();
const service = new JobService();
const handler = new JobsHandler(service);

router.get("/jobs", handler.getJobsHandler);
router.get("/jobs/company/:companyId", handler.getJobsByCompanyHandler);
router.get("/jobs/category/:categoryId", handler.getJobsByCategoryHandler);
router.get("/jobs/:id", handler.getJobByIdHandler);

router.post("/jobs", auth, handler.postJobHandler);
router.put("/jobs/:id", auth, handler.putJobHandler);
router.delete("/jobs/:id", auth, handler.deleteJobHandler);

export default router;
