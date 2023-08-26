import { StravaMapI } from "./strava";

export type FilteringI = {
  activity: string | undefined;
  startDate: string | undefined;
  endDate: string | undefined;
};

export type StravaActivitySimpleI = {
  id: string;
  sportType: string;
  startDate: number;
  map: StravaMapI;
};

export enum Stores {
  FILTER = "filtering",
  DATE = "last_pull",
}

export type FilterOptionsI = {
  [key: string]: {
    name: string;
    type: string;
    required: boolean;
    options: string[];
  };
};
