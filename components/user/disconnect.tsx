"use client";
import { useRouter } from "next/navigation";

import { DB } from "@/lib/indexedDB";
import { clearLocalStorage } from "@/lib/localStorage";
import { Stores } from "@/types/data";
import styles from "./styled.module.css";

export default (): JSX.Element => {
  const router = useRouter();

  const handleLogout = (): void => {
    const db = new DB("activities");
    fetch("/api/auth/logout", { method: "POST" })
      .then((response) => {
        if (response.ok) {
          return db.clearDataStore();
        }
      })
      .then((ok) => {
        if (ok) {
          clearLocalStorage(Stores.DATE);
          clearLocalStorage(Stores.FILTER);
          // trigger a refresh so that we get the server action in page.tsx (auth state).
          router.refresh();
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
