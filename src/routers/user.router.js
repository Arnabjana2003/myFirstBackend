import { Router } from "express";
import {
  currentUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  registerUser,
  updatePassword,
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
router.route("/refresh-tokens").post(refreshAccessToken)
router.route("/currentuser").post(auth,currentUser)
router.route("/updatepassword").post(auth,updatePassword)

export default router;
