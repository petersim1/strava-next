import { headers } from "next/headers";
import styles from "./styled.module.css";

const { CLIENT_ID } = process.env;

const getURL = (): string => {
  const header = headers();
  return `${header.get("x-forwarded-proto") || (header.get("https") && "https") || "http"}://${
    header.get("x-forwarded-host") || header.get("host")
  }/${header.get("x-invoke-path")}`;
};

export default (): JSX.Element => {
  // const CALLBACK = "http://localhost:3000/api/auth/callback";
  const url = getURL();
  const CALLBACK = url + "api/auth/callback";

  const URL = `https://www.strava.com/oauth/authorize?client_id=${CLIENT_ID}&redirect_uri=${CALLBACK}&response_type=code&approval_prompt=force&scope=activity:read`;

  return (
    <a href={URL} referrerPolicy="no-referrer" className={styles.connect_link}>
      <div className={styles.connect} />
    </a>
  );
};
