import { select, easeLinear } from "d3";

import { PlotDataI } from "@/types/data";
import styles from "./styled.module.css";

export default ({ plotData, opacity }: { plotData: PlotDataI[]; opacity: number }): JSX.Element => {
  const handleEnter = (e: React.MouseEvent<HTMLDivElement>): void => {
    const { index } = e.currentTarget.dataset;
    select(`path[data-index='${index}']`)
      .raise()
      .transition()
      .duration(250)
      .ease(easeLinear)
      .style("opacity", 1)
      .style("transform", "translate(0, -20px)")
      .attr("stroke", "white");
  };

  const handleExit = (e: React.MouseEvent<HTMLDivElement>): void => {
    const { index } = e.currentTarget.dataset;
    select(`path[data-index='${index}']`)
      .transition()
      .duration(250)
      .ease(easeLinear)
      .style("opacity", opacity)
      .style("transform", "translate(0, 0)")
      .attr("stroke", "#ff9e0c");
  };

  return (
    <div className={styles.panel}>
      <p className={styles.header}>Visible Rides</p>
      <div className={styles.panel_activities}>
        {plotData.map((data) => {
          const hr = Math.floor(data.moving_time / 60 / 60);
          const min = Math.floor((data.moving_time - hr * 60 * 60) / 60);
          return (
            <div
              key={data.id}
              className={styles.activity_description}
              data-index={data.id}
              onMouseEnter={handleEnter}
              onMouseLeave={handleExit}
            >
              <div className={styles.content}>
                <div>{new Date(data.start_date_local).toDateString()}</div>
                <div className={styles.name}>{data.name}</div>
                <div className={styles.info}>
                  <div>{Math.round(data.distance * 0.000621371 * 100) / 100} mi</div>
                  <div>
                    {hr}hr {min}min
                  </div>
                </div>
              </div>
              <a
                href={`https://strava.com/activities/${data.id}`}
                target="_blank"
                referrerPolicy="no-referrer"
              >
                <div>{"->"}</div>
              </a>
            </div>
          );
        })}
      </div>
    </div>
  );
};
