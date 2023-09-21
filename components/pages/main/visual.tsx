"use client";

import { useState, useMemo } from "react";
import { select } from "d3";

import { useDataFetcher, useDataArrUpdate, useLocalStorage } from "@/lib/hooks";
import { updateLocalStorage } from "@/lib/localStorage";
import { FilteringI, Stores } from "@/types/data";
import { activate, deactivate } from "@/lib/utils/plotting/animate";
import Sidebar from "@/components/visuals/sidebar";
import Plot from "@/components/visuals/plot";
import Toggle from "@/components/visuals/toggle";
import Range from "@/components/visuals/range";
import Loader from "@/components/layout/loader";
import styles from "../styled.module.css";

export default (): JSX.Element => {
  const [boxIndex, setBoxIndex] = useState(0);

  const { filters, setFilters } = useLocalStorage();
  const dataState = useDataFetcher();
  // takes the dataState & filters as dependencies to generate plot data.
  const [plotData, groupings] = useDataArrUpdate({ state: dataState, filters: filters });

  const groupData = useMemo(() => {
    if (plotData.length == 0) return [];
    return groupings[boxIndex].map((i) => plotData[i]);
  }, [boxIndex, groupings, plotData]);

  const handlePanelEnter = (e: React.MouseEvent<HTMLDivElement>): void => {
    const { index } = e.currentTarget.dataset;
    select(`path[data-index='${index}']`).raise().transition().call(activate, 250, true);
  };

  const handlePanelExit = (e: React.MouseEvent<HTMLDivElement>): void => {
    const { index } = e.currentTarget.dataset;
    select(`path[data-index='${index}']`).transition().call(deactivate, 250, filters.opacity, true);
  };

  const handleOpacity = (e: React.FormEvent<HTMLInputElement>): void => {
    const newFilter = { ...filters, opacity: e.currentTarget.value.toString() };
    updateLocalStorage(Stores.FILTER, newFilter as FilteringI);
    setFilters(newFilter);
  };

  const handleBoxIndex = (type: string): void => {
    switch (type) {
      case "UP":
        if (boxIndex < groupings.length - 1) {
          setBoxIndex((prev) => prev + 1);
        }
        break;
      case "DOWN":
        if (boxIndex > 0) {
          setBoxIndex((prev) => prev - 1);
        }
        break;
    }
  };

  return (
    <>
      <Sidebar
        data={groupData}
        dataNumRegions={groupings.length}
        dataTotCount={plotData.length}
        filters={filters}
        loading={dataState.loading}
        setFilters={setFilters}
        handleEnter={handlePanelEnter}
        handleExit={handlePanelExit}
      />
      <div className={styles.plot_holder}>
        {!filters.activity && !dataState.loading && (
          <p className={styles.placeholder}>
            Choose an <b>Activity</b> from the Dropdown
          </p>
        )}
        {filters.activity && !dataState.loading && (
          <Plot data={groupData} opacity={Number(filters.opacity)} />
        )}
        {dataState.loading && <Loader />}
      </div>
      <div className={styles.plot_toggles}>
        <Toggle boxIndex={boxIndex} handleBoxIndex={handleBoxIndex} />
        <Range loading={dataState.loading} filters={filters} handleOpacity={handleOpacity} />
      </div>
    </>
  );
};
