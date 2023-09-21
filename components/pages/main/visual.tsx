"use client";

import { useState, useMemo } from "react";
import { select } from "d3";

import Sidebar from "@/components/visuals/sidebar";
import Plot from "@/components/visuals/plot";
import { useDataFetcher, useDataArrUpdate, useLocalStorage } from "@/lib/hooks";
import { updateLocalStorage } from "@/lib/localStorage";
import { FilteringI, Stores } from "@/types/data";
import { activate, deactivate } from "@/lib/utils/plotting/animate";

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
        boxIndex={boxIndex}
        setFilters={setFilters}
        handleOpacity={handleOpacity}
        handleBoxIndex={handleBoxIndex}
        handleEnter={handlePanelEnter}
        handleExit={handlePanelExit}
      />
      <Plot data={groupData} dataState={dataState} opacity={Number(filters.opacity)} />
    </>
  );

  // return (
  //   <div className={styles.visual_holder}>
  //     {dataState.done && (
  //       <div style={{ gridRow: "1 / 2", gridColumn: "2 / 3", alignSelf: "flex-start" }}>
  //         {groupings.length} region(s) detected
  //       </div>
  //     )}
  //     <Plot
  //       plotData={plotData}
  //       dataState={dataState}
  //       opacity={Number(filters.opacity)}
  //       groupings={groupings}
  //       boxIndex={boxIndex}
  //     />
  //     <Panel
  //       plotData={plotData}
  //       opacity={Number(filters.opacity)}
  //       groupings={groupings}
  //       boxIndex={boxIndex}
  //     />
  //     <Filters
  //       filters={filters}
  //       loading={dataState.loading}
  //       boxIndex={boxIndex}
  //       setFilters={setFilters}
  //       handleOpacity={handleOpacity}
  //       handleBoxIndex={handleBoxIndex}
  //     />
  //   </div>
  // );
};
