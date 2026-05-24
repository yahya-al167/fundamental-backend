import express from "express";
import DocumentsHandler from "./handler.js";
import DocumentsService from "../../services/postgres/DocumentsService.js";
import auth from "../../middleware/auth.js";
import upload from "../../middleware/upload.js";

const router = express.Router();

const service = new DocumentsService();
const handler = new DocumentsHandler(service);

// Public endpoints
router.get("/documents", handler.getDocumentsHandler);
router.get("/documents/:id", handler.getDocumentByIdHandler);

// Protected endpoints
router.post(
    "/documents",
    auth,
    upload.single("document"), // 🔥 penting
    handler.postDocumentHandler,
);

router.delete("/documents/:id", auth, handler.deleteDocumentHandler);

export default router;
