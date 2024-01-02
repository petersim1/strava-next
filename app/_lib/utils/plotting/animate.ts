import * as d3 from "d3";

export const activate = (
  transition: d3.Transition<any, any, any, any>,
  duration: number,
  shift = false,
): void => {
  if (shift) {
    transition
      .duration(duration)
      .ease(d3.easeLinear)
      .attr("stroke", "white")
      .style("opacity", 1)
      .style("transform", "translate(0, -20px)");
  } else {
    transition.duration(duration).ease(d3.easeLinear).attr("stroke", "white").style("opacity", 1);
  }
};

export const deactivate = (
  transition: d3.Transition<any, any, any, any>,
  duration: number,
  opacity: number,
  shift = false,
): void => {
  if (shift) {
    transition
      .duration(duration)
      .ease(d3.easeLinear)
      .attr("stroke", "var(--primary)")
      .style("opacity", opacity)
      .style("transform", "translate(0, 0)");
  } else {
    transition
      .duration(duration)
      .ease(d3.easeLinear)
      .attr("stroke", "var(--primary)")
      .style("opacity", opacity);
  }
};
