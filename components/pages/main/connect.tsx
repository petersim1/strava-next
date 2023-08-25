import styles from "../styled.module.css";
import Connect from "@/components/assets/connect";

export default (): JSX.Element => {
  // can uncomment below if I decide to go back to middleware instead of server action.
  // const athleteStr = headers().get("X-Strava-Athlete") ?? "{}";
  // const athlete: StravaAthleteI = JSON.parse(athleteStr);
  return (
    <div className={styles.connect_holder}>
      <p>{"Let's link your Strava so we can get started"}</p>
      <Connect />
    </div>
  );
};
