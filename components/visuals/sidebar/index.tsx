import { Dispatch, SetStateAction, FormEvent } from "react";

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
  boxIndex,
  setFilters,
  handleOpacity,
  handleBoxIndex,
  handleEnter,
  handleExit,
}: {
  data: PlotDataI[];
  dataNumRegions: number;
  dataTotCount: number;
  filters: FilteringI;
  loading: boolean;
  boxIndex: number;
  setFilters: Dispatch<SetStateAction<FilteringI>>;
  handleOpacity: (e: FormEvent<HTMLInputElement>) => void;
  handleBoxIndex: (type: string) => void;
  handleEnter: (e: React.MouseEvent<HTMLDivElement>) => void;
  handleExit: (e: React.MouseEvent<HTMLDivElement>) => void;
}): JSX.Element => {
  return (
    <div className={styles.panel}>
      <div className={styles.header}>
        <p>{dataTotCount} Total Activities</p>
        <p>{dataNumRegions} Regions Detected</p>
      </div>
      <Activities data={data} handleEnter={handleEnter} handleExit={handleExit} />
      <Filters
        filters={filters}
        loading={loading}
        boxIndex={boxIndex}
        setFilters={setFilters}
        handleOpacity={handleOpacity}
        handleBoxIndex={handleBoxIndex}
      />
    </div>
  );
};
