/* eslint-disable no-constant-condition */

import * as d3 from "d3";

import { PlotDataI, CoordinatesI } from "@/types/data";
import { plottingProps } from "@/lib/constants";
import { getBoxedExtent } from "./box";

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

  const genLines = (
    svg: d3.Selection<SVGGElement, unknown, null, unknown>,
  ): d3.Selection<SVGPathElement | d3.BaseType, PlotDataI, SVGGElement, unknown> => {
    const line = d3
      .line<CoordinatesI>()
      .x((d) => x(d.x))
      .y((d) => y(d.y));
    const paths = svg
      .append("g")
      .selectAll("path")
      .data(data)
      // .join("a")
      // .attr("href", (d) => `https://strava.com/activities/${d.id}`)
      // .attr("target", "_blank")
      // .attr("refferer-policy", "no-referrer")
      // .append("path")
      .join("path")
      .attr("stroke", "#ff9e0c")
      .attr("data-index", (d) => d.id)
      .attr("stroke-width", "4px")
      .style("opacity", opacity)
      .attr("d", (d) => line(d.coordinates));
    return paths;
  };

  const svg = genSVG();
  genLines(svg);
};
