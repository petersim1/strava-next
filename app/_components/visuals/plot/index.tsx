"use client";

import html2canvas from "html2canvas";

import { useRef, useEffect } from "react";
import { select } from "d3";

import { PlotDataI } from "@/_types/data";
import { createViz } from "@/_lib/utils/plotting";
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

  const handleClick = (): void => {
    if (!ref.current) return;
    html2canvas(ref.current).then((canvas) => {
      const link = document.createElement("a");
      link.download = "test.png";
      link.href = canvas.toDataURL("image/png");
      link.click();
    });
  };

  return (
    <>
      <div className={styles.plot} ref={ref} />
      <div style={{ marginLeft: "auto", zIndex: 999 }}>
        <button onClick={handleClick}>test</button>
      </div>
    </>
  );
};
