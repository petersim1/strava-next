import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { decodeJwt } from "jose";

import { JWTtoSignI } from "@/types/auth";

export const POST = async (request: NextRequest): Promise<NextResponse> => {
  const { cookies } = request;
  const { value: token } = cookies.get("token") ?? { value: undefined };
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
      throw new Error(response.statusText);
    })
    .then((result) => {
      const revokedToken = result.access_token;
      if (revokedToken === accessToken) {
        const res = NextResponse.json({ ok: true });
        res.cookies.delete("token");
        return res;
      }
      throw new Error("Token mismatch");
    })
    .catch((error: Error) => {
      console.log(error);
      return NextResponse.json({ ok: false, error: error.message }, { status: 401 });
    });
};
