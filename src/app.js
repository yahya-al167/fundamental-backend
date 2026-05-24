import express from "express";
import usersRoutes from "./api/users/routes.js";
import authRoutes from "./api/authentications/routes.js";
import jobsRoutes from "./api/jobs/routes.js";
import companiesRoutes from "./api/companies/routes.js";
import categoriesRoutes from "./api/categories/routes.js";
import aplicationsRoutes from "./api/applications/routes.js";
import bookmarksRoutes from "./api/bookmarks/routes.js";
import documentsRoutes from "./api/documents/routes.js";
import profileRoutes from "./api/profile/routes.js";

const app = express();

app.use(express.json());

app.use(usersRoutes);
app.use(authRoutes);
app.use(companiesRoutes);
app.use(categoriesRoutes);
app.use(jobsRoutes);
app.use(aplicationsRoutes);
app.use(bookmarksRoutes);
app.use(documentsRoutes);
app.use(profileRoutes);

app.get("/", (req, res) => {
    res.json({
        status: "success",
        message: "API running",
    });
});
app.use((req, res) => {
    return res.status(404).json({
        status: "failed",
        message: "Route not found",
    });
});

export default app;
