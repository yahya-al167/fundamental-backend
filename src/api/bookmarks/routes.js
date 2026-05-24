import express from "express";
import BookmarksHandler from "./handler.js";
import BookmarksService from "../../services/postgres/BookmarksService.js";
import auth from "../../middleware/auth.js";

const router = express.Router();

const service = new BookmarksService();
const handler = new BookmarksHandler(service);

// GET all bookmarks for logged-in user
router.get("/bookmarks", auth, handler.getBookmarksHandler);

// POST bookmark on job (create)
router.post("/jobs/:jobId/bookmark", auth, handler.postBookmarkHandler);

// GET bookmark detail by ID
router.get("/jobs/:jobId/bookmark/:id", auth, handler.getBookmarkDetailHandler);

// DELETE bookmark by job and user
router.delete(
    "/jobs/:jobId/bookmark",
    auth,
    handler.deleteBookmarkByJobHandler,
);

// Legacy delete by ID (for backward compatibility)
router.delete("/bookmarks/:id", auth, handler.deleteBookmarkHandler);

export default router;
