import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export default function proxy(req: NextRequest) {
    const hostname = req.headers.get('host') || '';

    // If we are on bare localhost:3555 or 127.0.0.1:3555, redirect to landing page
    if (hostname === 'localhost:3555' || hostname === '127.0.0.1:3555') {
        return NextResponse.redirect(new URL('http://localhost:3000'));
    }

    // Ensure there is a subdomain
    const parts = hostname.split('.');
    // parts[0] is subdomain, parts[1] is localhost
    if (parts.length < 2) {
        return NextResponse.redirect(new URL('http://localhost:3000'));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/((?!api|_next/static|_next/image|favicon.ico).*)",
    ],
};
