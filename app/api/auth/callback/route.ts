import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { SignJWT } from "jose";

import { StravaOauthI, JWTtoSignI } from "@/types/auth";
const { CLIENT_ID, CLIENT_SECRET, JWT_SECRET } = process.env;

export const GET = async (request: NextRequest): Promise<NextResponse> => {
  const url = new URL(request.url);

  const error = url.searchParams.get("error");
  const code = url.searchParams.get("code");

  const redirectUrl = new URL("/", request.url);

  if (error) {
    redirectUrl.searchParams.set("error", error);
    return NextResponse.redirect(redirectUrl);
  }

  const urlFetch = new URL("https://www.strava.com/oauth/token");
  urlFetch.searchParams.set("client_id", CLIENT_ID?.toString() || "");
  urlFetch.searchParams.set("client_secret", CLIENT_SECRET?.toString() || "");
  urlFetch.searchParams.set("code", code?.toString() || "");
  urlFetch.searchParams.set("grant_type", "authorization_code");

  return fetch(urlFetch, { method: "POST" })
    .then((response) => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
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
