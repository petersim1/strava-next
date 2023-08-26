"use client";

import { useState, useEffect } from "react";

import Plot from "@/components/visuals/plot";
import Panel from "@/components/visuals/panel";
import { defaultFilters, filterOptions, fallbackOptions } from "@/lib/constants";
// import { mockIdbData } from "@/lib/constants";
import { getLocalStorage } from "@/lib/localStorage";
import { DB } from "@/lib/indexedDB";
import { FilteringI, Stores, FilterOptionsI } from "@/types/data";
import styles from "../styled.module.css";

export default (): JSX.Element => {
  const [filters, setFilters] = useState<FilteringI>({ ...defaultFilters });
  const [options, setOptions] = useState<FilterOptionsI>(structuredClone(filterOptions));
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    // get the distinct activity types to use in form.
    const db = new DB("activities");
    db.getDistinctKeys("sport")
      .then((data) => {
        setOptions((prev) => ({
          ...prev,
          activity: {
            ...prev.activity,
            options: data,
          },
        }));
      })
      .catch(() => {
        setOptions((prev) => ({
          ...prev,
          activity: {
            ...prev.activity,
            options: fallbackOptions,
          },
        }));
      });
    // db.addData(mockIdbData)
    //   .then((data) => console.log(data))
    //   .catch((data) => console.log(data.message));

    // get stored filtering criteria
    setFilters(getLocalStorage(Stores.FILTER));

    setLoading(false);
  }, []);
  return (
    <div className={styles.visual_holder}>
      <Plot />
      <Panel filters={filters} setFilters={setFilters} loading={loading} filterOptions={options} />
    </div>
  );
};
