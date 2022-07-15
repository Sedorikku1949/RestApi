import { existsSync, readFileSync} from "node:fs";
import events from "node:events";
import { port, domain } from "../config.json";
import { IncomingMessage, ServerResponse, createServer } from "node:http";

import { allTypes } from "./Utils";
import { Codes } from "./Codes";
import { RoutesManager } from "./Routes";

// @ts-ignore
const rateLimit = new Map();

class ApiManager extends events {
    private server: any;
    private readonly port: number;
    private readonly domain: string;
    RoutesManager: RoutesManager;

    constructor() {
        super();
        this.server = createServer((req: IncomingMessage, res: ServerResponse): void => this.execute(req, res));
        this.port = Number(port);
        this.domain = domain;
        this.RoutesManager = new RoutesManager();
    }

    start(): boolean {
        this.server.listen(this.port, () => console.log(`[\u001b[35mRest\u001b[0m] \u001b[34mListening on port\u001b[0m \u001b[33mhttp://${this.domain}:${this.port}\u001b[0m`));
        return true;
    }

    log(req: IncomingMessage, res: ServerResponse): void {
        console.log(`[\u001b[35mRequest\u001b[0m] HTTP/${req.httpVersion} -- \u001b[31m${res.statusCode}\u001b[0m \u001b[36m${req.method}\u001b[0m \u001b[34m${req.url}\u001b[0m -- \u001b[33m${req.socket.remoteAddress || "Unknown"}\u001b[0m `);
        return void 0;
    }

    execute(req: IncomingMessage, res: ServerResponse): void {
        const { url, method } = req;
        // @ts-ignore
        const ip = req.socket.remoteAddress;
        if (!url || res.writableEnded) return;

        if (method === "GET" && (/\/cdn\/(\w+\/?)*/).test(<string>url)) {
            // cdn route
            const cdnUrl: string = url.replace(/^\//, "");
            try {
                if (!existsSync(cdnUrl)) {
                    res.writeHead(404, { "Content-Type": "application/json" });
                    res.end(JSON.stringify({
                        code: 404,
                        message: "The ressource was not found.",
                        url
                    }));
                    this.log(req, res);
                } else {
                    const buff: Buffer = readFileSync(cdnUrl);

                    // define contentType for response
                    const contentType: string | boolean = (Object.entries(allTypes).map(t => t[1].includes(url.match(/\.([A-Za-z0-9\.]+)$/gm)?.[0]?.slice(1)) ? t[0] : false).filter(Boolean)[0] ?? "text/plain")
                    if (contentType) res.writeHead(200, { "Content-Type": contentType });

                    res.end(buff);
                    this.log(req, res);
                }
            } catch (err){
                console.log(err);
                Codes["500"](req, res);
                this.log(req, res);
            }
        } else {
            // another route
            this.RoutesManager.execute(req, res, url, req.method);
            this.log(req, res);
        }
    }
}

export default ApiManager;