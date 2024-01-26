import { Router } from "express";
import { registerUser } from "../controllers/user.controller.js";
import { upload } from "../middleware/multer.middleware.js";
const router = Router();

router.route("/register").post(
  upload.fields([
    {
      name: "profileImage",
    },
    {
      name: "coverImage",
    },
  ]),
  registerUser
);

export default router;
