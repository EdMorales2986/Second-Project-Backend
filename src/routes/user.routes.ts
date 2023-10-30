import { Router } from "express";
import {
  signIn,
  signUp,
  deleteUser,
  updateInfo,
  updateBio,
} from "../controllers/user.controllers";
import passport from "passport";

const router = Router();

router.post(
  "/jwt-verify",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.json({ state: true });
  }
);

router.post("/signup", signUp);
router.post("/signin", signIn);
router.delete("/:user/delete", deleteUser);
router.put("/:user/update", updateInfo);
router.put("/:user/updateBio", updateBio);

export default router;
