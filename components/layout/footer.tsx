import Image from "next/image";

import Logo from "@/components/assets/logo";
import styles from "./styled.module.css";

export default (): JSX.Element => {
  return (
    <footer className={styles.footer}>
      <div className={styles.built_by}>
        <p>
          By <b>Peter Simone</b> using
        </p>
        <div>
          <Image src="/next.svg" fill={true} sizes="any" alt="nextjs logo" />
        </div>
      </div>
      <Logo />
    </footer>
  );
};
