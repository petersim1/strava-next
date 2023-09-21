"use client";
import { useRouter } from "next/navigation";

import { DB } from "@/lib/indexedDB";
import { clearLocalStorage } from "@/lib/localStorage";
import { Stores } from "@/types/data";
import Logout from "@/components/assets/logout";
import styles from "./styled.module.css";

export default (): JSX.Element => {
  const router = useRouter();

  const handleLogout = (): void => {
    const db = new DB("strava");
    fetch("/api/auth/logout", { method: "POST" })
      .then((response) => {
        if (response.ok) {
          return db.clearDataStore();
        }
        throw new Error(response.statusText);
      })
      .then((ok) => {
        if (ok) {
          clearLocalStorage(Stores.FILTER);
          return;
        }
        throw new Error("couldn't delete indexeddb");
      })
      .catch((error: Error) => {
        console.log(error.message);
      })
      .finally(() => router.refresh());
  };

  return (
    <div onClick={handleLogout} className={styles.disconnect}>
      <Logout fill="white" height="24px" width="24px" />
    </div>
  );
};
