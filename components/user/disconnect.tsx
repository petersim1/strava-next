"use client";

import { logout } from "@/actions";
import { DB } from "@/lib/indexedDB";
import { clearLocalStorage } from "@/lib/localStorage";
import { Stores } from "@/types/data";
import styles from "./styled.module.css";

export default (): JSX.Element => {
  const handleLogout = (): void => {
    const db = new DB("activities");
    db.clearDataStore()
      .then((ok) => {
        if (ok) {
          clearLocalStorage(Stores.DATE);
          clearLocalStorage(Stores.FILTER);
          logout();
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div onClick={handleLogout} className={styles.disconnect}>
      <p>Disconnect</p>
    </div>
  );
};
