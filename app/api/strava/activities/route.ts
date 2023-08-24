import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { decodeJwt } from "jose";

import { JWTtoSignI } from "@/types/strava";
import { StravaActivityDetailedI, StravaActivitySimpleI } from "@/types/data";

const baseURL = "https://www.strava.com/api/v3";

const getData = async (
  pageNum: number,
  headers: Headers,
  rides: StravaActivitySimpleI[],
): Promise<StravaActivitySimpleI[]> => {
  fetch(baseURL + `/athlete/activities?page=${pageNum}&per_page=50`, { headers })
    .then((response) => {
      if (response.ok) {
        return response.json();
      }
    })
    .then((activities: StravaActivityDetailedI[]) => {
      activities.forEach((activity) => {
        rides.push({
          id: activity.id,
          sportType: activity.sport_type,
          startDate: activity.start_date_local,
        });
      });
      getData(pageNum + 1, headers, rides);
    });
  return rides;
};

export const GET = async (): Promise<NextResponse> => {
  const cookieStore = cookies();
  const { value: token } = cookieStore.get("token") ?? { value: undefined };
  if (!token) {
    return NextResponse.json({});
  }
  const decoded = decodeJwt(token);
  const { access_token: accessToken } = decoded as JWTtoSignI;

  console.log(accessToken);

  const headers = new Headers({
    Authorization: `Bearer: ${accessToken}`,
  });

  const rides = await getData(1, headers, []);

  return NextResponse.json({ rides });
};
