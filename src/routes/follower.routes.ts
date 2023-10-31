import { Router } from "express";
import {
  followStatus,
  countFollowers,
  verifyStatus,
} from "../controllers/follower.controller";

const router = Router();

router.get("/follow/:fromUser/:toUser", followStatus);
router.get("/followCount/:fromUser", countFollowers);
router.get("/followVerify/:fromUser/:toUser", verifyStatus);

export default router;
