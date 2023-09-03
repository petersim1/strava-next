import { Dispatch, SetStateAction, FormEvent, useState, useEffect } from "react";

import { updateLocalStorage } from "@/lib/localStorage";
import { FilteringI, Stores } from "@/types/data";
import { filterOptions, defaultFilters } from "@/lib/constants";
import styles from "./styled.module.css";

export default ({
  filters,
  loading,
  setFilters,
  opacity,
  handleOpacity,
}: {
  filters: FilteringI;
  loading: boolean;
  setFilters: Dispatch<SetStateAction<FilteringI>>;
  opacity: number;
  handleOpacity: (e: FormEvent<HTMLInputElement>) => void;
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
    const formData = Object.fromEntries(new FormData(event.target));
    console.log(formData);
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
          <div key={ind}>
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
                  --Select an option--
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
        <button type="submit">submit</button>
      </form>
      <div>
        <label htmlFor="opacity">Adjust Brightness</label>
        <input
          name="opacity"
          type="range"
          disabled={loading}
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
