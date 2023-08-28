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

  const urlUse = new URL("https://www.strava.com/api/v3/athlete/activities");
  urlUse.searchParams.set("per_page", "30");
  if (before) {
    urlUse.searchParams.set("before", before.toString());
  }
  if (after) {
    urlUse.searchParams.set("after", after.toString());
  }

  // eslint-disable-next-line no-constant-condition
  while (true) {
    urlUse.searchParams.set("page", pageNum.toString());
    const response = await fetch(urlUse, { headers });
    if (!response.ok) break;
    const activities: StravaActivityI[] = await response.json();
    if (activities.length == 0) break;
    activities.forEach((activity) => {
      // only going to support Ride+Run activities for now.
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
    return NextResponse.json([], { status: 401 });
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
