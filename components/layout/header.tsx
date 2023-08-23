import Connect from "@/components/assets/connect";
import styles from "@/styles/layout.module.css";

export default (): JSX.Element => {
  return (
    <header>
      <nav className={styles.header}>
        <div></div>
        <div>
          <Connect />
        </div>
      </nav>
    </header>
  );
};
