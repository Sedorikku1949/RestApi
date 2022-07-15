import { readdirSync, existsSync, statSync, readFileSync } from "node:fs";
/**
 *
 * @param dir
 * @param {Object} options
 * @param {String} options.extension
 *
 * @return string[]
 */
export const queryFiles = function queryFiles(dir: string, options: { extension: string | boolean | undefined } = { extension: false }): Array<string> {
    if (dir.match(/node_modules/)) return [];
    if (dir.constructor.name !== "String" || !existsSync(dir)) throw new Error("Invalid directory was provided.");
    if (options.constructor.name !== "Object") options = { extension: undefined };
    let filesDir: string[] = [];
    readdirSync(dir).forEach((subdir: string): any => {
        if ((statSync(`${dir}/${subdir}`)).isDirectory()) return queryFiles(dir+"/"+subdir, options).map((d) => filesDir.push(d));
        else if ((new RegExp(`.+\\.${options?.extension || "js"}`)).test(subdir)) filesDir.push(dir+"/"+subdir)
    });
    return filesDir.map((d) => d.replace(/^\.\/\//g, "./"));
};

export const loadFile = function(dir: string, minify: boolean | undefined = true): string | boolean {
    if (!existsSync(dir)) return false;
    else {
        const minifyDir: string = dir.replace(/(\.\w+)$/, ".min.$1");
        if (minify && existsSync(minifyDir)) return readFileSync(minifyDir, "utf-8");
        else return readFileSync(dir, "utf-8");
    }
};
export const allTypes: object = {
    "text/html": ["html"],
    "application/javascript": ["js"],
    "application/pdf": ["pdf"],
    "application/json": ["json"],
    "image/gif": ["gif"],
    "image/jpeg": ["jpeg", "jpg", "jfif"],
    "image/png": ["png"],
    "text/css": ["css"],
    "text/plain": [],
    "video/mp4": ["mp4"],
    "audio/mpeg": ["mp3"]
};