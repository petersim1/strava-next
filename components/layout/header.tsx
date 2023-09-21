import User from "@/components/user/user";
import styles from "./styled.module.css";
import { getUser } from "@/actions";

export default async (): Promise<JSX.Element> => {
  const { authed, user } = await getUser();
  return (
    <header>
      <nav className={styles.nav}>{authed && user && <User user={user} />}</nav>
    </header>
  );
};
