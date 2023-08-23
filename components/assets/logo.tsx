import Image from "next/image";
import styles from "./styled.module.css";

export default (): JSX.Element => {
  return (
    <div className={styles.logo}>
      <Image src="/strava_stacked.svg" fill={true} alt="strava logo" sizes="any" />
    </div>
  );
};
