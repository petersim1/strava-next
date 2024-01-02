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
    const modal = select(modalRef.current);

    modal.selectAll("*").remove();
    svg.selectAll("*").remove(); // remove current SVG so we can start fresh each run.
    if (data.length > 0) {
      createViz(svg, data, opacity);
    }
  }, [data, opacity]);

  const handleDownload = (): void => {
    const el = document.getElementById("modal-preview");
    if (!el) return;
    html2canvas(el, {
      height: 500,
      width: 500,
    }).then((canvas) => {
      const link = document.createElement("a");
      link.download = "test.png";
      link.href = canvas.toDataURL("image/png");
      link.click();
    });
  };

  const handleOpen = (): void => {
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
      <div className={styles.downloadable}>
        <button onClick={handleOpen} className={styles.button_plot}>
          Preview Download
        </button>
      </div>
      <div id="modal-holder" className={styles.modal_wrapper}>
        <div className={styles.modal_container}>
          <div className={styles.modal_header}>
            <button onClick={handleDownload} className={styles.button_plot}>
              Download!
            </button>
            <div onClick={handleClose} style={{ fontSize: "1.2rem", cursor: "pointer" }}>
              X
            </div>
          </div>
          <div id="modal-preview" className={styles.modal_preview}>
            <div className={styles.img_preview_stats}>
              <div>
                <strong>Total Stats:</strong>
              </div>
              <div>{getMiles(data.reduce((a, b) => b.distance + a, 0))}mi</div>
              <div>
                {`${getHour(data.reduce((a, b) => b.moving_time + a, 0))}hr 
                ${getMinute(data.reduce((a, b) => b.moving_time + a, 0))}min`}
              </div>
              {data.length > 0 && data[0].sport_type === "Run" ? (
                <Running fill="currentColor" height="1.5rem" width="1.5rem" />
              ) : (
                <Cycling fill="currentColor" height="1.5rem" width="1.5rem" />
              )}
            </div>
            <div className={styles.plot} ref={modalRef} />
          </div>
        </div>
      </div>
    </>
  );
};
