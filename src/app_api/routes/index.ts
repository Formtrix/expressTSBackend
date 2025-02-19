import { Router } from "express";
import { getData, getHome } from "../controllers/indexController";

const router = Router();

router
    .get("/", getHome);
router
    .get("/data", getData);

export default router;