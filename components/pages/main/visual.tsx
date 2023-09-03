"use client";

import { useState } from "react";

import Plot from "@/components/visuals/plot";
import Filters from "@/components/visuals/filters";
import Panel from "@/components/visuals/panel";
import { useDataFetcher, useDataArrUpdate, useLocalStorage } from "@/lib/hooks";
import styles from "../styled.module.css";

export default (): JSX.Element => {
  const [opacity, setOpacity] = useState(0.5);

  const handleOpacity = (e: React.FormEvent<HTMLInputElement>): void => {
    setOpacity(Number(e.currentTarget.value));
  };

  const { filters, setFilters } = useLocalStorage();
  const dataState = useDataFetcher();
  // takes the dataState & filters as dependencies to generate plot data.
  const plotData = useDataArrUpdate({ state: dataState, filters: filters });

  return (
    <div className={styles.visual_holder}>
      <Plot plotData={plotData} dataState={dataState} opacity={opacity} />
      <Panel plotData={plotData} opacity={opacity} />
      <Filters
        filters={filters}
        setFilters={setFilters}
        loading={dataState.loading}
        opacity={opacity}
        handleOpacity={handleOpacity}
      />
    </div>
  );
};
