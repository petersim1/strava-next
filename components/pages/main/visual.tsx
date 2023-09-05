"use client";

import { useState } from "react";

import Plot from "@/components/visuals/plot";
import Filters from "@/components/visuals/filters";
import Panel from "@/components/visuals/panel";
import { useDataFetcher, useDataArrUpdate, useLocalStorage } from "@/lib/hooks";
import styles from "../styled.module.css";

export default (): JSX.Element => {
  const [opacity, setOpacity] = useState(0.5);
  const [boxIndex, setBoxIndex] = useState(0);

  const { filters, setFilters } = useLocalStorage();
  const dataState = useDataFetcher();
  // takes the dataState & filters as dependencies to generate plot data.
  const [plotData, groupings] = useDataArrUpdate({ state: dataState, filters: filters });

  const handleOpacity = (e: React.FormEvent<HTMLInputElement>): void => {
    setOpacity(Number(e.currentTarget.value));
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
    <div className={styles.visual_holder}>
      {dataState.done && (
        <div style={{ gridRow: "1 / 2", gridColumn: "2 / 3", alignSelf: "flex-start" }}>
          {groupings.length} region(s) detected
        </div>
      )}
      <Plot
        plotData={plotData}
        dataState={dataState}
        opacity={opacity}
        groupings={groupings}
        boxIndex={boxIndex}
      />
      <Panel plotData={plotData} opacity={opacity} groupings={groupings} boxIndex={boxIndex} />
      <Filters
        filters={filters}
        loading={dataState.loading}
        opacity={opacity}
        boxIndex={boxIndex}
        setFilters={setFilters}
        handleOpacity={handleOpacity}
        handleBoxIndex={handleBoxIndex}
      />
    </div>
  );
};
