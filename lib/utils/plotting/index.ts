/* eslint-disable no-constant-condition */

import * as d3 from "d3";

import { PlotDataI, StravaActivitySimpleI, CoordinatesI } from "@/types/data";
import { plottingProps } from "@/lib/constants";

const getBoundingBox = (data: CoordinatesI[]): [[number, number], [number, number]] => {
  const xExt = <[number, number]>d3.extent(data, (d) => d.x);
  const yExt = <[number, number]>d3.extent(data, (d) => d.y);

  return [xExt, yExt];
};

const getBoxedExtent = (data: CoordinatesI[]): [number, number][] => {
  const [xExt, yExt] = getBoundingBox(data);

  const xDiff = xExt[1] - xExt[0];
  const yDiff = yExt[1] - yExt[0];

  if (xDiff > yDiff) {
    yExt[0] -= (xDiff - yDiff) / 2;
    yExt[1] += (xDiff - yDiff) / 2;
  }
  if (yDiff > xDiff) {
    xExt[0] -= (yDiff - xDiff) / 2;
    xExt[1] += (yDiff - xDiff) / 2;
  }
  return [xExt, yExt];
};

const isOverlap = (coords1: CoordinatesI[], coords2: CoordinatesI[]): boolean => {
  const [xExt1, yExt1] = getBoundingBox(coords1);
  const [xExt2, yExt2] = getBoundingBox(coords2);

  if (xExt1[0] > xExt2[1] || xExt1[1] < xExt2[0]) return false;
  if (yExt1[1] < yExt2[0] || yExt1[0] > yExt2[1]) return false;

  return true;
};

export const findLinks = (data: PlotDataI[]): { [key: number]: number[] } => {
  const links: { [key: number]: number[] } = {};
  [...Array(data.length)]
    .map((_, i) => i)
    .forEach((ind) => {
      links[ind as keyof typeof links] = [];
      [...Array(data.length)]
        .map((_, i) => i)
        .slice(ind + 1, data.length)
        .forEach((ind2) => {
          if (isOverlap(data[ind].coordinates, data[ind2].coordinates)) {
            links[ind].push(ind2);
          }
        });
    });
  return links;
};

export const getGroupings = (data: PlotDataI[]): number[][] => {
  const groups: Set<number>[] = [];

  const links = findLinks(data);

  Object.entries(links).forEach(([key, values]) => {
    let found = false;
    let foundInd = 0;
    [...Array(groups.length)].forEach((_, ind) => {
      if (groups[ind].has(Number(key))) {
        found = true;
        foundInd = ind;
      }
    });
    if (!found) {
      groups.push(new Set());
      foundInd = groups.length - 1;
      groups[foundInd].add(Number(key));
    }
    values.forEach((value) => {
      groups[foundInd].add(value);
    });
  });

  return groups.map((group) => Array.from(group)).sort((a, b) => (a.length < b.length ? 0 : -1));
};

export const createViz = (
  plotHolder: d3.Selection<null, unknown, null, undefined>,
  data: PlotDataI[],
  opacity: number,
): void => {
  const dataFlat = data.reduce<CoordinatesI[]>(
    (out, arrays) => out.concat(arrays.coordinates.map((coord) => coord)),
    [],
  );

  // ensures square plots, with data at centroid.
  const [xExt, yExt] = getBoxedExtent(dataFlat);

  const x = d3
    .scaleLinear()
    .range([0, plottingProps.width - plottingProps.margin.left - plottingProps.margin.right])
    .domain(xExt);
  const y = d3
    .scaleLinear()
    .range([plottingProps.height - plottingProps.margin.top - plottingProps.margin.bottom, 0])
    .domain(yExt);

  // const colors = d3.scaleLinear<string, string>().domain([0, data.length]).range(["white", "blue"]);

  const genSVG = (): d3.Selection<SVGGElement, unknown, null, unknown> => {
    const svgMain = plotHolder
      .append("svg")
      .attr("width", "100%")
      .attr("height", "100%")
      .attr("viewBox", [0, 0, plottingProps.width, plottingProps.height])
      .append("g")
      .attr("transform", `translate(${plottingProps.margin.left},${plottingProps.margin.top})`);

    return svgMain;
  };

  const genLines = (svg: d3.Selection<SVGGElement, unknown, null, unknown>): void => {
    const line = d3
      .line<CoordinatesI>()
      .x((d) => x(d.x))
      .y((d) => y(d.y));
    svg
      .append("g")
      .selectAll("line")
      .data(data)
      .join("path")
      // .attr("stroke", "var(--strava-orange)")
      .attr("stroke", "#ff9e0c")
      // .attr("stroke", (_, i) => colors(i))
      .attr("data-index", (d) => d.id)
      .attr("stroke-width", "4px")
      .style("opacity", opacity)
      // .style("transition", "all 0.25s ease-in-out")
      .attr("d", (d) => line(d.coordinates));
  };

  const svg = genSVG();
  genLines(svg);
};

export const decodePolyline = (data: StravaActivitySimpleI, precision = 5): PlotDataI => {
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

    // reversing order gets me [x,y] more accurately.
    coordinates.push({
      x: lng / factor,
      y: lat / factor,
    });
  }

  return {
    ...rest,
    coordinates: coordinates,
  };
};
