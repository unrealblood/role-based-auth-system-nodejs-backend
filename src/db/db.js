import { MongoClient } from "mongodb";

export async function connectAndGetMongoDbClient() {
    try {
        return await MongoClient.connect(process.env.MONGODB_CONNECTION_URL);
    }
    catch(error) {
        console.log("Failed to connect to MongoDb: " + error.message);
    }
}