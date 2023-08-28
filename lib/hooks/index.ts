"use client";

import { useEffect, useReducer, useState } from "react";
import { dataStatusReducer } from "@/lib/reducers";
import { getLocalStorage, updateLocalStorage } from "@/lib/localStorage";
import { Stores, DataStateI, FilteringI, StravaActivitySimpleI, PlotDataI } from "@/types/data";
import { decodePolyline } from "@/lib/utils";
import { DB } from "@/lib/indexedDB";

export const useDataFetcher = (): DataStateI => {
  const [state, dispatch] = useReducer(dataStatusReducer, {
    error: false,
    loading: true,
    done: false,
  });
  // on page refresh, wait until mounted to grab the date of last pull from localstorage
  // use this to fetch only those recent activities (if any), and update  localstorage if fetch succeeded.
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
        return db.addData(data);
      })
      .then((ok) => {
        if (!ok) {
          throw new Error("unsuccessful at adding to indexedDB");
        }
        updateLocalStorage(Stores.DATE, now);
      })
      .catch((error) => {
        console.log(error.message);
        dispatch({ type: "ERROR" });
      })
      .finally(() => {
        // might need to conditionally update this. If fetch fails, or if indexedDB doesn't update
        // I probably don't want to mark this as fetched.
        dispatch({ type: "DONE" });
      });
  }, []);

  return state;
};

export const useDataArrUpdate = ({
  state,
  filters,
}: {
  state: DataStateI;
  filters: FilteringI;
}): PlotDataI[][] => {
  // whenever the filters are updated, or the fetch state is done, grab associated data from indexedDB.
  const [data, setData] = useState<PlotDataI[][]>([]);

  useEffect(() => {
    if (!state.done || !filters.activity) return;
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
      .then((results: StravaActivitySimpleI[]) => {
        const decoded = results.map((d) => decodePolyline(d.map.summary_polyline));
        setData(decoded);
      })
      .catch((error) => {
        console.log(error);
        setData([]);
      });
  }, [filters, state.done]);

  return data;
};
