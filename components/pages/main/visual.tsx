"use client";

import { useState, useEffect } from "react";

import Plot from "@/components/visuals/plot";
import Panel from "@/components/visuals/panel";
import { defaultFilters } from "@/lib/constants";
import { mockIdbData } from "@/lib/constants";
import { getLocalStorage } from "@/lib/localStorage";
import { DB } from "@/lib/indexedDB";
import { FilteringI } from "@/types/data";
import styles from "../styled.module.css";

export default (): JSX.Element => {
  const [filters, setFilters] = useState<FilteringI>({ ...defaultFilters });
  useEffect(() => {
    // get stored filtering criteria
    // setFilters(getLocalStorage());
    const db = new DB("activities");

    db.getDistinctKeys("sport")
      .then((data) => console.log(data))
      .catch((data) => console.log(data));

    // db.getDataByKey("1234")
    //   .then((data) => console.log(data))
    //   .catch((data) => console.log(data.message));
    // db.getDataByKey("1234").then((data) => console.log(data));
    // db.getDataByKey("1235").then((data) => console.log(data));

    // db.getDataByIndex().then((data) => console.log(data));
    // db.getDataByDate({ toDate: new Date("06/02/2023").valueOf() })
    //   .then((data) => console.log(data))
    //   .catch((data) => console.log(data.message));

    // db.getDataFilter({ sportType: "Ride", toDate: new Date("06/03/2023").valueOf() })
    //   .then((data) => console.log(data))
    //   .catch((data) => console.log(data));

    // db.addData(mockIdbData)
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
