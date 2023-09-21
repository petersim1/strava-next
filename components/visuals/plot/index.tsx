"use client";

import { useRef, useEffect } from "react";
import { select } from "d3";

import { PlotDataI } from "@/types/data";
import { createViz } from "@/lib/utils/plotting";
import styles from "./styled.module.css";

export default ({ data, opacity }: { data: PlotDataI[]; opacity: number }): JSX.Element => {
  const ref = useRef(null);

  useEffect(() => {
    const svg = select(ref.current);

    svg.selectAll("*").remove(); // remove current SVG so we can start fresh each run.
    if (data.length > 0) {
      createViz(svg, data, opacity);
    }
  }, [data, opacity]);

  return <div className={styles.plot} ref={ref} />;
};
