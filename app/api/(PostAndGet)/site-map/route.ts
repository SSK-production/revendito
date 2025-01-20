import generateRoute from "@/app/sitemaps/siteMapper";
import {NextResponse} from "next/server";

export async function GET() {
    const routes = await generateRoute();
    return NextResponse.json(routes, {status: 200});

}
