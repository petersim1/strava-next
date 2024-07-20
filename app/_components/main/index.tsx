"use client";

import { useState, useMemo } from "react";
import { select } from "d3";

import { useDataFetcher, useDataArrUpdate, useLocalStorage } from "@/_lib/hooks";
import { updateLocalStorage } from "@/_lib/localStorage";
import { FilteringI, Stores } from "@/_types/data";
import { activate, deactivate } from "@/_lib/utils/plotting/animate";
import Plot, { Sidebar, Toggle, Range } from "@/_components/visuals";
import Loader from "@/_components/layout/loader";
import styles from "./styled.module.css";

export default (): JSX.Element => {
  const [boxIndex, setBoxIndex] = useState(0);
  const [filterOpen, setFilterOpen] = useState(false);

  const { filters, setFilters } = useLocalStorage();
  const { state: dataState, counts } = useDataFetcher();
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

  const handleFilterOpen = (): void => {
    setFilterOpen(!filterOpen);
  };

  return (
    <>
      <Sidebar
        data={groupData}
        dataNumRegions={groupings.length}
        dataTotCount={plotData.length}
        filters={filters}
        loading={dataState.loading}
        filterOpen={filterOpen}
        setFilters={setFilters}
        setBoxIndex={setBoxIndex}
        handleEnter={handlePanelEnter}
        handleExit={handlePanelExit}
        handleOpen={handleFilterOpen}
      />
      <div className={styles.plot_holder}>
        {!filters.activity && dataState.done && !dataState.error && (
          <p className={styles.placeholder}>
            Select an <b>Activity</b> to get started
          </p>
        )}
        {dataState.error && (
          <p className={styles.placeholder}>Something went wrong, try again later.</p>
        )}
        {filters.activity && !dataState.loading && (
          <Plot data={groupData} opacity={Number(filters.opacity)} />
        )}
        {dataState.loading && (
          <div className={styles.loader_holder}>
            <Loader />
            <div>
              <p>
                Total Activities Found: <span>{counts.total}</span>
              </p>
              <p>
                Rides / Runs Found: <span>{counts.relevant}</span>
              </p>
            </div>
          </div>
        )}
      </div>
      <div className={styles.plot_toggles}>
        <Toggle boxIndex={boxIndex} handleBoxIndex={handleBoxIndex} />
        <Range loading={dataState.loading} filters={filters} handleOpacity={handleOpacity} />
      </div>
    </>
  );
};
