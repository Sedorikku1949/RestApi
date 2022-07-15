// @ts-ignore
import { Route, RouteParams } from "../../build/managers/Routes";

const PARAMS = {
    method: "GET",
    url: "/test",
    view: "/test.ejs"
}

class Test extends Route {
    protected readonly method: string;
    protected readonly url: string;
    protected readonly __path: string;
    protected readonly view: string;

    constructor() {
        super(PARAMS["method"], PARAMS["url"], PARAMS["view"]);
        this.method = PARAMS["method"];
        this.url = PARAMS["url"];
        this.view = PARAMS["view"];
        this.__path = this.url.replace(/^((?:(?:\/\w+\/?)+)|\/)\??(?:(?:&?\w+=[^&\s]+)+)?$/, "$1")
    }

    exec({ res }: RouteParams): void {
        const view = super.compile(this.view, {
            text: "Hello World!"
        }, {});
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(view);
    }
}

export default Test;
export { PARAMS };