"use client";

import { logout } from "@/actions";
import styles from "./styled.module.css";

export default (): JSX.Element => {
  return (
    <div onClick={(): void => logout()} className={styles.disconnect}>
      <p>Disconnect</p>
    </div>
  );
};
