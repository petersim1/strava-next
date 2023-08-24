import styles from "../styled.module.css";

import Panel from "@/components/visuals/panel";

export default (): JSX.Element => {
  return (
    <div className={styles.visual_holder}>
      <Panel />
    </div>
  );
};
