/* eslint-disable no-constant-condition */

import * as d3 from "d3";

import { PlotDataI } from "@/types/data";
import { plottingProps } from "@/lib/constants";

const getBoxedExtent = (data: PlotDataI[]): [number, number][] => {
  const xExt = <[number, number]>d3.extent(data, (d) => d.x);
  const yExt = <[number, number]>d3.extent(data, (d) => d.y);

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

export const createViz = (
  plotHolder: d3.Selection<null, unknown, null, undefined>,
  data: PlotDataI[][],
): void => {
  const dataFlat = data.reduce<PlotDataI[]>(
    (out, arrays) => out.concat(arrays.map((coord) => coord)),
    [],
  );

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
      .line<PlotDataI>()
      .x((d) => x(d.x))
      .y((d) => y(d.y));
    svg
      .append("g")
      .selectAll("line")
      .data(data)
      .join("path")
      .attr("stroke", "var(--strava-orange)")
      // .attr("stroke", (_, i) => colors(i))
      .attr("stroke-width", "4px")
      .style("opacity", 0.25)
      // .style("mix-blend-mode", "multiply")
      .attr("d", line);
  };

  const svg = genSVG();
  genLines(svg);
};

export const decodePolyline = (str: string, precision = 5): PlotDataI[] => {
  const coordinates: PlotDataI[] = [];
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

    // reversing order gets me [x,y] more accurately.
    coordinates.push({
      x: lng / factor,
      y: lat / factor,
    });
  }

  return coordinates;
};
