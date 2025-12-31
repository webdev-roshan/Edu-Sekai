import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export default function proxy(req: NextRequest) {
    const hostname = req.headers.get('host') || '';

    // If there is a subdomain on port 3000, redirect to the tenant dashboard on port 3555
    const parts = hostname.split('.');
    if (parts.length >= 2 && parts[1].includes('localhost')) {
        const subdomain = parts[0];
        return NextResponse.redirect(new URL(`http://${subdomain}.localhost:3555${req.nextUrl.pathname}`));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/((?!api|_next/static|_next/image|favicon.ico).*)",
    ],
};
