import * as checkStatus from "$lib/server/checkStatus/index.js";
import { json } from "@sveltejs/kit";
import "dotenv/config";
import { MongoClient } from "mongodb";

// type uptime = { status: 0 "good" | 1 "warning" | 2 "bad", time: unix timestamp }
const MONGO_URI = process.env.MONGO_URI
const DB = process.env.SITE_DB
const mongoClient = new MongoClient(MONGO_URI)

const status = mongoClient.db(DB).collection("status");

export async function init() {
    checkStatus.main()
}

export async function handle({ event, resolve }) {
    if (event.url.pathname == "/uptime") {
        const content = await status.findOne({})  
        return new json(content)
    }

    const response = await resolve(event)
    return response;
}