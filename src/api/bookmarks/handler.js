import { nanoid } from "nanoid";

class BookmarksHandler {
    constructor(service) {
        this._service = service;
    }

    postBookmarkHandler = async (req, res) => {
        try {
            const { jobId } = req.params;
            const userId = req.user.id;

            if (!jobId) {
                return res.status(400).json({
                    status: "failed",
                    message: "Invalid payload",
                });
            }

            const id = `bookmark-${nanoid(16)}`;

            await this._service.addBookmark({
                id,
                jobId,
                userId,
            });

            return res.status(201).json({
                status: "success",
                data: { id },
            });
        } catch (err) {
            console.log(err);

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

    getBookmarksHandler = async (req, res) => {
        try {
            const bookmarks = await this._service.getBookmarks(req.user.id);

            return res.status(200).json({
                status: "success",
                data: {
                    bookmarks: bookmarks.map((b) => ({
                        id: b.id,
                        jobId: b.job_id,
                    })),
                },
            });
        } catch {
            return res.status(500).json({
                status: "failed",
                message: "Internal server error",
            });
        }
    };

    getBookmarkDetailHandler = async (req, res) => {
        try {
            const { id, jobId } = req.params;

            if (!id || !jobId) {
                return res.status(400).json({
                    status: "failed",
                    message: "Invalid id",
                });
            }

            const bookmark = await this._service.getBookmarkById(id);

            if (bookmark.job_id !== jobId) {
                return res.status(404).json({
                    status: "failed",
                    message: "Bookmark not found",
                });
            }

            return res.status(200).json({
                status: "success",
                data: {
                    id: bookmark.id,
                    jobId: bookmark.job_id,
                    userId: bookmark.user_id,
                },
            });
        } catch (err) {
            if (err.message === "NOT_FOUND") {
                return res.status(404).json({
                    status: "failed",
                    message: "Bookmark not found",
                });
            }

            return res.status(500).json({
                status: "failed",
                message: "Internal server error",
            });
        }
    };

    deleteBookmarkByJobHandler = async (req, res) => {
        try {
            const { jobId } = req.params;
            const userId = req.user.id;

            if (!jobId) {
                return res.status(400).json({
                    status: "failed",
                    message: "Invalid id",
                });
            }

            await this._service.deleteBookmarkByJob(jobId, userId);

            return res.status(200).json({
                status: "success",
                message: "Bookmark deleted",
            });
        } catch (err) {
            if (err.message === "NOT_FOUND") {
                return res.status(404).json({
                    status: "failed",
                    message: "Bookmark not found",
                });
            }

            return res.status(500).json({
                status: "failed",
                message: "Internal server error",
            });
        }
    };

    deleteBookmarkHandler = async (req, res) => {
        try {
            const { id } = req.params;

            if (!id) {
                return res.status(400).json({
                    status: "failed",
                    message: "Invalid id",
                });
            }

            await this._service.deleteBookmark(id, req.user.id);

            return res.status(200).json({
                status: "success",
                message: "Bookmark deleted",
            });
        } catch (err) {
            if (err.message === "NOT_FOUND") {
                return res.status(404).json({
                    status: "failed",
                    message: "Bookmark not found",
                });
            }

            return res.status(500).json({
                status: "failed",
                message: "Internal server error",
            });
        }
    };
}

export default BookmarksHandler;
