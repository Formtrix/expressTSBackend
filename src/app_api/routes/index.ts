import { Router } from "express";
import { home } from "../controllers/homeController";
import { getData } from "../controllers/dataController";

const router = Router();

router
    .get("/", home);
router
    .get("/data", getData);

export default router;