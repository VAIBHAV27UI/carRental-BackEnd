import express from "express";
import { createBlog } from "../controller/blog.controller";
import upload from "../middleware/multer";

const router = express.Router();

router.post("/add-blog", upload.single("image"), createBlog);

export default router;


