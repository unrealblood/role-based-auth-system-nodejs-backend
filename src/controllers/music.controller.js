import jwt from "jsonwebtoken";
import { uploadMusicFile } from "../services/storage.service.js";
import { ObjectId } from "mongodb";
import { connectAndGetMongoDbClient } from "../db/db.js";

export async function createMusic(req, res) {
    const token = req.cookies.token;

    if(!token) {
        return res.status(401).json({message: "Unauthorized"});
    }

    const client = await connectAndGetMongoDbClient();

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if(decoded.role !== "artist") {
            return res.status(403).json({message: "Forbidden"});
        }

        const title = req.body.title;
        const file = req.file;

        const musicUploadResult = await uploadMusicFile(file);

        const newMusic = {
            title,
            uri: musicUploadResult.url,
            artist: ObjectId.createFromHexString(decoded.id)
        }

        const db = client.db();
        const musicInsertResult = await db.collection("musics").insertOne(newMusic);

        return res.status(201).json({success: true, music: {
            ...newMusic,
            _id: musicInsertResult.insertedId.toString()
        }});
    }
    catch(error) {
        return res.status(401).json({message: "Invalid token"});
    }
    finally {
        await client.close();
    }
}