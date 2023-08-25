import { StravaMapI } from "./strava";

export type FilteringI = {
  activity: string | undefined;
  startDate: string | undefined;
  endDate: string | undefined;
};

export type StravaActivitySimpleI = {
  id: string;
  sportType: string;
  startDate: string;
  map: StravaMapI;
};
