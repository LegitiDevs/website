import Fastify from "fastify";
import fastifyStatic from "@fastify/static";
import CONFIG from "./config.json" with { type: "json" };
import path from "path";
import { readdirSync } from "node:fs"

const __dirname = import.meta.dirname;
const PUBLIC_FOLDER = path.join(__dirname, "public");

const fastify = Fastify({
    logger: false,
});

fastify.register(fastifyStatic, {
    root: PUBLIC_FOLDER,
});

// The whole purpose of this is to get rid of the ugly .html extension lol.
// You can now specify the main page using configs.
function routePages() {
    const pages = readdirSync(path.join(PUBLIC_FOLDER, "pages")).map((page) => page.replace(".html", ""));
    
    for (let page of pages) {
        if (page == CONFIG.mainPage) {
            fastify.get(`/`, (req, res) => {
                res.sendFile(`pages/${page}.html`)
            })
        } else {
            fastify.get(`/${page}`, (req, res) => {
                res.sendFile(`pages/${page}.html`)
            })
        }
    }
}

routePages()

fastify.listen({ port: CONFIG.port }, function (err, address) {
    if (err) {
        fastify.log.error(err);
        process.exit(1);
    }
});
