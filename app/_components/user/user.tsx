/* eslint-disable @next/next/no-img-element */
import styles from "./styled.module.css";
import { StravaAthleteI } from "@/_types/strava";
import Disconnect from "./disconnect";

export default ({ user }: { user: StravaAthleteI }): JSX.Element => {
  return (
    <div className={styles.user_holder}>
      <a href="https://www.strava.com/dashboard" target="_blank" referrerPolicy="no-referrer">
        <div className={styles.user_img}>
          <img src={user.profile_medium} alt="user profile pic" />
        </div>
      </a>
      <div>
        <span>{`${user.firstname} ${user.lastname}`}</span>
      </div>
      <Disconnect />
    </div>
  );
};
