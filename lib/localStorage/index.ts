import { FilteringI, Stores } from "@/types/data";

import { defaultFilters } from "@/lib/constants";

export const getLocalStorage = (key: Stores): FilteringI => {
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

export const updateLocalStorage = (data: FilteringI): void => {
  localStorage.setItem("filtering", JSON.stringify(data));
};

export const clearLocalStorage = (): void => {
  localStorage.removeItem("filtering");
};
