export type StravaAthleteI = {
  id: number;
  username: string | null;
  resource_state: number;
  firstname: string;
  lastname: string;
  bio: string | null;
  city: string | null;
  state: string | null;
  country: string | null;
  sex: string | null;
  premium: boolean;
  summit: boolean;
  created_at: Date;
  updated_at: Date;
  badge_type_id: number;
  weight: number;
  profile_medium: string;
  profile: string;
  friend: boolean | null;
  follower: boolean | null;
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
