import { uploadMusicFile } from "../services/storage.service.js";
import { ObjectId } from "mongodb";
import { connectAndGetMongoDbClient } from "../db/db.js";

export async function createMusic(req, res) {
    const title = req.body.title;
    const file = req.file;

    const musicUploadResult = await uploadMusicFile(file);

    const newMusic = {
        title,
        uri: musicUploadResult.url,
        artist: ObjectId.createFromHexString(req.user.id)
    }

    const client = await connectAndGetMongoDbClient();
    const db = client.db();
    const musicInsertResult = await db.collection("musics").insertOne(newMusic);

    await client.close();

    return res.status(201).json({success: true, music: {
        ...newMusic,
        _id: musicInsertResult.insertedId.toString()
    }});
}