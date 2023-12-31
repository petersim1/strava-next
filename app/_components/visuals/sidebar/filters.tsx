import { Dispatch, SetStateAction, useState, useEffect } from "react";

import { Cycling, Running } from "@/_components/assets";
import { updateLocalStorage } from "@/_lib/localStorage";
import { FilteringI, Stores } from "@/_types/data";
import { defaultFilters } from "@/_lib/constants";
import styles from "./styled.module.css";

export default ({
  filters,
  loading,
  setFilters,
  setBoxIndex,
}: {
  filters: FilteringI;
  loading: boolean;
  setFilters: Dispatch<SetStateAction<FilteringI>>;
  setBoxIndex: Dispatch<SetStateAction<number>>;
}): JSX.Element => {
  // setting a defaultValue wasn't working as expected,
  // likely because it's mounting before having access to localstorage states.
  // using value alone will update the value when localstorage is available.
  // This tells me to use useState with value instead.
  const [selection, setSelection] = useState<FilteringI>({ ...defaultFilters });

  useEffect(() => {
    setSelection(filters);
  }, [filters]);

  const handleSubmit = (event: React.ChangeEvent<HTMLFormElement>): void => {
    event.preventDefault();
    setBoxIndex(0);
    const formData = Object.fromEntries(new FormData(event.target));
    formData.opacity = filters.opacity;
    updateLocalStorage(Stores.FILTER, formData as FilteringI);
    setFilters(formData as FilteringI);
  };

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>): void => {
    const { name, value } = e.currentTarget;
    console.log(name, value);
    setSelection((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className={styles.filters}>
      <form onSubmit={handleSubmit}>
        <div className={styles.wide}>
          <label>Activity</label>
          <div>
            <input
              type="radio"
              id="Ride"
              name="activity"
              value="Ride"
              onChange={handleChange}
              checked={selection.activity == "Ride"}
            />
            <label htmlFor="Ride">
              <span>cycling</span>
              <Cycling fill="currentColor" height="20px" width="20px" />
            </label>
          </div>
          <div>
            <input
              type="radio"
              id="Run"
              name="activity"
              value="Run"
              onChange={handleChange}
              checked={selection.activity == "Run"}
            />
            <label htmlFor="Run">
              <span>running</span>
              <Running fill="currentColor" height="20px" width="20px" />
            </label>
          </div>
        </div>
        <div className={styles.small}>
          <label htmlFor="startDate">Date From</label>
          <input
            type="date"
            name="startDate"
            required={false}
            disabled={loading}
            value={selection.startDate}
            onChange={handleChange}
          />
        </div>
        <div className={styles.small}>
          <label htmlFor="endDate">Date To</label>
          <input
            type="date"
            name="endDate"
            required={false}
            disabled={loading}
            value={selection.endDate}
            onChange={handleChange}
          />
        </div>
        <button type="submit" className={styles.submit}>
          submit
        </button>
      </form>
    </div>
  );
};
