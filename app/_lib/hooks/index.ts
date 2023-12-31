"use client";

import { useEffect, useReducer, useState, Dispatch, SetStateAction } from "react";
import { dataStatusReducer } from "@/_lib/reducers";
import { RequestError } from "@/_lib/errors";
import { defaultFilters } from "@/_lib/constants";
import { DataStateI, FilteringI, StravaActivitySimpleI, PlotDataI, Stores } from "@/_types/data";
import { getGroupings } from "@/_lib/utils/plotting/box";
import { decodePolyline } from "@/_lib/utils/plotting/route";
import { DB } from "@/_lib/indexedDB";
import { getLocalStorage } from "@/_lib/localStorage";

export const useDataFetcher = (): DataStateI => {
  const [state, dispatch] = useReducer(dataStatusReducer, {
    error: false,
    loading: true,
    done: false,
  });
  // on page refresh, wait until mounted to grab the date of last pull from indexedDB.
  // use this to fetch only those recent activities (if any).
  useEffect(() => {
    const db = new DB("strava");

    db.getMostRecent()
      .then((result: number) => {
        // it seems strava API is EXCLUSIVE, so I don't need to add 1000ms.
        // Either way, indexeddb using "put", so duplicated id's won't exist.
        return fetch(`/api/strava/activities?after=${result}`);
      })
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        throw new RequestError(response.statusText, response.status);
      })
      .then((data) => {
        return db.addData(data);
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
}): [PlotDataI[], number[][]] => {
  // whenever the filters are updated, or the fetch state is done,
  // grab associated data from indexedDB.
  const [data, setData] = useState<PlotDataI[]>([]);
  const [groupings, setGroupings] = useState<number[][]>([]);

  useEffect(() => {
    if (!state.done || !filters.activity) return;
    const db = new DB("strava");
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
        const decoded = results
          .filter((d) => !!d.map.summary_polyline)
          .map((d) => decodePolyline(d));
        const groups = getGroupings(decoded);
        setData(decoded);
        setGroupings(groups);
      })
      .catch((error) => {
        console.log(error);
        setData([]);
      });
  }, [filters, state.done]);

  return [data, groupings];
};

export const useLocalStorage = (): {
  filters: FilteringI;
  setFilters: Dispatch<SetStateAction<FilteringI>>;
} => {
  const [filters, setFilters] = useState<FilteringI>({ ...defaultFilters });
  useEffect(() => {
    setFilters(getLocalStorage(Stores.FILTER) as FilteringI);
  }, []);

  return {
    filters,
    setFilters,
  };
};
