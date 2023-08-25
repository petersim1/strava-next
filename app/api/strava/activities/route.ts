import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { decodeJwt } from "jose";

import { JWTtoSignI } from "@/types/auth";
import { StravaActivitySimpleI } from "@/types/data";
import { StravaActivityI } from "@/types/strava";

const getData = async (token: string): Promise<StravaActivitySimpleI[]> => {
  const headers = new Headers();
  headers.set("Authorization", `Bearer ${token}`);

  const rides: StravaActivitySimpleI[] = [];
  let pageNum = 1;
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const response = await fetch(
      `https://www.strava.com/api/v3/athlete/activities?page=${pageNum}&per_page=50`,
      {
        headers,
      },
    );
    if (!response.ok) break;
    const activities: StravaActivityI[] = await response.json();
    if (activities.length == 0) break;
    activities.forEach((activity) => {
      rides.push({
        id: activity.id,
        sportType: activity.sport_type,
        startDate: activity.start_date_local,
        map: activity.map,
      });
    });
    pageNum++;
  }
  return rides;
};

export const GET = async (): Promise<NextResponse> => {
  const cookieStore = cookies();
  const { value: token } = cookieStore.get("token") ?? { value: undefined };
  if (!token) {
    return NextResponse.json([]);
  }
  const decoded = decodeJwt(token);
  const { access_token: accessToken } = decoded as JWTtoSignI;

  const rides = await getData(accessToken);

  return NextResponse.json(rides);
};
