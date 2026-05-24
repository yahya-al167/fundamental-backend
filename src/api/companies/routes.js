import express from "express";
import CompaniesHandler from "./handler.js";
import CompaniesService from "../../services/postgres/CompaniesService.js";
import auth from "../../middleware/auth.js";

const router = express.Router();

const service = new CompaniesService();
const handler = new CompaniesHandler(service);

router.get("/companies", handler.getCompanies);
router.get("/companies/:id", handler.getCompanyById);

router.post("/companies", auth, handler.createCompany);
router.put("/companies/:id", auth, handler.updateCompany);
router.delete("/companies/:id", auth, handler.deleteCompany);

export default router;
