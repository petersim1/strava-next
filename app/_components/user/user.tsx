/* eslint-disable @next/next/no-img-element */
import styles from "./styled.module.css";
import { getUser } from "@/_actions";
import Disconnect from "./disconnect";

export default async (): Promise<JSX.Element> => {
  const { user } = await getUser();
  return (
    <div className={styles.user_holder}>
      <a href="https://www.strava.com/dashboard" target="_blank" referrerPolicy="no-referrer">
        <div className={styles.user_img}>
          <img src={user?.profile_medium} alt="user profile pic" />
        </div>
      </a>
      <div>
        <span>{`${user?.firstname} ${user?.lastname}`}</span>
      </div>
      <Disconnect />
    </div>
  );
};
