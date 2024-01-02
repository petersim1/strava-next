import { User } from "@/_components/user";
import styles from "./styled.module.css";

export default ({ showUser }: { showUser: boolean }): JSX.Element => {
  return (
    <header>
      <nav className={styles.nav}>{showUser && <User />}</nav>
    </header>
  );
};
