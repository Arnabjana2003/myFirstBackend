import { Router } from "express";
import auth from "../middleware/auth.middleware.js";
import { subscribe } from "../controllers/subscription.controller.js";

const router = Router()

router.route("/subscribe").post(auth,subscribe);

export default router;