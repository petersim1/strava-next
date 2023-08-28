import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { jwtVerify } from "jose";

import { refreshAndSign } from "@/lib/auth";

const { JWT_SECRET } = process.env;

export const middleware = async (request: NextRequest): Promise<NextResponse> => {
  // Primarily used to handle token refreshing.
  // Don't want to get to a state where the user is logged in for a long duration,
  // their token expired, and we go to call the API. This middleware will make sure
  // that all requests to the api + pages have updated tokens.
  const { value: token } = request.cookies.get("token") ?? { value: undefined };

  const response = NextResponse.next();

  if (!token) {
    // user hasn't oauthed yet, or they revoked it.
    return NextResponse.next();
  }
  // verify token. If it's expired, go through refresh workflow, and reset the cookie.
  try {
    await jwtVerify(token, new TextEncoder().encode(JWT_SECRET));
  } catch (error) {
    const newToken = await refreshAndSign(token);
    response.cookies.set("token", newToken);
  }

  return response;
};

export const config = {
  matcher: ["/", "/api/:path*"],
};
