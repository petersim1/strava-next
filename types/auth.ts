import { StravaAthleteI } from "./strava";

export type IsAuthed = {
  authed: boolean;
  user?: StravaAthleteI;
};

export type StravaOauthI = {
  token_type: string;
  expires_at: number;
  expires_in: number;
  refresh_token: string;
  access_token: string;
  athlete: StravaAthleteI;
};

export type JWTVerifyReturnI = {
  athlete: StravaAthleteI;
  refresh_token: string;
  access_token: string;
  iat: number;
  exp: number;
};

export type JWTtoSignI = {
  athlete: StravaAthleteI;
  refresh_token: string;
  access_token: string;
};

export type StravaRefreshI = {
  token_type: string;
  access_token: string;
  expires_at: number;
  expires_in: number;
  refresh_token: string;
};
