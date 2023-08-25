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

    // db.getDataByKey("1234")
    //   .then((data) => console.log(data))
    //   .catch((data) => console.log(data.message));
    // db.getDataByKey("1234").then((data) => console.log(data));
    // db.getDataByKey("1235").then((data) => console.log(data));

    // db.getDataByIndex().then((data) => console.log(data));
    db.getDataByDate()
      .then((data) => console.log(data))
      .catch((data) => console.log(data.message));

    // db.addData([
    //   {
    //     id: "1234",
    //     sportType: "Ride",
    //     startDate: new Date("june 1 2023").valueOf(),
    //     map: {
    //       id: "12345",
    //       summary_polyline: "hey",
    //       resource_state: 2,
    //     },
    //   },
    //   {
    //     id: "1235",
    //     sportType: "Ride",
    //     startDate: new Date("june 2 2023").valueOf(),
    //     map: {
    //       id: "12345",
    //       summary_polyline: "hey",
    //       resource_state: 2,
    //     },
    //   },
    //   {
    //     id: "1236",
    //     sportType: "Run",
    //     startDate: new Date("june 3 2023").valueOf(),
    //     map: {
    //       id: "12345",
    //       summary_polyline: "hey",
    //       resource_state: 2,
    //     },
    //   },
    // ])
    //   .then((data) => console.log(data))
    //   .catch((data) => console.log(data.message));
  }, []);
  return (
    <div className={styles.visual_holder}>
      <Plot />
      <Panel filters={filters} setFilters={setFilters} />
    </div>
  );
};
