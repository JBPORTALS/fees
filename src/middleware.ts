import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getIronSession } from "iron-session";
import { sessionOptions, SessionData } from "@/utils/session";

export default async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  // const session = await getIronSession<SessionData>(req, res, sessionOptions);

  return res;
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
