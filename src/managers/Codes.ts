import type { IncomingMessage, ServerResponse } from "node:http";

export const Codes = {
    "400": function (_req: IncomingMessage, res: ServerResponse){
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
            data: 'Not found'
        }));
    },
    "404": function (_req: IncomingMessage, res: ServerResponse){
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
            data: 'Not found'
        }));
    },
    "500": function (_req: IncomingMessage, res: ServerResponse){
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
            data: 'Error'
        }));
    }
}