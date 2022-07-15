import * as ejs from "ejs";
import { loadFile, queryFiles } from "./Utils"
import { Codes } from "./Codes";
import type { IncomingMessage, ServerResponse } from "node:http";

class Route {
    protected readonly method: string;
    protected readonly url: string;
    protected readonly __path: string;
    protected readonly view: string;

    constructor(method: string, url: string, view: string) {
        this.method = method;
        this.url = url;
        this.view = view;
        this.__path = this.url.replace(/^((?:(?:\/\w+\/?)+)|\/)\??(?:(?:&?\w+=[^&\s]+)+)?$/, "$1")
    }

    /**
     * @param {string} dir
     * @param {global} data
     * @param {options} options
     *
     * @return {string | null}
     */
    compile(dir: string, data: object, options: object = {}): string | null {
        let file: string | boolean = loadFile(`views/default${(/^\//).test(dir) ? "/" : ""}${dir}`, true);
        if (typeof file == "string") return ejs.render(file, data, options);
        else return null;
    }

    code(code: string, req: IncomingMessage, res: ServerResponse){
        // @ts-ignore
        if (typeof Codes[code] == "function") return Codes[code](req, res);
        else return false;
    }
}

type RouteType = {
    method: string,
    url: string,
    view: string,
    __path: string,
    exec: Function
}

class RoutesManager {
    routes: Array<RouteType> = [];
    constructor() {
        queryFiles("build/routes").forEach((route: string): void => {
            if ((/\/\w+\.\w+\.\w+/).test(route)) return
            try {
                const r = require(`../../${route}`)?.default;
                this.routes.push(new r())
            } catch(err) {
                if (err instanceof Error)
                    console.log(`[\u001b[35mRouteManager\u001b[0m] \u001b[33mThe route "${route}" has been ignored due to an error:\u001b[0m \u001b[31m${err.message}\u001b[0m`)
            }
        });
    }

    execute(req: IncomingMessage, res: ServerResponse, url: string, method: string | undefined): void {
        const route = this.findRoute(url, method);
        if (!route || typeof route.exec !== "function") return Codes["404"](req, res);
        try {
            route.exec.bind(route);
            route.exec({ req, res, url, params: {} });
        } catch(err) { console.log(err); Codes["500"](req, res); }
    }

    findRoute(url: string, method: string | undefined): RouteType | undefined {
        return this.routes.find((r) => (r.method === (method || "GET")) && (r.__path === url));
    }
}

type RouteParams = {
    req: IncomingMessage,
    res: ServerResponse,
    params: object,
    url: string
}

export { Route, RoutesManager, RouteType, RouteParams };