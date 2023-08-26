import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { cookies } from "next/headers";
import { decodeJwt } from "jose";

import { JWTtoSignI } from "@/types/auth";
import { StravaActivitySimpleI } from "@/types/data";
import { StravaActivityI } from "@/types/strava";

const getData = async (
  token: string,
  before?: number,
  after?: number,
): Promise<StravaActivitySimpleI[]> => {
  const headers = new Headers();
  headers.set("Authorization", `Bearer ${token}`);

  const rides: StravaActivitySimpleI[] = [];
  let pageNum = 1;
  let URL = "https://www.strava.com/api/v3/athlete/activities?per_page=30";
  if (before) {
    URL += `&before=${before}`;
  }
  if (after) {
    URL += `&after=${after}`;
  }
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const urlUse = URL + `&page=${pageNum}`;
    const response = await fetch(urlUse, {
      headers,
    });
    if (!response.ok) break;
    const activities: StravaActivityI[] = await response.json();
    if (activities.length == 0) break;
    activities.forEach((activity) => {
      if (["Ride", "Run"].includes(activity.sport_type)) {
        rides.push({
          id: activity.id,
          sportType: activity.sport_type,
          startDate: new Date(activity.start_date_local).valueOf(),
          map: activity.map,
        });
      }
    });
    pageNum++;
  }
  return rides;
};

export const GET = async (request: NextRequest): Promise<NextResponse> => {
  const cookieStore = cookies();
  const { value: token } = cookieStore.get("token") ?? { value: undefined };
  if (!token) {
    return NextResponse.json([]);
  }
  const { searchParams } = request.nextUrl;
  let before;
  let after;
  if (searchParams.has("before")) {
    before = Math.round(Number(searchParams.get("before")) / 1000);
  }
  if (searchParams.has("after")) {
    after = Math.round(Number(searchParams.get("after")) / 1000);
  }
  const decoded = decodeJwt(token);
  const { access_token: accessToken } = decoded as JWTtoSignI;

  const rides = await getData(accessToken, before, after);

  return NextResponse.json(rides);
};
