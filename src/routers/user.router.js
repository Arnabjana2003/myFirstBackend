import { Router } from "express";
import {
  currentUser,
  getChannel,
  loginUser,
  logoutUser,
  refreshAccessToken,
  registerUser,
  updatePassword,
  updateProfileImage,
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
router.route("/updatepassword").patch(auth,updatePassword)
router.route("/updateProfileImage").patch(upload.single("profileImage"),auth,updateProfileImage)
router.route("/channel/:userName").get(getChannel)

export default router;
