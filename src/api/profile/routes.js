import express from "express";
import ProfileHandler from "./handler.js";
import UserService from "../../services/postgres/UserService.js";
import ApplicationsService from "../../services/postgres/ApplicationsService.js";
import BookmarksService from "../../services/postgres/BookmarksService.js";
import auth from "../../middleware/auth.js";

const router = express.Router();

const userService = new UserService();
const applicationsService = new ApplicationsService();
const bookmarksService = new BookmarksService();
const handler = new ProfileHandler(
    userService,
    applicationsService,
    bookmarksService,
);

// All profile routes require authentication
router.use(auth);

router.get("/profile", handler.getProfileHandler);
router.get("/profile/applications", handler.getMyApplicationsHandler);
router.get("/profile/bookmarks", handler.getMyBookmarksHandler);

export default router;
