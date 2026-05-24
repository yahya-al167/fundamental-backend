import express from "express";
import AuthenticationsHandler from "./handler.js";
import AuthenticationsService from "../../services/postgres/AuthenticationsService.js";
import UserService from "../../services/postgres/UserService.js";

const router = express.Router();

const authService = new AuthenticationsService();
const userService = new UserService();
const handler = new AuthenticationsHandler(userService, authService);

router.post("/authentications", handler.postAuthenticationHandler);
router.put("/authentications", handler.putAuthenticationHandler);
router.delete("/authentications", handler.deleteAuthenticationHandler);

export default router;
