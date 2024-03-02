import express from "express";
import { Register, getMyProfile, login } from "../controllers/user.js";
import { isAuthenticated } from "../middleware/auth.js";

const router = express.Router();

router.post("/new", Register);
router.post("/login", login);
router.get("/me", isAuthenticated, getMyProfile);

export default router;
