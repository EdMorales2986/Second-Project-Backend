import { Router } from "express";
import {
  likeStatus,
  countLikes,
  verifyStatus,
} from "../controllers/likes.controller";

const router = Router();

router.get("/like/:user/:id", likeStatus);
router.get("/likeCount/:id", countLikes);
router.get("/likeVerify/:user/:id", verifyStatus);

export default router;
