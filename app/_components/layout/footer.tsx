import Image from "next/image";

import { getUser } from "@/_actions";
import { Logo } from "@/_components/assets";
import styles from "./styled.module.css";

export default async (): Promise<JSX.Element> => {
  const { authed, user } = await getUser();
  return (
    <footer className={`${styles.footer} ${authed && user ? styles.narrow : styles.wide}`}>
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
