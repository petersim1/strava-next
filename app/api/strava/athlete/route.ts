import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { decodeJwt } from "jose";

import { JWTtoSignI } from "@/types/auth";

export const GET = async (): Promise<NextResponse> => {
  const cookieStore = cookies();
  const { value: token } = cookieStore.get("token") ?? { value: undefined };
  if (!token) {
    return NextResponse.json({});
  }
  const decoded = decodeJwt(token);
  const { access_token: accessToken } = decoded as JWTtoSignI;

  const headers = new Headers();
  headers.set("Authorization", `Bearer ${accessToken}`);

  return fetch("https://www.strava.com/api/v3/athlete", { headers })
    .then((response) => {
      console.log(response);
      if (response.ok) {
        return response.json();
      }
    })
    .then((result) => {
      return NextResponse.json({ ...result });
    });
};
