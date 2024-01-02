import Image from "next/image";

import { Logo } from "@/_components/assets";
import styles from "./styled.module.css";

export default ({ showUser }: { showUser: boolean }): JSX.Element => {
  return (
    <footer className={`${styles.footer} ${showUser ? styles.narrow : styles.wide}`}>
      <div className={styles.built_by}>
        <p>
          Built by <b>Peter Simone</b> using
        </p>
        <div>
          <Image src="/next.svg" fill={true} sizes="any" alt="nextjs logo" />
        </div>
      </div>
      <Logo />
    </footer>
  );
};
