import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { cookies } from "next/headers";
import { decodeJwt } from "jose";

import { JWTtoSignI } from "@/types/auth";
import { StravaActivitySimpleI } from "@/types/data";
import { StravaActivityI } from "@/types/strava";
import { RequestError } from "@/lib/errors";
import { constrainOutput } from "@/lib/utils";

const dataRecursion = (
  baseURL: URL,
  headers: Headers,
  page: number,
  results: StravaActivitySimpleI[],
): Promise<StravaActivitySimpleI[]> => {
  baseURL.searchParams.set("page", page.toString());
  return fetch(baseURL, { headers })
    .then((response) => {
      if (response.ok) {
        return response.json();
      }
      throw new RequestError(response.statusText, response.status);
    })
    .then((activities: StravaActivityI[]) => {
      if (activities.length === 0) {
        return results;
      }
      activities.forEach((activity) => {
        if (["Ride", "Run"].includes(activity.sport_type)) {
          const data = constrainOutput(activity);
          results.push({ ...data });
        }
      });
      return dataRecursion(baseURL, headers, page + 1, results);
    });
};

export const GET = async (request: NextRequest): Promise<NextResponse> => {
  const cookieStore = cookies();
  const { value: token } = cookieStore.get("X-STRAVA-JWT") ?? { value: undefined };
  if (!token) {
    return NextResponse.json([], { status: 401 });
  }

  const decoded = decodeJwt(token);
  const { access_token: accessToken } = decoded as JWTtoSignI;
  const headers = new Headers();
  headers.set("Authorization", `Bearer ${accessToken}`);

  const baseURL = new URL("https://www.strava.com/api/v3/athlete/activities");
  baseURL.searchParams.set("per_page", "50");

  const { before, after } = Object.fromEntries(request.nextUrl.searchParams.entries());

  if (before) baseURL.searchParams.set("before", (Number(before) / 1000).toString());
  if (after) baseURL.searchParams.set("after", (Number(after) / 1000).toString());

  return dataRecursion(baseURL, headers, 1, [])
    .then((results) => {
      return NextResponse.json(results);
    })
    .catch((error: RequestError) => {
      return NextResponse.json([], { status: error.status, statusText: error.message });
    });
};
