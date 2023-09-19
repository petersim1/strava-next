import { useMemo } from "react";
import { select } from "d3";

import { PlotDataI } from "@/types/data";
import styles from "./styled.module.css";
import { activate, deactivate } from "@/lib/utils/plotting/animate";

export default ({
  plotData,
  opacity,
  groupings,
  boxIndex,
}: {
  plotData: PlotDataI[];
  opacity: number;
  groupings: number[][];
  boxIndex: number;
}): JSX.Element => {
  const panelData = useMemo(() => {
    if (plotData.length == 0) return [];
    return groupings[boxIndex].map((i) => plotData[i]);
  }, [boxIndex, groupings, plotData]);

  const handleEnter = (e: React.MouseEvent<HTMLDivElement>): void => {
    const { index } = e.currentTarget.dataset;
    select(`path[data-index='${index}']`).raise().transition().call(activate, 250, true);
  };

  const handleExit = (e: React.MouseEvent<HTMLDivElement>): void => {
    const { index } = e.currentTarget.dataset;
    select(`path[data-index='${index}']`).transition().call(deactivate, 250, opacity, true);
  };

  return (
    <div className={styles.panel}>
      <p className={styles.header}>{plotData.length} Total Rides</p>
      <div className={styles.panel_activities}>
        {panelData.map((data) => {
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
