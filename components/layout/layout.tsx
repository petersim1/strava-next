import styles from "@/styles/layout.module.css";

export default ({ children }: { children: React.ReactNode }): JSX.Element => {
  return <div className={styles.layout}>{children}</div>;
};
