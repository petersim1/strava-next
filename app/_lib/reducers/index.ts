import { DataStateI } from "@/_types/data";

export const dataStatusReducer = (state: DataStateI, action: { type: string }): DataStateI => {
  switch (action.type) {
    case "DONE":
      return { ...state, done: true, loading: false };
    case "ERROR":
      return { ...state, error: true, loading: false };
    case "LOADING":
      return { ...state, loading: true };
    default:
      return state;
  }
};
