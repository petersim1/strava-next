import { decodeJwt, SignJWT } from "jose";
import { StravaOauthI, JWTtoSignI, StravaRefreshI } from "@/types/auth";
import { StravaAthleteI } from "@/types/strava";

const { CLIENT_ID, CLIENT_SECRET, JWT_SECRET } = process.env;

export const signJWTwithInputs = async (
  athlete: StravaAthleteI,
  access_token: string,
  refresh_token: string,
  expires_at: number,
): Promise<string> => {
  const signed = await new SignJWT({
    athlete,
    access_token,
    refresh_token,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(expires_at * 1000)
    .sign(new TextEncoder().encode(JWT_SECRET));
  return signed;
};

export const refreshToken = (token: string): Promise<StravaOauthI> => {
  // This return object doesn't contain "athlete"...
  // will need to inject it into the return object, so I can create a newly signed JWT.

  const decoded = decodeJwt(token);
  const { refresh_token: rToken, athlete } = decoded as JWTtoSignI;

  const urlUse = new URL("https://www.strava.com/oauth/token");
  urlUse.searchParams.set("client_id", CLIENT_ID?.toString() || "");
  urlUse.searchParams.set("client_secret", CLIENT_SECRET?.toString() || "");
  urlUse.searchParams.set("grant_type", "refresh_token");
  urlUse.searchParams.set("refresh_token", rToken);

  return fetch(urlUse, { method: "POST" })
    .then((response) => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then((result: StravaRefreshI) => {
      return {
        ...result,
        athlete,
      };
    });
};

export const refreshAndSign = async (token: string): Promise<string> => {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  const { athlete, refresh_token, access_token, expires_at } = await refreshToken(token);

  const newToken = await signJWTwithInputs(athlete, access_token, refresh_token, expires_at);

  return newToken;
};
