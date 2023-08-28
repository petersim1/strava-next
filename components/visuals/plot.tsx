"use client";

import { useRef, useEffect } from "react";
import { select } from "d3";

import { PlotDataI, DataStateI } from "@/types/data";
import { createViz } from "@/lib/utils";
import Loader from "../layout/loader";
import styles from "./styled.module.css";

export default ({
  plotData,
  dataState,
  opacity,
}: {
  plotData: PlotDataI[][];
  dataState: DataStateI;
  opacity: number;
}): JSX.Element => {
  const ref = useRef(null);

  useEffect(() => {
    const svg = select(ref.current);

    svg.selectAll("*").remove(); // remove current SVG so we can start fresh each run.
    if (plotData.length > 0) {
      createViz(svg, plotData, opacity);
    }
  }, [plotData, opacity]);

  return (
    <div className={styles.plot_holder}>
      <div className={styles.plot} ref={ref} />
      {dataState.loading && <Loader />}
    </div>
  );
};
