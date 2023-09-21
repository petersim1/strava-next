import { FormEvent } from "react";

import { FilteringI } from "@/types/data";
import styles from "./styled.module.css";

export default ({
  loading,
  filters,
  handleOpacity,
}: {
  filters: FilteringI;
  loading: boolean;
  handleOpacity: (e: FormEvent<HTMLInputElement>) => void;
}): JSX.Element => {
  return (
    <div className={styles.toggle}>
      <label htmlFor="opacity">Adjust Brightness</label>
      <input
        name="opacity"
        type="range"
        disabled={loading}
        min={0}
        max={1}
        step={0.05}
        value={filters.opacity ?? 0.5}
        onChange={handleOpacity}
      />
    </div>
  );
};
