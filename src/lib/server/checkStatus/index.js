import { SITE_CONFIG, STATUS_CHECKING_CONFIG } from "$lib/config";
import * as path from "path"
import * as fs from "fs"
import "dotenv/config";
import { MongoClient } from "mongodb";

// type uptime = { status: 0 "good" | 1 "warning" | 2 "bad", time: unix timestamp }
let CHECKING_INTERVAL
const MONGO_URI = process.env.MONGO_URI
const DB = process.env.SITE_DB
const mongoClient = new MongoClient(MONGO_URI)

const status = mongoClient.db(DB).collection("status")

const initialDocument = {
	api_uptime: [],
	scraper_uptime: [],
};

export async function main() {
	console.log("Started checkStatus.main");
	if (CHECKING_INTERVAL) {
		clearInterval(CHECKING_INTERVAL);
	}

	const existingDocument = await status.findOne({});
	if (!existingDocument) {
		await status.insertOne(initialDocument);
	}

	await checkStatus();
	CHECKING_INTERVAL = setInterval(
		async () => await checkStatus(),
		STATUS_CHECKING_CONFIG.MILLISECONDS_TIL_NEXT_FETCH
	);
}

async function checkStatus() {
	console.log(`Checking status... (${Date.now()})`);
	await status.updateOne(
		{},
		{
			$push: {
				api_uptime: {
					$each: [await checkAPIStatus()],
					$slice: -STATUS_CHECKING_CONFIG.MAX_LENGTH_UNTIL_DATA_REMOVAL,
				},
				scraper_uptime: {
					$each: [await checkScraperStatus()],
					$slice: -STATUS_CHECKING_CONFIG.MAX_LENGTH_UNTIL_DATA_REMOVAL,
				},
			},
		}
	);
	console.log(`Successfully checked! (${Date.now()})`);
}

async function checkAPIStatus() {
    const timeBeforeFetch = performance.now()
    const res = await fetch(`${SITE_CONFIG.API_ROOT}`)
    const timeAfterFetch = performance.now()

    let uptime = { status: 0, time: Date.now() }

    // If it errors 😱
    if (res.status >= 400) {
        uptime.status = 2
        return uptime 
    }

    // If it takes a long time 🟡
    if (timeAfterFetch - timeBeforeFetch > STATUS_CHECKING_CONFIG.API_WARNING_TIME) {
        uptime.status = 1
        return uptime
    }

    // If its fine 🟢
    return uptime
}

async function checkScraperStatus() {
	const query = { scraper_uptime: { $exists: true } };
	const projection = {
		_id: 0,
		lastScraperUptime: { $last: "$scraper_uptime" },
	};
	const scraperUptimeResult = await status
		.aggregate([{ $match: query }, { $project: projection }])
		.toArray();
	const scraperUptime =
		scraperUptimeResult.length > 0
			? scraperUptimeResult[0].lastScraperUptime
			: null;
	const res = await fetch(`${SITE_CONFIG.API_ROOT}top/1`);
	const current_last_scraped = (await res.json())[0].last_scraped;
	const last_status = scraperUptime;
	let uptime = {
		status: 0,
		last_scraped: current_last_scraped,
		fetchTries: last_status ? last_status.fetchTries : 0,
		time: Date.now(),
	};
	// If there's no last scraped entry on status data 🟢
	if (!last_status) return uptime;
	// If db last scraped does not equal our last scraped 🟢
	if (current_last_scraped != last_status.last_scraped) {
		uptime.fetchTries = 0;
		return uptime;
	}
	if (current_last_scraped == last_status.last_scraped) {
		uptime.fetchTries++;
		// If db last scraped is equal to our last scraped, maybe we checked too early 🟡
		if (uptime.fetchTries == 1) {
			uptime.status = 1;
			// If db last scraped still is equal to our last scraped 😱
		} else if (uptime.fetchTries > 1) {
			uptime.status = 2;
		}
		return uptime;
	}
}