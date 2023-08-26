"use client";

import { useState, useEffect } from "react";

import Plot from "@/components/visuals/plot";
import Panel from "@/components/visuals/panel";
import { defaultFilters, filterOptions, fallbackOptions } from "@/lib/constants";
// import { mockIdbData } from "@/lib/constants";
import { getLocalStorage, updateLocalStorage } from "@/lib/localStorage";
import { DB } from "@/lib/indexedDB";
import { FilteringI, Stores, FilterOptionsI, StravaActivitySimpleI } from "@/types/data";
import styles from "../styled.module.css";

export default (): JSX.Element => {
  const [filters, setFilters] = useState<FilteringI>({ ...defaultFilters });
  const [options, setOptions] = useState<FilterOptionsI>(structuredClone(filterOptions));
  const [loading, setLoading] = useState(true);
  const [fetched, setFetched] = useState(false);
  const [plotData, setPlotData] = useState<StravaActivitySimpleI[]>([]);

  useEffect(() => {
    const now = new Date().valueOf();
    const lastPull = getLocalStorage(Stores.DATE);
    const db = new DB("activities");

    fetch(`/api/strava/activities?after=${lastPull}`)
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        throw new Error("Couldn't fetch from api");
      })
      .then((data) => {
        if (data.length) {
          return db.addData(data);
        }
        throw new Error("Nothing to add to indexedDB");
      })
      .then((ok) => {
        if (!ok) {
          throw new Error("unsuccessful at adding to indexedDB");
        }
        updateLocalStorage(Stores.DATE, now);
      })
      .catch((error) => {
        console.log(error.message);
      })
      .finally(() => {
        // might need to conditionally update this. If fetch fails, or if indexedDB doesn't update
        // I probably don't want to mark this as fetched.
        setFetched(true);
      });
  }, []);

  useEffect(() => {
    if (fetched) {
      const db = new DB("activities");
      // get the distinct activity types to use in form.
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
      setFilters(getLocalStorage(Stores.FILTER) as FilteringI);

      setLoading(false);
    }
  }, [fetched]);

  useEffect(() => {
    if (!loading && filters.activity) {
      const db = new DB("activities");
      let sDate = undefined;
      let tDate = undefined;
      if (filters.startDate) {
        sDate = new Date(filters.startDate).valueOf();
      }
      if (filters.endDate) {
        tDate = new Date(filters.endDate).valueOf();
      }

      db.getDataFilter({ sportType: filters.activity, fromDate: sDate, toDate: tDate })
        .then((data) => {
          setPlotData(data);
        })
        .catch((error) => {
          console.log(error);
          setPlotData([]);
        });
    }
  }, [filters, loading]);

  return (
    <div className={styles.visual_holder}>
      <Plot plotData={plotData} />
      <Panel filters={filters} setFilters={setFilters} loading={loading} filterOptions={options} />
    </div>
  );
};
