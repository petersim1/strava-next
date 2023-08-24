import { FilteringI } from "@/types/data";

const defaultFilters = {
  activity: undefined,
  startDate: undefined,
  endDate: undefined,
};

export const getLocalStorage = (): FilteringI => {
  const filter = localStorage.getItem("filtering");

  if (!filter) return defaultFilters;
  return JSON.parse(filter);
};

export const updateLocalStorage = (data: FilteringI): void => {
  localStorage.setItem("filtering", JSON.stringify(data));
};
