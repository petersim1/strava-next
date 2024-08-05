import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { StravaActivityI } from "@/_types/strava";
import { RequestError } from "@/_lib/errors";
import { constrainOutput } from "@/_lib/utils";
import { cookies } from "next/headers";
import { decodeJwt } from "jose";
import { JWTtoSignI } from "@/_types/auth";

export const GET = async (request: NextRequest): Promise<NextResponse> => {
  // can bypass auth as we use include in the proxy request.
  // headers are forwarded in the proxy request as well.

  const cookieStore = cookies();
  const { value: token } = cookieStore.get("X-STRAVA-JWT") ?? { value: undefined };
  if (!token) {
    return NextResponse.json({});
  }
  const decoded = decodeJwt(token);
  const { access_token: accessToken } = decoded as JWTtoSignI;

  const headers = new Headers();
  headers.set("Authorization", `Bearer ${accessToken}`);

  const baseURL = new URL("https://www.strava.com/api/v3/athlete/activities");

  const { before, after, page } = Object.fromEntries(request.nextUrl.searchParams.entries());

  if (before) baseURL.searchParams.set("before", (Number(before) / 1000).toString());
  if (after) baseURL.searchParams.set("after", (Number(after) / 1000).toString());

  baseURL.searchParams.set("per_page", "50");
  baseURL.searchParams.set("page", page.toString());

  return fetch(baseURL, { headers })
    .then((response) => {
      if (!response.ok) {
        throw new RequestError(response.statusText, response.status);
      }
      return response.json();
    })
    .then((activities: StravaActivityI[]) => {
      const numActivities = activities.length;
      const more = numActivities > 0;
      const results = activities
        .filter((activity) => ["Ride", "Run"].includes(activity.sport_type))
        .map((activity) => constrainOutput(activity));

      return NextResponse.json({
        success: true,
        results,
        more,
        nTotal: numActivities,
        nRelevant: results.length,
      });
    });
};
