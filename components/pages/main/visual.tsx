"use client";

import { useEffect, useState } from "react";

import Plot from "@/components/visuals/plot";
import Filters from "@/components/visuals/filters";
import Panel from "@/components/visuals/panel";
import { defaultFilters, filterOptions } from "@/lib/constants";
import { FilteringI, Stores } from "@/types/data";
import { useDataFetcher, useDataArrUpdate } from "@/lib/hooks";
import styles from "../styled.module.css";
import { getLocalStorage } from "@/lib/localStorage";

export default (): JSX.Element => {
  const [filters, setFilters] = useState<FilteringI>({ ...defaultFilters });
  const [opacity, setOpacity] = useState(0.5);
  // const [options, setOptions] = useState<FilterOptionsI>(structuredClone(filterOptions));
  // const [loading, setLoading] = useState(true);

  const handleOpacity = (e: React.FormEvent<HTMLInputElement>): void => {
    setOpacity(Number(e.currentTarget.value));
  };

  useEffect(() => {
    setFilters(getLocalStorage(Stores.FILTER) as FilteringI);
  }, []);

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
        filterOptions={filterOptions}
        opacity={opacity}
        handleOpacity={handleOpacity}
      />
    </div>
  );
};
