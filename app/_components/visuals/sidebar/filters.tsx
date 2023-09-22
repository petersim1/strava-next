import { Dispatch, SetStateAction, useState, useEffect } from "react";

import { updateLocalStorage } from "@/_lib/localStorage";
import { FilteringI, Stores } from "@/_types/data";
import { filterOptions, defaultFilters } from "@/_lib/constants";
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
    setSelection((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className={styles.filters}>
      <form onSubmit={handleSubmit}>
        {Object.entries(filterOptions).map(([key, option], ind) => (
          <div key={ind} className={option.type === "select" ? styles.wide : styles.small}>
            <label htmlFor={key}>{option.name}</label>
            {option.type === "select" && (
              <select
                name={key}
                required={option.required}
                disabled={loading}
                value={selection[key as keyof typeof filters]}
                onChange={handleChange}
              >
                {/* Adding a value here makes it always be considered the default... removed it. */}
                <option disabled value="" hidden>
                  -Choose option-
                </option>
                {option.options.map((choice, ind2) => (
                  <option key={ind2} value={choice}>
                    {choice}
                  </option>
                ))}
              </select>
            )}
            {option.type === "date" && (
              <input
                type="date"
                name={key}
                required={option.required}
                disabled={loading}
                value={selection[key as keyof typeof filters]}
                onChange={handleChange}
              />
            )}
          </div>
        ))}
        <button type="submit" className={styles.submit}>
          submit
        </button>
      </form>
    </div>
  );
};
