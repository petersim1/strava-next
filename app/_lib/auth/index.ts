/* eslint-disable @typescript-eslint/naming-convention */
import { decodeJwt, SignJWT } from "jose";

import { StravaOauthI, JWTtoSignI, StravaRefreshI } from "@/_types/auth";
import { StravaAthleteI } from "@/_types/strava";
import { RequestError } from "@/_lib/errors";

const { CLIENT_SECRET, JWT_SECRET } = process.env;

export const signJWTwithInputs = async (
  athlete: StravaAthleteI,
  access_token: string,
  refresh_token: string,
  expires_at: number,
): Promise<string> => {
  // don't need to multiply exp by 1000 here. jose expects this exact structure.
  // I'll subtract 10s to be safe...
  const signed = await new SignJWT({
    athlete,
    access_token,
    refresh_token,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(expires_at - 10)
    .sign(new TextEncoder().encode(JWT_SECRET));
  return signed;
};

export const refreshToken = (token: string): Promise<StravaOauthI> => {
  // This return object doesn't contain "athlete"...
  // will need to inject it into the return object, so I can create a newly signed JWT.

  const decoded = decodeJwt(token);
  const { refresh_token, athlete } = decoded as JWTtoSignI;

  const urlUse = new URL("https://www.strava.com/oauth/token");
  urlUse.searchParams.set("client_id", process.env.NEXT_PUBLIC_CLIENT_ID?.toString() || "");
  urlUse.searchParams.set("client_secret", CLIENT_SECRET?.toString() || "");
  urlUse.searchParams.set("grant_type", "refresh_token");
  urlUse.searchParams.set("refresh_token", refresh_token);

  return fetch(urlUse, { method: "POST" })
    .then((response) => {
      if (response.ok) {
        return response.json();
      }
      throw new RequestError(response.statusText, response.status);
    })
    .then((result: StravaRefreshI) => {
      return {
        ...result,
        athlete,
      };
    });
};

export const refreshAndSign = async (token: string): Promise<string> => {
  const { athlete, refresh_token, access_token, expires_at } = await refreshToken(token);

  const newToken = await signJWTwithInputs(athlete, access_token, refresh_token, expires_at);

  return newToken;
};
