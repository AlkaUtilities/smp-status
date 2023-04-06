import { glob } from "glob";
import path from "path";

export async function deleteCachedFile(file: string) {
    const filePath = path.resolve(file);
    if (require.cache[filePath]) {
        delete require.cache[filePath];
    }
}

export async function loadFiles(dirName: string) {
    try {
        const files = await glob(
            path.join(process.cwd(), dirName, "**/*.ts").replace(/\\/g, "/")
        );
        const tsFiles = files.filter((file) => path.extname(file) === ".ts");
        await Promise.all(tsFiles.map(deleteCachedFile));
        return tsFiles;
    } catch (err) {
        console.log(
            `[ERROR] Unable to load files from directory: ${dirName}\n${err}`
        );
        throw err;
    }
}
