import { FilteringI } from "@/types/data";

import { defaultFilters } from "@/lib/constants";

export const getLocalStorage = (): FilteringI => {
  const filter = localStorage.getItem("filtering");

  if (!filter) {
    // set localstorage to default if it hasn't been created yet.
    localStorage.setItem("filtering", JSON.stringify(defaultFilters));
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
