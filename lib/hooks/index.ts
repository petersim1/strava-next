"use client";

import { useEffect, useReducer, useState } from "react";
import { dataStatusReducer } from "@/lib/reducers";
import { getLocalStorage, updateLocalStorage } from "@/lib/localStorage";
import { RequestError } from "@/lib/errors";
import { Stores, DataStateI, FilteringI, StravaActivitySimpleI, PlotDataI } from "@/types/data";
import { decodePolyline } from "@/lib/utils/plotting";
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
    const db = new DB("activities");
    const lastPull = getLocalStorage(Stores.DATE);

    fetch(`/api/strava/activities?after=${lastPull}`)
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        throw new RequestError(response.statusText, response.status);
      })
      .then((data) => {
        return db.addData(data);
      })
      .then(() => {
        updateLocalStorage(Stores.DATE, now);
      })
      .catch((error) => {
        console.log(error.message);
        dispatch({ type: "ERROR" });
      })
      .finally(() => {
        // Will be marked as DONE no matter what, but error=true if an error occurs.
        // make sure to check for this in conditional UI renders.
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
}): PlotDataI[] => {
  // whenever the filters are updated, or the fetch state is done, grab associated data from indexedDB.
  const [data, setData] = useState<PlotDataI[]>([]);

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
        const decoded = results.map((d) => decodePolyline(d));
        setData(decoded);
      })
      .catch((error) => {
        console.log(error);
        setData([]);
      });
  }, [filters, state.done]);

  return data;
};
