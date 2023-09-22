import { FilteringI, Stores } from "@/_types/data";
import { defaultFilters } from "@/_lib/constants";

export const getLocalStorage = (key: Stores): FilteringI | number => {
  const filter = localStorage.getItem(key);

  if (!filter) {
    // set localstorage to default if it hasn't been created yet.
    if (key === Stores.FILTER) {
      localStorage.setItem(key, JSON.stringify(defaultFilters));
    } else {
      localStorage.setItem(key, JSON.stringify(0));
    }
    return defaultFilters;
  }
  return JSON.parse(filter);
};

export const updateLocalStorage = (key: Stores, data: FilteringI | number): void => {
  localStorage.setItem(key, JSON.stringify(data));
};

export const clearLocalStorage = (key: Stores): void => {
  localStorage.removeItem(key);
};
