import { Dispatch, SetStateAction } from "react";

import { PlotDataI, FilteringI } from "@/types/data";
import styles from "./styled.module.css";
import Activities from "./activities";
import Filters from "./filters";

export default ({
  data,
  dataNumRegions,
  dataTotCount,
  filters,
  loading,
  setFilters,
  handleEnter,
  handleExit,
}: {
  data: PlotDataI[];
  dataNumRegions: number;
  dataTotCount: number;
  filters: FilteringI;
  loading: boolean;
  setFilters: Dispatch<SetStateAction<FilteringI>>;
  handleEnter: (e: React.MouseEvent<HTMLDivElement>) => void;
  handleExit: (e: React.MouseEvent<HTMLDivElement>) => void;
}): JSX.Element => {
  return (
    <div className={styles.panel}>
      <div className={styles.header}>
        <p>Total Activities: {dataTotCount}</p>
        <p>Regions Detected: {dataNumRegions}</p>
      </div>
      <Activities data={data} handleEnter={handleEnter} handleExit={handleExit} />
      <Filters filters={filters} loading={loading} setFilters={setFilters} />
    </div>
  );
};
