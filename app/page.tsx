import styles from "@/styles/page.module.css";
import Connect from "@/components/user/connect";
import { getUser } from "@/actions";

export default async (): Promise<JSX.Element> => {
  // can uncomment below if I decide to go back to middleware instead of server action.
  // const athleteStr = headers().get("X-Strava-Athlete") ?? "{}";
  // const athlete: StravaAthleteI = JSON.parse(athleteStr);

  const { authed, user } = await getUser();

  return (
    <main className={styles.main}>
      Hey there {authed && user && user.firstname}
      <Connect />
    </main>
  );
};
