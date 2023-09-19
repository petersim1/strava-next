/* eslint-disable no-constant-condition */

import * as d3 from "d3";

import { PlotDataI, CoordinatesI } from "@/types/data";
import { plottingProps } from "@/lib/constants";
import { getBoxedExtent } from "./box";
import { activate, deactivate } from "./animate";

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

  const svg = plotHolder
    .append("svg")
    .attr("width", plottingProps.width)
    .attr("height", plottingProps.height)
    .attr("viewBox", [0, 0, plottingProps.width, plottingProps.height])
    .style("max-height", "100%")
    .style("max-width", "100%");

  const dataGEl = svg
    .append("g")
    .attr("transform", `translate(${plottingProps.margin.left},${plottingProps.margin.top})`);

  const line = d3
    .line<CoordinatesI>()
    .x((d) => x(d.x))
    .y((d) => y(d.y));

  const paths = dataGEl
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
    .attr("stroke-width", "2px")
    .style("fill", "none")
    .style("opacity", opacity)
    .attr("d", (d) => line(d.coordinates));

  const text = svg
    .append("text")
    .attr("x", plottingProps.width)
    .attr("y", 0)
    .attr("width", 200)
    .attr("height", 20)
    .attr("text-anchor", "end")
    .attr("stroke", "currentColor")
    .attr("fill", "currentColor")
    .attr("dy", "30px")
    .style("font", "bold 30px sans-serif")
    .text("");

  dataGEl
    .append("rect")
    .attr("height", y(yExt[0]) - y(yExt[1]))
    .attr("width", x(xExt[1]) - x(xExt[0]))
    .attr("stroke", "none")
    .attr("fill", "transparent")
    .on("mousemove", (e) => {
      // get the pointer event's coordinates.
      // find the index within the data array with the smallest distance (hypotenuse).
      const [xm, ym] = d3.pointer(e);
      const ind = d3.leastIndex(data, ({ coordinates }) =>
        d3.min(coordinates, (d) => Math.hypot(x(d.x) - xm, y(d.y) - ym)),
      );
      paths
        .filter((_, i) => i === ind)
        .raise()
        .transition()
        .call(activate, 250, true);
      paths
        .filter((_, i) => i !== ind)
        .transition()
        .call(deactivate, 250, opacity, true);
      text.text(data[ind || 0].id);
    })
    .on("mouseout", () => {
      // force all to deactivated position.
      paths.transition().call(deactivate, 250, opacity, true);
      text.text("");
    })
    .on("touchstart", (e) => e.preventDefault());
};
