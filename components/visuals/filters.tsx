import { Dispatch, SetStateAction, FormEvent } from "react";

import { FilterOptionsI } from "@/types/data";
import { updateLocalStorage } from "@/lib/localStorage";
import { FilteringI, Stores } from "@/types/data";
import styles from "./styled.module.css";

export default ({
  filters,
  loading,
  filterOptions,
  setFilters,
  opacity,
  handleOpacity,
}: {
  filters: FilteringI;
  loading: boolean;
  filterOptions: FilterOptionsI;
  setFilters: Dispatch<SetStateAction<FilteringI>>;
  opacity: number;
  handleOpacity: (e: FormEvent<HTMLInputElement>) => void;
}): JSX.Element => {
  const handleSubmit = (event: React.ChangeEvent<HTMLFormElement>): void => {
    event.preventDefault();
    const formData = Object.fromEntries(new FormData(event.target));
    updateLocalStorage(Stores.FILTER, formData as FilteringI);
    setFilters(formData as FilteringI);
  };

  return (
    <div className={styles.filters}>
      <form onSubmit={handleSubmit}>
        {Object.entries(filterOptions).map(([key, filter], ind) => (
          <div key={ind}>
            <label htmlFor={key}>{filter.name}</label>
            {filter.type === "select" && (
              <select
                name={key}
                required={filter.required}
                disabled={loading}
                defaultValue={filters[key as keyof typeof filters]}
              >
                {/* Adding a value here makes it always be considered the default... removed it. */}
                <option disabled>--Select an option--</option>
                {filter.options.map((option, ind2) => (
                  <option key={ind2} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            )}
            {filter.type === "date" && (
              <input
                type="date"
                name={key}
                required={filter.required}
                disabled={loading}
                defaultValue={filters[key as keyof typeof filters]}
              />
            )}
          </div>
        ))}
        <button type="submit">submit</button>
      </form>
      <div>
        <label htmlFor="opacity">Adjust Brightness</label>
        <input
          name="opacity"
          type="range"
          min={0}
          max={1}
          step={0.05}
          value={opacity}
          onChange={handleOpacity}
        />
      </div>
    </div>
  );
};
