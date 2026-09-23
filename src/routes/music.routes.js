import { Router } from "express";
import multer from "multer";
import { createMusic } from "../controllers/music.controller.js";
import { authArtist } from "../middlewares/auth.middleware.js";

export const musicRouter = Router();

const upload = multer({storage: multer.memoryStorage()});

musicRouter.post("/create-music", authArtist, upload.single("file"), createMusic);