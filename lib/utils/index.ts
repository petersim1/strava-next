import { StravaActivitySimpleI } from "@/types/data";
import { StravaActivityI } from "@/types/strava";

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
