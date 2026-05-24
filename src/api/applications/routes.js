import express from "express";
import ApplicationsHandler from "./handler.js";
import ApplicationsService from "../../services/postgres/ApplicationsService.js";
import auth from "../../middleware/auth.js";

const router = express.Router();
const service = new ApplicationsService();
const handler = new ApplicationsHandler(service);

// More specific routes first to prevent /applications/:id from catching /applications/job/:jobId
router.get(
    "/applications/job/:jobId",
    auth,
    handler.getApplicationsByJobIdHandler,
);
router.get(
    "/applications/user/:userId",
    auth,
    handler.getApplicationsByUserIdHandler,
);

router.get("/applications", auth, handler.getApplicationsHandler);
router.get("/applications/:id", auth, handler.getApplicationByIdHandler);

router.post("/applications", auth, handler.postApplicationHandler);
router.put("/applications/:id", auth, handler.putApplicationHandler);
router.delete("/applications/:id", auth, handler.deleteApplicationHandler);

export default router;
