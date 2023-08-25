"use client";

import { useState, useEffect } from "react";

import Plot from "@/components/visuals/plot";
import Panel from "@/components/visuals/panel";
import { defaultFilters } from "@/lib/constants";
import { getLocalStorage } from "@/lib/localStorage";
import { DB } from "@/lib/indexedDB";
import { FilteringI } from "@/types/data";
import styles from "../styled.module.css";

export default (): JSX.Element => {
  const [filters, setFilters] = useState<FilteringI>({ ...defaultFilters });
  useEffect(() => {
    // get stored filtering criteria
    setFilters(getLocalStorage());
    const db = new DB("activities");
    console.log(db.version);

    // db.getDataByKey("1234").then((data) => console.log(data));
    // db.getDataByKey("1235").then((data) => console.log(data));

    // db.getDataByIndex().then((data) => console.log(data));

    // db.addData([
    //   {
    //     id: "1236",
    //     sportType: "Run",
    //     startDate: "june 1",
    //     map: {
    //       id: "12345",
    //       summary_polyline: "hey",
    //       resource_state: 2,
    //     },
    //   },
    // ]);
  }, []);
  return (
    <div className={styles.visual_holder}>
      <Plot />
      <Panel filters={filters} setFilters={setFilters} />
    </div>
  );
};
