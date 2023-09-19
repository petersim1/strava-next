/* eslint-disable no-constant-condition */
import { geoEquirectangular } from "d3";
import { PlotDataI, StravaActivitySimpleI, CoordinatesI } from "@/types/data";

export const decodePolyline = (data: StravaActivitySimpleI, precision = 5): PlotDataI => {
  // Returns the geoMercator projection of the decoded polyline coordinates.
  // const projection = geoMercator();
  const projection = geoEquirectangular();
  const coordinates: CoordinatesI[] = [];
  const factor = Math.pow(10, Number.isInteger(precision) ? precision : 5);
  let index = 0,
    lat = 0,
    lng = 0,
    shift = 0,
    result = 0,
    byte = null,
    latitudeChange,
    longitudeChange;

  const { map, ...rest } = data;
  const str = map.summary_polyline;

  while (index < str.length) {
    byte = null;
    shift = 1;
    result = 0;

    while (true) {
      byte = str.charCodeAt(index++) - 63;
      result += (byte & 0x1f) * shift;
      shift *= 32;
      if (byte < 0x20) break;
    }

    latitudeChange = result & 1 ? (-result - 1) / 2 : result / 2;

    shift = 1;
    result = 0;

    while (true) {
      byte = str.charCodeAt(index++) - 63;
      result += (byte & 0x1f) * shift;
      shift *= 32;
      if (byte < 0x20) break;
    }

    longitudeChange = result & 1 ? (-result - 1) / 2 : result / 2;

    lat += latitudeChange;
    lng += longitudeChange;

    const [x, y] = projection([lng / factor, -lat / factor]) || [0, 0];
    if (x == 0) console.log(x, y);

    // reversing order gets me [x,y] more accurately.
    coordinates.push({ x, y });
  }

  return {
    ...rest,
    coordinates: coordinates,
  };
};
