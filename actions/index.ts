"use server";

import { jwtVerify, SignJWT } from "jose";
import { cookies } from "next/headers";

import { JWTtoSignI, JWTVerifyReturnI, StravaAthleteI } from "@/types/strava";
import refreshToken from "@/lib/auth/refresh";

const { JWT_SECRET } = process.env;

type IsAuthed = {
  authed: boolean;
  user?: StravaAthleteI;
};

export const getUser = async (): Promise<IsAuthed> => {
  const cookieStore = cookies();
  const { value: token } = cookieStore.get("token") ?? { value: undefined };
  if (!token) {
    return { authed: false };
  }

  try {
    const { payload } = await jwtVerify(token, new TextEncoder().encode(JWT_SECRET));
    const { athlete } = payload as JWTVerifyReturnI;
    return {
      authed: true,
      user: athlete,
    };
  } catch (error) {
    const newObj = await refreshToken(token);
    const obj: JWTtoSignI = {
      athlete: newObj.athlete,
      refresh_token: newObj.refresh_token,
      access_token: newObj.access_token,
    };

    const newToken = await new SignJWT({ ...obj })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime(newObj.expires_at * 1000)
      .sign(new TextEncoder().encode(JWT_SECRET));

    cookieStore.set("token", newToken);
    return {
      authed: true,
      user: newObj.athlete,
    };
  }
};
