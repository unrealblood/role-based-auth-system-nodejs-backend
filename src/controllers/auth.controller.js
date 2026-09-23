import { connectAndGetMongoDbClient } from "../db/db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function registerUser(req, res) {
    const {username, email, password, role="user"} = req.body;

    const client = await connectAndGetMongoDbClient();

    try {
        const db = client.db();

        const user = await db.collection("users").findOne({$or: [{username}, {email}]});
        if(user) {
            return res.status(409).json({message: "User already exists."});
        }

        const hash = await bcrypt.hash(password, 10);

        const newUser = {
            username,
            email,
            password: hash,
            role
        };

        const insertResult = await db.collection("users").insertOne(newUser);

        const token = jwt.sign({id: insertResult.insertedId.toString(), role: newUser.role}, process.env.JWT_SECRET);

        res.cookie("token", token);

        return res.status(201).json({success: true, user: {...newUser, _id: insertResult.insertedId.toString()}});
    }
    catch(error) {
        console.log(error.message);
    }
    finally {
        await client.close();
    }
}

export async function loginUser(req, res) {
    const {username, email, password} = req.body;

    const client = await connectAndGetMongoDbClient();

    try {
        const db = client.db();

        const user = await db.collection("users").findOne({$or: [{username}, {email}]});
        if(!user) {
            return res.status(401).json({message: "Invalid credentials"});
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if(!isPasswordValid) {
            return res.status(401).json({message: "Invalid credentials"});
        }

        const token = jwt.sign({id: user._id.toString(), role: user.role}, process.env.JWT_SECRET);

        res.cookie("token", token);

        return res.status(200).json({success: true, user});
    }
    catch(error) {
        console.log(error.message);
    }
    finally {
        await client.close();
    }
}

export function logoutUser(req, res) {
    res.clearCookie("token");
    res.status(200).json({message: "User logged out successfully"});
}