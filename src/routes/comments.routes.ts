import { Router } from "express";
import {
  createComment,
  deleteComment,
  getAllComments,
  modifyComment,
  likeStatus,
  countLikes,
  verifyStatus,
} from "../controllers/comments.controller";

const router = Router();

router.get("/showAllComments", getAllComments);
router.post("/createComment/:user/:father", createComment);
router.delete("/deleteComment/:user/:id", deleteComment);
router.put("/modifyComment/:user/:id", modifyComment);
router.get("/commentLike/:user/:id", likeStatus);
router.get("/commentLikeCount/:id", countLikes);
router.get("/commentLikeVerify/:user/:id", verifyStatus);

export default router;
