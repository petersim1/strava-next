import { Dispatch, SetStateAction } from "react";

import { filterOptions } from "@/lib/constants";
import { updateLocalStorage } from "@/lib/localStorage";
import { FilteringI } from "@/types/data";
import styles from "./styled.module.css";

export default ({
  filters,
  setFilters,
}: {
  filters: FilteringI;
  setFilters: Dispatch<SetStateAction<FilteringI>>;
}): JSX.Element => {
  const handleSubmit = (event: React.ChangeEvent<HTMLFormElement>): void => {
    event.preventDefault();
    const formData = Object.fromEntries(new FormData(event.target));
    updateLocalStorage(formData as FilteringI);
    setFilters(filters);
  };

  return (
    <div className={styles.panel}>
      <form onSubmit={handleSubmit}>
        {filterOptions.map((filter, ind) => (
          <div key={ind}>
            <label htmlFor={filter.key}>{filter.name}</label>
            {filter.type === "select" && (
              <select
                name={filter.key}
                required={filter.required}
                defaultValue={filters[filter.key as keyof typeof filters] || ""}
              >
                <option value="">--Select an option--</option>
                {filter.options.map((option, ind2) => (
                  <option key={ind2}>{option}</option>
                ))}
              </select>
            )}
            {filter.type === "date" && (
              <input
                type="date"
                name={filter.key}
                required={filter.required}
                defaultValue={filters[filter.key as keyof typeof filters]}
              />
            )}
          </div>
        ))}
        <button type="submit">submit</button>
      </form>
    </div>
  );
};
