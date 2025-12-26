import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export default function proxy(req: NextRequest) {
    const url = req.nextUrl;

    // Get hostname (e.g., school.localhost:3000 -> school.localhost)
    let hostname = req.headers.get("host") || "";

    // Remove port if exists
    hostname = hostname.split(":")[0];

    // Define main domain (localhost in dev, yourwebsite.com in prod)
    // NOTE: In production you should likely read this from env
    const currentHost = process.env.NODE_ENV === "production"
        ? "schoolsansar.com"
        : "localhost";

    // Check if subdomain exists
    // If hostname is "localhost" -> no subdomain
    // If hostname is "school.localhost" -> subdomain is "school"
    const isMainDomain = hostname === currentHost;

    // Extract subdomain
    const subdomain = isMainDomain ? null : hostname.replace(`.${currentHost}`, "");

    // Ignore internal paths
    if (url.pathname.startsWith('/_next') || url.pathname.startsWith('/api') || url.pathname.includes('.')) {
        return NextResponse.next();
    }

    const searchParams = req.nextUrl.searchParams.toString();
    // Get the path (e.g. /login, /dashboard)
    const path = `${url.pathname}${searchParams.length > 0 ? `?${searchParams}` : ""
        }`;

    // 1. If it's the main domain (localhost:3000), rewrite to (marketing)
    if (isMainDomain) {
        // Do not rewrite to /(marketing) as that triggers the [domain] route.
        // Just let Next.js handle it. The (marketing) route group is at the root.
        return NextResponse.next();
    }

    // 2. If it's a subdomain (school.localhost:3000), rewrite to (platform)/[domain]
    if (subdomain) {
        // Rewrite to / (platform) / [domain] / path
        // e.g. school.localhost:3000/login -> /(platform)/school/login
        return NextResponse.rewrite(
            new URL(`/(platform)/${subdomain}${path === "/" ? "" : path}`, req.url)
        );
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/((?!api|_next/static|_next/image|favicon.ico).*)",
    ],
};
