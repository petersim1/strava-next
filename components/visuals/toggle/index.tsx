import styles from "./styled.module.css";

export default ({
  boxIndex,
  handleBoxIndex,
}: {
  boxIndex: number;
  handleBoxIndex: (type: string) => void;
}): JSX.Element => {
  return (
    <div className={styles.box_toggle}>
      <div className={styles.box_toggle_btns}>
        <div onClick={(): void => handleBoxIndex("DOWN")} className={styles.btn}>
          {"<-"}
        </div>
        <div className={styles.number}>{boxIndex + 1}</div>
        <div onClick={(): void => handleBoxIndex("UP")} className={styles.btn}>
          {"->"}
        </div>
      </div>
    </div>
  );
};
