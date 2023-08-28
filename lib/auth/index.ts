import { decodeJwt, SignJWT } from "jose";
import { StravaOauthI, JWTtoSignI, StravaRefreshI } from "@/types/auth";

const { CLIENT_ID, CLIENT_SECRET, JWT_SECRET } = process.env;

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
  const {
    athlete,
    refresh_token: rToken,
    access_token: aToken,
    expires_at: exp,
  } = await refreshToken(token);

  const newToken = await new SignJWT({
    athlete,
    refresh_token: rToken,
    access_token: aToken,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(exp * 1000)
    .sign(new TextEncoder().encode(JWT_SECRET));

  return newToken;
};
