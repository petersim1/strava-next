// import Connect from "@/components/assets/connect";
import styles from "./styled.module.css";
import { getUser } from "@/actions";
import Disconnect from "@/components/assets/disconnect";
import User from "@/components/assets/user";

export default async (): Promise<JSX.Element> => {
  const { authed, user } = await getUser();
  return (
    <header>
      <nav className={styles.header}>
        {authed && user && <User user={user} />}
        {authed && <Disconnect />}
      </nav>
    </header>
  );
};
