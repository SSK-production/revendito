import path from "path";
import {readdir} from "fs/promises";
import {Dirent} from "fs";

export default async function generateRoutes(): Promise<{name: string; path: string }[]> {
    const pagesDir: string = path.join(process.cwd(), 'app/(pages)');
    const ignored: string[] = ['layout.tsx', 'check-login', 'test', 'offer'];

    try {
        const files: Dirent[] = await readdir(pagesDir, { withFileTypes: true });

        return files
            .filter(file =>
            file.isDirectory() &&
            !ignored.includes(file.name) &&
            !file.name.startsWith('(')
            )
            .map(dir => ({
                name: (dir.name.charAt(0).toUpperCase() + dir.name.slice(1)).replace('-', ' '),
                path: `/${dir.name}`
            }));
    } catch (error) {
        console.error('Error reading pages directory', error);
        return [];
    }
}