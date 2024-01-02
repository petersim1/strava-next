import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { jwtVerify } from "jose";

import { refreshAndSign } from "@/_lib/auth";

const { JWT_SECRET } = process.env;

export const middleware = async (request: NextRequest): Promise<NextResponse> => {
  // Primarily used to handle token refreshing.
  // Don't want to get to a state where the user is logged in for a long duration,
  // their token expired, and we go to call the API. This middleware will make sure
  // that all requests to the api + pages have updated tokens.
  const { value: token } = request.cookies.get("X-STRAVA-JWT") ?? { value: undefined };
  const response = NextResponse.next();

  if (!token) {
    // user hasn't oauthed yet, or they revoked it.
    if (request.nextUrl.pathname == "/") {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    return response;
  }
  // verify token. If it's expired, go through refresh workflow, and reset the cookie.
  try {
    await jwtVerify(token, new TextEncoder().encode(JWT_SECRET));
  } catch (error) {
    try {
      const newToken = await refreshAndSign(token);
      if (request.nextUrl.pathname == "/login") {
        const responseRedir = NextResponse.redirect(new URL("/", request.url));
        responseRedir.cookies.set("X-STRAVA-JWT", newToken);
        return responseRedir;
      }
      response.cookies.set("X-STRAVA-JWT", newToken);
      console.log("expired, refreshed");
      return response;
    } catch (error2) {
      // catch the case where the refresh-token is invalid. Just remove it and force
      // a new connection.
      console.log(error2);
      if (request.nextUrl.pathname == "/") {
        const responseRedir = NextResponse.redirect(new URL("/login", request.url));
        responseRedir.cookies.delete("X-STRAVA-JWT");
        return responseRedir;
      }
      response.cookies.delete("X-STRAVA-JWT");
      return response;
    }
  }

  if (request.nextUrl.pathname == "/login") {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return response;
};

export const config = {
  matcher: ["/", "/login", "/api/:path*"],
};
