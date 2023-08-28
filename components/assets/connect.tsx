import { headers } from "next/headers";
import styles from "./styled.module.css";

const { CLIENT_ID } = process.env;
const CALLBACK = "/api/auth/callback";

const getURL = (): string => {
  const header = headers();
  return `${header.get("x-forwarded-proto") || (header.get("https") && "https") || "http"}://${
    header.get("x-forwarded-host") || header.get("host")
  }`;
};

export default (): JSX.Element => {
  // const CALLBACK = "http://localhost:3000/api/auth/callback";
  const url = getURL();

  const urlUse = new URL("https://www.strava.com/oauth/authorize");
  urlUse.searchParams.set("client_id", CLIENT_ID?.toString() || "");
  urlUse.searchParams.set("redirect_uri", url + CALLBACK + "-test-me-out");
  urlUse.searchParams.set("response_type", "code");
  urlUse.searchParams.set("approval_prompt", "force");
  urlUse.searchParams.set("scope", "activity:read");

  return (
    <a href={urlUse.toString()} referrerPolicy="no-referrer" className={styles.connect_link}>
      <div className={styles.connect} />
    </a>
  );
};
