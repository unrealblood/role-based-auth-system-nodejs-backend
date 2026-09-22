import { Router } from "express";
import multer from "multer";
import { createMusic } from "../controllers/music.controller.js";

export const musicRouter = Router();

const upload = multer({storage: multer.memoryStorage()});

musicRouter.post("/create-music", upload.single("file"), createMusic);