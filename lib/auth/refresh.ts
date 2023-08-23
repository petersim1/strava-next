import { decodeJwt } from "jose";
import { StravaOauthI, JWTtoSignI, StravaRefreshI } from "@/types/strava";

const { CLIENT_ID, CLIENT_SECRET } = process.env;

export default (token: string): Promise<StravaOauthI> => {
  // This return object doesn't contain "athlete"...
  // will need to inject it into the return object, so I can create a newly signed JWT.

  const decoded = decodeJwt(token);
  const { refresh_token: refreshToken, athlete } = decoded as JWTtoSignI;

  const url = `https://www.strava.com/oauth/token?client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}&grant_type=refresh_token&refresh_token=${refreshToken}`;
  return fetch(url, { method: "POST" })
    .then((response) => {
      if (response.ok) {
        return response.json();
      }
      throw new Error("");
    })
    .then((result: StravaRefreshI) => {
      const obj = {
        ...result,
        athlete,
      };
      return obj;
    });
};
