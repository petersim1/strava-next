/* eslint-disable no-constant-condition */

import * as d3 from "d3";

import { PlotDataI, CoordinatesI } from "@/_types/data";
import { plottingProps } from "@/_lib/constants";
import { getBoxedExtent } from "./box";
import { activate, deactivate } from "./animate";
import { getHour, getMinute, getMiles, getDateFormat } from "@/_lib/utils";

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

  const paths = svg
    .append("g")
    // .attr("transform", `translate(${plottingProps.margin.left},${plottingProps.margin.top})`)
    .attr("stroke", "var(--primary)")
    .attr("stroke-width", "2px")
    .style("fill", "none")
    .attr("pointer-events", "none") // otherwise triggers mouseout event.
    .selectAll("path")
    .data(data)
    .join("path")
    .attr("data-index", (d) => d.id)
    .style("opacity", opacity)
    .attr("d", (d) => line(d.coordinates));

  const tooltip = plotHolder
    .append("div")
    .style("position", "absolute")
    .style("top", "20px")
    .style("right", "20px")
    .style("pointer-events", "none")
    .attr("class", "tooltip")
    .html("");

  const updateTooltip = (d: PlotDataI): void => {
    const html = `
      <div>${getDateFormat(d.start_date_local)}</div>
      <div class="name">${d.name}</div>
      <div class="info">
        <div>${getMiles(d.distance)} mi</div>
        <div>${getHour(d.moving_time)}hr ${getMinute(d.moving_time)}min</div>
      </div>
    `;
    tooltip.html(html);
  };

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
      if (ind !== undefined) {
        updateTooltip(data[ind]);
      }
    })
    .on("mouseout", () => {
      // force all to deactivated position.
      paths.transition().call(deactivate, 250, opacity, true);
      tooltip.html("");
    })
    .on("touchend", (e) => {
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
      if (ind !== undefined) {
        updateTooltip(data[ind]);
      }
    });
};
