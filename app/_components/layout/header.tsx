import { User } from "@/_components/user";
import styles from "./styled.module.css";
import { getUser } from "@/_actions";

export default async (): Promise<JSX.Element> => {
  const { authed, user } = await getUser();
  return (
    <header>
      <nav className={styles.nav}>{authed && user && <User user={user} />}</nav>
    </header>
  );
};
