import { Dispatch, SetStateAction } from "react";

import { FilterOptionsI } from "@/types/data";
import { updateLocalStorage } from "@/lib/localStorage";
import { FilteringI } from "@/types/data";
import styles from "./styled.module.css";

export default ({
  filters,
  loading,
  filterOptions,
  setFilters,
}: {
  filters: FilteringI;
  loading: boolean;
  filterOptions: FilterOptionsI;
  setFilters: Dispatch<SetStateAction<FilteringI>>;
}): JSX.Element => {
  const handleSubmit = (event: React.ChangeEvent<HTMLFormElement>): void => {
    event.preventDefault();
    const formData = Object.fromEntries(new FormData(event.target));
    updateLocalStorage(formData as FilteringI);
    setFilters(formData as FilteringI);
  };

  console.log(filters.activity);

  return (
    <div className={styles.panel}>
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
    </div>
  );
};
