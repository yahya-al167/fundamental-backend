import express from "express";
import UsersHandler from "./handler.js";
import UserService from "../../services/postgres/UserService.js";

const router = express.Router();

const userService = new UserService();
const handler = new UsersHandler(userService);

router.post("/users", handler.postUserHandler);
router.get("/users/:id", handler.getUserByIdHandler);

export default router;
