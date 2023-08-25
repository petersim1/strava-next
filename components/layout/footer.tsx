import Image from "next/image";

import styles from "./styled.module.css";

export default (): JSX.Element => {
  return (
    <footer className={styles.footer}>
      <div className={styles.built_by}>
        <p>
          Built by <b>Peter Simone</b> using
        </p>
        <div>
          <Image src="/next.svg" fill={true} sizes="any" alt="nextjs logo" />
        </div>
      </div>
    </footer>
  );
};
