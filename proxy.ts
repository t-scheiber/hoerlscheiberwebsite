import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export default async function proxy(req: NextRequest) {
  // Hostinger handles HTTPS forcing at the DNS/CDN level
  // This proxy file is kept for future middleware needs
  // Currently just passes through all requests
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|icon.svg|apple-icon.png).*)",
  ],
};

