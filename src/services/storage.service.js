import ImageKit from "@imagekit/nodejs";

const client = new ImageKit({
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY
});


export async function uploadMusicFile(file) {
    try {
        const result = await client.files.upload({
            file: file.buffer.toString("base64"),
            fileName: "music_" + Date.now().toString(),
            folder: "role-based-auth-system-nodejs-backend-project/music"
        });

        return result
    }
    catch(error) {
        console.log(error.message);
    }
}