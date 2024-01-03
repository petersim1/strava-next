import { User, Disconnect } from "@/_components/user";
import styles from "./styled.module.css";

export default ({ showUser }: { showUser: boolean }): JSX.Element => {
  return (
    <header className={styles.header}>
      <nav className={styles.nav}>
        {showUser && <User />}
        {showUser && <Disconnect />}
      </nav>
    </header>
  );
};
