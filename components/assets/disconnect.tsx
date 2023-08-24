"use client";

import { logout } from "@/actions";
import styles from "./styled.module.css";

export default (): JSX.Element => {
  // fetch("/api/strava/activities")
  //   .then((response) => {
  //     if (response.ok) {
  //       return response.json();
  //     }
  //   })
  //   .then((results) => {
  //     console.log(results);
  //   });

  return (
    <div onClick={(): void => logout()} className={styles.disconnect}>
      <p>Disconnect</p>
    </div>
  );
};
