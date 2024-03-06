import express from "express";
import { Register, getMyProfile, login, updatePassword } from "../controllers/user.js";
import { isAuthenticated } from "../middleware/auth.js";

const router = express.Router();

router.post("/new", Register);
router.post("/login", login);
router.post('/update-password', updatePassword);
router.get("/me", isAuthenticated, getMyProfile);

export default router;
