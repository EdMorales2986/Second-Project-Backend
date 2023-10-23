import { Router } from "express";
import {
  signIn,
  signUp,
  deleteUser,
  updateInfo,
} from "../controllers/auth.controllers";
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
router.delete("/signin/:user/delete", deleteUser);

router.put("/signin/:user/update", updateInfo);

export default router;
