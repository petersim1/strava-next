"use client";

import html2canvas from "html2canvas";

import { useRef, useEffect } from "react";
import { select } from "d3";

import { PlotDataI } from "@/_types/data";
import { createViz } from "@/_lib/utils/plotting";
import { getMiles, getHour, getMinute } from "@/_lib/utils";
import { Cycling, Running } from "@/_components/assets";
import styles from "./styled.module.css";

export default ({ data, opacity }: { data: PlotDataI[]; opacity: number }): JSX.Element => {
  const ref = useRef(null);
  const modalRef = useRef(null);

  useEffect(() => {
    const svg = select(ref.current);

    svg.selectAll("*").remove(); // remove current SVG so we can start fresh each run.
    if (data.length > 0) {
      createViz(svg, data, opacity);
    }
  }, [data, opacity]);

  // const handleClick = (): void => {
  //   if (!ref.current) return;
  //   console.log(getMiles(data.reduce((a, b) => b.distance + a, 0)));
  //   console.log(getHour(data.reduce((a, b) => b.moving_time + a, 0)));
  //   console.log(getMinute(data.reduce((a, b) => b.moving_time + a, 0)));
  //   html2canvas(ref.current).then((canvas) => {
  //     const link = document.createElement("a");
  //     link.download = "test.png";
  //     link.href = canvas.toDataURL("image/png");
  //     link.click();
  //   });
  // };

  const handleClick = (): void => {
    const el = document.getElementById("modal-holder");
    if (!el) return;
    const svg = select(modalRef.current);
    createViz(svg, data, opacity);
    el.style.display = "flex";
  };

  const handleClose = (): void => {
    const el = document.getElementById("modal-holder");
    if (!el) return;
    el.style.display = "none";
    const svg = select(modalRef.current);
    svg.selectAll("*").remove();
  };

  return (
    <>
      <div className={styles.plot} ref={ref} />
      <div style={{ marginLeft: "auto", zIndex: 999 }}>
        <button onClick={handleClick}>test</button>
      </div>
      {ref.current && (
        <div id="modal-holder" className={styles.modal_wrapper}>
          <div onClick={handleClose}>X</div>
          <div id="modal-preview" className={styles.modal_preview} ref={modalRef}>
            <div style={{ position: "absolute", left: 0, top: 0 }}>
              {data[0].sport_type === "Run" ? (
                <Running fill="currentColor" height="1rem" width="1rem" />
              ) : (
                <Cycling fill="currentColor" height="1rem" width="1rem" />
              )}
              <div>{getMiles(data.reduce((a, b) => b.distance + a, 0))}mi</div>
              <div>
                {`${getHour(data.reduce((a, b) => b.moving_time + a, 0))}hr 
                ${getMinute(data.reduce((a, b) => b.moving_time + a, 0))}min`}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
