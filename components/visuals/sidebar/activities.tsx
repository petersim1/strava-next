import { PlotDataI } from "@/types/data";
import styles from "./styled.module.css";

export default ({
  data,
  handleEnter,
  handleExit,
}: {
  data: PlotDataI[];
  handleEnter: (e: React.MouseEvent<HTMLDivElement>) => void;
  handleExit: (e: React.MouseEvent<HTMLDivElement>) => void;
}): JSX.Element => {
  const getHour = (t: number): number => {
    return Math.floor(t / 60 / 60);
  };
  const getMinute = (t: number): number => {
    const hr = getHour(t);
    return Math.floor((t - hr * 60 * 60) / 60);
  };
  const getMiles = (d: number): number => {
    return Math.round(d * 0.000621371 * 100) / 100;
  };
  const getDateFormat = (t: number): string => {
    return new Date(t).toDateString();
  };

  return (
    <div className={styles.panel_activities}>
      {data.map((d) => (
        <div
          key={d.id}
          className={styles.activity_description}
          data-index={d.id}
          onMouseEnter={handleEnter}
          onMouseLeave={handleExit}
        >
          <div className={styles.content}>
            <div>{getDateFormat(d.start_date_local)}</div>
            <div className={styles.name}>{d.name}</div>
            <div className={styles.info}>
              <div>{getMiles(d.distance)} mi</div>
              <div>
                {getHour(d.moving_time)}hr {getMinute(d.moving_time)}min
              </div>
            </div>
          </div>
          <a
            href={`https://strava.com/activities/${d.id}`}
            target="_blank"
            referrerPolicy="no-referrer"
          >
            <div>{"-->"}</div>
          </a>
        </div>
      ))}
    </div>
  );
};
