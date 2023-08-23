import { getUser } from "@/actions";
import Connect from "@/components/pages/main/connect";

export default async (): Promise<JSX.Element> => {
  // can uncomment below if I decide to go back to middleware instead of server action.
  // const athleteStr = headers().get("X-Strava-Athlete") ?? "{}";
  // const athlete: StravaAthleteI = JSON.parse(athleteStr);

  const { authed, user } = await getUser();

  return (
    <>
      {!authed && <Connect />}
      {authed && <div>Hey {user?.firstname}</div>}
    </>
  );
};
