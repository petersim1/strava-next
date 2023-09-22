import { StravaActivitySimpleI } from "@/_types/data";
import { StravaActivityI } from "@/_types/strava";

export const getHour = (t: number): number => {
  return Math.floor(t / 60 / 60);
};
export const getMinute = (t: number): number => {
  const hr = getHour(t);
  return Math.floor((t - hr * 60 * 60) / 60);
};
export const getMiles = (d: number): number => {
  return Math.round(d * 0.000621371 * 100) / 100;
};
export const getDateFormat = (t: number): string => {
  return new Date(t).toDateString();
};

export const constrainOutput = (data: StravaActivityI): StravaActivitySimpleI => {
  // start_date_local is a string. Convert it to epoch time (with milliseconds).
  // start_date is a string. Convert it to epoch time (with milliseconds).
  return {
    id: data.id,
    sport_type: data.sport_type,
    start_date: new Date(data.start_date).valueOf(),
    start_date_local: new Date(data.start_date_local).valueOf(),
    map: data.map,
    name: data.name,
    distance: data.distance,
    moving_time: data.moving_time,
    elapsed_time: data.elapsed_time,
  };
};
