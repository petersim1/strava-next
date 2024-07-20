"use client";

import { useEffect, useReducer, useState, Dispatch, SetStateAction, useRef } from "react";
import { dataStatusReducer } from "@/_lib/reducers";
import { RequestError } from "@/_lib/errors";
import { defaultFilters } from "@/_lib/constants";
import {
  DataStateI,
  FilteringI,
  StravaActivitySimpleI,
  PlotDataI,
  Stores,
  DataCountI,
} from "@/_types/data";
import { getGroupings } from "@/_lib/utils/plotting/box";
import { decodePolyline } from "@/_lib/utils/plotting/route";
import { DB } from "@/_lib/indexedDB";
import { getLocalStorage } from "@/_lib/localStorage";

export const useDataFetcher = (): { state: DataStateI; counts: DataCountI } => {
  const [page, setPage] = useState(1);
  const [fetchSince, setFetchSince] = useState<number | null>(null);
  const db = useRef<DB>();

  const [state, dispatch] = useReducer(dataStatusReducer, {
    error: false,
    loading: false,
    done: false,
  });

  const [counts, setCounts] = useState({
    total: 0,
    relevant: 0,
  });

  useEffect(() => {
    db.current = new DB("strava");
    db.current.getMostRecent().then((result: number) => {
      setFetchSince(result);
      dispatch({ type: "LOADING" });
    });
  }, []);

  useEffect(() => {
    if (fetchSince === null) return;
    // on page refresh, wait until mounted to grab the date of last pull from indexedDB.
    // use this to fetch only those recent activities (if any).

    // rather than relying on long-lasting server requests (Don't work in serverless),
    // we can effectively do "recursion" on the client.

    const getData = async (): Promise<void> => {
      fetch(`/api/strava/activities?after=${fetchSince}&page=${page}`)
        .then((response) => {
          if (!response.ok) {
            throw new RequestError(response.statusText, response.status);
          }
          return response.json();
        })
        .then(async (result) => {
          const { results: activities, more, nTotal, nRelevant } = result;
          await db.current!.addData(activities);
          setCounts((prev) => ({
            total: prev.total + nTotal,
            relevant: prev.relevant + nRelevant,
          }));

          if (more) {
            setPage((prev) => prev + 1);
          } else {
            dispatch({ type: "DONE" });
          }
        })
        .catch((error) => {
          console.log(error);
          dispatch({ type: "ERROR" });
        });
    };

    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, fetchSince]);

  return { state, counts };
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
        console.log(decoded);
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
