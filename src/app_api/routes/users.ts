import { Router } from "express";

// Import the functions from the userController
import { getUser, createUser } from "../controllers/userController";

const router = Router();

router
    .get("/", getUser);
router
    .post("/", createUser);

export default router;