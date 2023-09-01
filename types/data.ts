import { StravaMapI } from "./strava";

export type FilteringI = {
  activity: string;
  startDate: string;
  endDate: string;
};

export type StravaActivitySimpleI = {
  id: string;
  sport_type: string;
  start_date_local: number;
  map: StravaMapI;
  name: string;
  distance: number;
  moving_time: number;
  elapsed_time: number;
};

export enum Stores {
  FILTER = "filtering",
  // DATE = "last_pull",
}

export type FilterOptionsI = {
  [key: string]: {
    name: string;
    type: string;
    required: boolean;
    options: string[];
  };
};

export type DataStateI = {
  loading: boolean;
  error: boolean;
  done: boolean;
};

export type CoordinatesI = {
  x: number;
  y: number;
};

export type PlotDataI = {
  id: string;
  sport_type: string;
  start_date_local: number;
  name: string;
  distance: number;
  moving_time: number;
  elapsed_time: number;
  coordinates: CoordinatesI[];
};
