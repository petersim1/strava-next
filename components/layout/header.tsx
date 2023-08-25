import Disconnect from "@/components/user/disconnect";
import User from "@/components/user/user";
import Logo from "@/components/assets/logo";
import styles from "./styled.module.css";
import { getUser } from "@/actions";

export default async (): Promise<JSX.Element> => {
  const { authed, user } = await getUser();
  return (
    <header>
      <nav className={styles.header}>
        {authed && user && <User user={user} />}
        <Logo />
        {authed && <Disconnect />}
      </nav>
    </header>
  );
};
