import { Router } from "express";
import {
  loginUser,
  logoutUser,
  refreshAccessToken,
  registerUser,
} from "../controllers/user.controller.js";
import { upload } from "../middleware/multer.middleware.js";
import auth from "../middleware/auth.middleware.js";
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
router.route("/login").post(loginUser);
router.route("/logout").post(auth, logoutUser);
router.route("/refreshtokens").post(refreshAccessToken)

export default router;
