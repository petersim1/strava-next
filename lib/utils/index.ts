/* eslint-disable no-constant-condition */
export const decodePolyline = (str: string, precision = 5): number[][] => {
  const coordinates = [];
  const factor = Math.pow(10, Number.isInteger(precision) ? precision : 5);
  let index = 0,
    lat = 0,
    lng = 0,
    shift = 0,
    result = 0,
    byte = null,
    latitudeChange,
    longitudeChange;

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

    coordinates.push([lat / factor, lng / factor]);
  }

  return coordinates;
};
