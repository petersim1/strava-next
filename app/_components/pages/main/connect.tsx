import { headers } from "next/headers";

import styles from "../styled.module.css";
import { Connect } from "@/_components/assets";

export default (): JSX.Element => {
  // can uncomment below if I decide to go back to middleware instead of server action.
  // const athleteStr = headers().get("X-Strava-Athlete") ?? "{}";
  // const athlete: StravaAthleteI = JSON.parse(athleteStr);
  const getURL = (): string => {
    const header = headers();
    return `${header.get("x-forwarded-proto") || (header.get("https") && "https") || "http"}://${
      header.get("x-forwarded-host") || header.get("host")
    }`;
  };

  const url = getURL();
  return (
    <div className={styles.connect_holder}>
      <p>{"Let's link your Strava so we can get started"}</p>
      <Connect url={url} />
    </div>
  );
};
