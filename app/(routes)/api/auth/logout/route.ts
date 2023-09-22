import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { decodeJwt } from "jose";

import { JWTtoSignI } from "@/_types/auth";
import { RequestError } from "@/_lib/errors";

export const POST = async (request: NextRequest): Promise<NextResponse> => {
  const { cookies } = request;
  const { value: token } = cookies.get("X-STRAVA-JWT") ?? { value: undefined };
  if (!token) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  const decoded = decodeJwt(token);
  const { access_token: accessToken } = decoded as JWTtoSignI;

  const headers = new Headers();
  headers.set("Authorization", `Bearer ${accessToken}`);

  return fetch("https://www.strava.com/oauth/deauthorize", { method: "POST", headers })
    .then((response) => {
      if (response.ok) {
        return response.json();
      }
      throw new RequestError(response.statusText, response.status);
    })
    .then((result) => {
      const revokedToken = result.access_token;
      if (revokedToken === accessToken) {
        const res = NextResponse.json({ ok: true });
        res.cookies.delete("X-STRAVA-JWT");
        return res;
      }
      throw new RequestError("Token mismatch", 500);
    })
    .catch((error: RequestError) => {
      console.log(error);
      return NextResponse.json(error.message, { status: error.status, statusText: error.message });
    });
};
