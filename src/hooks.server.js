import * as fs from 'node:fs'
import * as path from 'node:path'

const configShape = {
	API_ROOT: "", // PROD: "https://api.legiti.dev"
	SITE_ROOT: "", // PROD: "https://legiti.dev/"
	MCAUTH: {
		CLIENT_ID: "", // PROD: 3547577294300120212
		REDIRECT_URI: "", // PROD: https://legiti.dev/api/profile/login
	},
	LATEST_LEGITIMOOSE_VERSION: "",
};

const configPath = path.join(import.meta.dirname, "./lib/config.json");

if (fs.existsSync(configPath)) {
    console.log("Config file already exists.");
} else {
    await fs.writeFile(configPath, JSON.stringify(configShape, null, 2), { flag: "w+" }, err => {
        if (err) {
            console.error(err);
        } else {
            console.log("Created config file")
        }
    })
}