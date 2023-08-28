import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { SignJWT } from "jose";

import { StravaOauthI, JWTtoSignI } from "@/types/auth";
const { CLIENT_ID, CLIENT_SECRET, JWT_SECRET } = process.env;

export const POST = async (request: NextRequest): Promise<NextResponse> => {
  const { cookies } = request;
  const url = new URL(request.url);

  const urlFetch = "https://www.strava.com/oauth/deauthorize";

  return fetch(urlFetch, { method: "POST" })
    .then((response) => {
      if (response.ok) {
        return response.json();
      }
      throw response;
    })
    .then((result: StravaOauthI) => {
      const obj: JWTtoSignI = {
        athlete: result.athlete,
        refresh_token: result.refresh_token,
        access_token: result.access_token,
      };
      return new SignJWT({ ...obj })
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime(result.expires_at * 1000)
        .sign(new TextEncoder().encode(JWT_SECRET));
    })
    .then((token) => {
      const res = NextResponse.redirect(redirectUrl);
      res.cookies.set("token", token);
      return res;
    })
    .catch((err) => {
      console.log(err);
      return NextResponse.redirect(redirectUrl, { status: 401 });
    });
};
