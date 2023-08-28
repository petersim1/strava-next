"use client";

import { useMemo, useRef, useEffect } from "react";
import { select } from "d3";

import { StravaActivitySimpleI } from "@/types/data";
import { decodePolyline, createViz } from "@/lib/utils";
import styles from "./styled.module.css";

export default ({ plotData }: { plotData: StravaActivitySimpleI[] }): JSX.Element => {
  const ref = useRef(null);

  const decoded = useMemo(() => {
    if (!plotData) return [];
    return plotData.map((d) => decodePolyline(d.map.summary_polyline));
  }, [plotData]);

  useEffect(() => {
    const svg = select(ref.current);

    svg.selectAll("*").remove(); // remove current SVG so I can recreate new viz.
    if (decoded.length > 0) {
      createViz(svg, decoded);
    }
  }, [decoded]);

  return (
    <div className={styles.plot_holder}>
      <div className={styles.plot} ref={ref} />
      {decoded.length === 0 && <div>hold on.</div>}
    </div>
  );
};
