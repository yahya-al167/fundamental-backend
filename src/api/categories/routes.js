import express from "express";
import CategoriesHandler from "./handler.js";
import CategoriesService from "../../services/postgres/CategoriesService.js";
import auth from "../../middleware/auth.js";

const router = express.Router();

const service = new CategoriesService();
const handler = new CategoriesHandler(service);

router.get("/categories", handler.getCategories);
router.get("/categories/:id", handler.getCategoryById);

router.post("/categories", auth, handler.createCategory);
router.put("/categories/:id", auth, handler.updateCategory);
router.delete("/categories/:id", auth, handler.deleteCategory);

export default router;
