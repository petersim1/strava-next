import Logo from "@/components/assets/logo";
import styles from "@/styles/layout.module.css";

export default (): JSX.Element => {
  return (
    <footer className={styles.footer}>
      <Logo />
    </footer>
  );
};
