class ProfileHandler {
    constructor(userService, applicationsService, bookmarksService) {
        this._userService = userService;
        this._applicationsService = applicationsService;
        this._bookmarksService = bookmarksService;
    }

    getProfileHandler = async (req, res) => {
        try {
            const userId = req.user.id;

            const user = await this._userService.getUserById(userId);

            return res.status(200).json({
                status: "success",
                data: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                },
            });
        } catch (err) {
            if (
                err.message === "NOT_FOUND" ||
                err.message === "USER_NOT_FOUND"
            ) {
                return res.status(404).json({
                    status: "failed",
                    message: "User not found",
                });
            }

            return res.status(500).json({
                status: "failed",
                message: "Internal server error",
            });
        }
    };

    getMyApplicationsHandler = async (req, res) => {
        try {
            const userId = req.user.id;

            const applications =
                await this._applicationsService.getApplicationsByUserId(userId);

            return res.status(200).json({
                status: "success",
                data: {
                    applications,
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

    getMyBookmarksHandler = async (req, res) => {
        try {
            const userId = req.user.id;

            const bookmarks = await this._bookmarksService.getBookmarks(userId);

            return res.status(200).json({
                status: "success",
                data: {
                    bookmarks: bookmarks.map((b) => ({
                        id: b.id,
                        jobId: b.job_id,
                    })),
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
}

export default ProfileHandler;
