"use client";

import { useEffect, useState } from "react";

import Plot from "@/components/visuals/plot";
import Panel from "@/components/visuals/panel";
import { defaultFilters, filterOptions } from "@/lib/constants";
import { FilteringI, Stores } from "@/types/data";
import { useDataFetcher, useDataArrUpdate } from "@/lib/hooks";
import styles from "../styled.module.css";
import { getLocalStorage } from "@/lib/localStorage";

export default (): JSX.Element => {
  const [filters, setFilters] = useState<FilteringI>({ ...defaultFilters });
  // const [options, setOptions] = useState<FilterOptionsI>(structuredClone(filterOptions));
  // const [loading, setLoading] = useState(true);

  useEffect(() => {
    setFilters(getLocalStorage(Stores.FILTER) as FilteringI);
  }, []);

  const dataState = useDataFetcher();
  // takes the dataState & filters as dependencies to generate plot data.
  const plotData = useDataArrUpdate({ state: dataState, filters: filters });

  return (
    <div className={styles.visual_holder}>
      <Plot plotData={plotData} />
      <Panel
        filters={filters}
        setFilters={setFilters}
        loading={dataState.loading}
        filterOptions={filterOptions}
      />
    </div>
  );
};
