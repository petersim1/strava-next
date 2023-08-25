import { decodeJwt, SignJWT } from "jose";
import { StravaOauthI, JWTtoSignI, StravaRefreshI } from "@/types/auth";

const { CLIENT_ID, CLIENT_SECRET, JWT_SECRET } = process.env;

export const refreshToken = (token: string): Promise<StravaOauthI> => {
  // This return object doesn't contain "athlete"...
  // will need to inject it into the return object, so I can create a newly signed JWT.

  const decoded = decodeJwt(token);
  const { refresh_token: rToken, athlete } = decoded as JWTtoSignI;

  const url = `https://www.strava.com/oauth/token?client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}&grant_type=refresh_token&refresh_token=${rToken}`;
  return fetch(url, { method: "POST" })
    .then((response) => {
      if (response.ok) {
        return response.json();
      }
      throw new Error("");
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
