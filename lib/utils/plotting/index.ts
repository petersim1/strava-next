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

  // ensures square plots, with data at centroid. Plot would be skewed otherwise.
  const [xExt, yExt] = getBoxedExtent(dataFlat);

  const x = d3
    .scaleLinear()
    .domain(xExt)
    .range([plottingProps.margin.left, plottingProps.width - plottingProps.margin.right]);
  const y = d3
    .scaleLinear()
    .domain(yExt)
    .range([plottingProps.height - plottingProps.margin.bottom, plottingProps.margin.top]);

  const svg = plotHolder
    .append("svg")
    .attr("viewBox", [0, 0, plottingProps.width, plottingProps.height])
    .style("max-height", "100%")
    .style("max-width", "100%");

  const line = d3
    .line<CoordinatesI>()
    .x((d) => x(d.x))
    .y((d) => y(d.y));

  // const rect = svg
  //   .append("rect")
  //   .attr("height", plottingProps.height - plottingProps.margin.top - plottingProps.margin.bottom)
  //   .attr("width", plottingProps.width - plottingProps.margin.left - plottingProps.margin.right)
  //   .attr("fill", "transparent") // making this none will not trigger the mouseevents.
  //   .attr("stroke", "white")
  //   .attr("stroke-width", "2px")
  //   .attr("transform", `translate(${plottingProps.margin.left},${plottingProps.margin.top})`);

  const paths = svg
    .append("g")
    // .attr("transform", `translate(${plottingProps.margin.left},${plottingProps.margin.top})`)
    .attr("stroke", "#ff9e0c")
    .attr("stroke-width", "2px")
    .style("fill", "none")
    .attr("pointer-events", "none") // otherwise triggers mouseout event.
    .selectAll("path")
    .data(data)
    .join("path")
    .attr("data-index", (d) => d.id)
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

  svg
    .on("mousemove", (e) => {
      // get the pointer event's coordinates.
      // find the index within the data array with the smallest distance (hypotenuse).
      const [xm, ym] = d3.pointer(e);
      const ind = d3.leastIndex(data, ({ coordinates }) =>
        d3.min(coordinates, (d) =>
          Math.hypot(
            // x(d.x) - xm - plottingProps.margin.left, use this for targeting "rect"
            // y(d.y) - ym - plottingProps.margin.top, use this for targeting "rect"
            x(d.x) - xm,
            y(d.y) - ym,
          ),
        ),
      );
      paths.each(function (_, i) {
        if (i === ind) {
          d3.select(this).raise().transition().call(activate, 100, true);
        } else {
          d3.select(this).transition().call(deactivate, 100, opacity, true);
        }
      });
      text.text(ind ? data[ind].id : "");
    })
    .on("mouseout", () => {
      // force all to deactivated position.
      paths.transition().call(deactivate, 250, opacity, true);
      text.text("");
    })
    .on("touchstart", (e) => e.preventDefault());
};
