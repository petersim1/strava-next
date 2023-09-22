import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { StravaOauthI } from "@/_types/auth";
import { signJWTwithInputs } from "@/_lib/auth";
import { RequestError } from "@/_lib/errors";
const { CLIENT_ID, CLIENT_SECRET } = process.env;

export const GET = async (request: NextRequest): Promise<NextResponse> => {
  const url = new URL(request.nextUrl);
  const { error, code } = Object.fromEntries(url.searchParams.entries());

  const redirectUrl = new URL("/", request.nextUrl);

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
      throw new RequestError(response.statusText, response.status);
    })
    .then((result: StravaOauthI) => {
      // eslint-disable-next-line @typescript-eslint/naming-convention
      const { athlete, refresh_token, access_token, expires_at } = result;
      return signJWTwithInputs(athlete, access_token, refresh_token, expires_at);
    })
    .then((token) => {
      const res = NextResponse.redirect(redirectUrl);
      res.cookies.set("X-STRAVA-JWT", token);
      return res;
    })
    .catch((err: RequestError) => {
      console.log(err);
      return NextResponse.redirect(redirectUrl, { status: err.status, statusText: err.message });
    });
};
