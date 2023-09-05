"use client";

import { useRef, useEffect } from "react";
import { select } from "d3";

import { PlotDataI, DataStateI } from "@/types/data";
import { createViz } from "@/lib/utils/plotting";
import Loader from "../layout/loader";
import styles from "./styled.module.css";

export default ({
  plotData,
  groupings,
  dataState,
  opacity,
  boxIndex,
}: {
  plotData: PlotDataI[];
  groupings: number[][];
  dataState: DataStateI;
  opacity: number;
  boxIndex: number;
}): JSX.Element => {
  const ref = useRef(null);

  useEffect(() => {
    const svg = select(ref.current);

    svg.selectAll("*").remove(); // remove current SVG so we can start fresh each run.
    if (plotData.length > 0) {
      const toPlot = groupings[boxIndex].map((i) => plotData[i]);
      createViz(svg, toPlot, opacity);
    }
  }, [plotData, opacity, boxIndex, groupings]);

  return (
    <div className={styles.plot_holder}>
      <div className={styles.plot} ref={ref} />
      {dataState.loading && <Loader />}
    </div>
  );
};
