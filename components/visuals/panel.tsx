"use client";

import { useState, useEffect } from "react";

import { getLocalStorage } from "@/lib/localStorage/filtering";
import { FilteringI } from "@/types/data";
import styles from "./styled.module.css";

const filterOptions = [
  {
    name: "Activity",
    key: "activity",
    type: "select",
    required: true,
    options: [
      "AlpineSki",
      "BackcountrySki",
      "Badminton",
      "Canoeing",
      "Crossfit",
      "EBikeRide",
      "Elliptical",
      "EMountainBikeRide",
      "Golf",
      "GravelRide",
      "Handcycle",
      "HighIntensityIntervalTraining",
      "Hike",
      "IceSkate",
      "InlineSkate",
      "Kayaking",
      "Kitesurf",
      "MountainBikeRide",
      "NordicSki",
      "Pickleball",
      "Pilates",
      "Racquetball",
      "Ride",
      "RockClimbing",
      "RollerSki",
      "Rowing",
      "Run",
      "Sail",
      "Skateboard",
      "Snowboard",
      "Snowshoe",
      "Soccer",
      "Squash",
      "StairStepper",
      "StandUpPaddling",
      "Surfing",
      "Swim",
      "TableTennis",
      "Tennis",
      "TrailRun",
      "Velomobile",
      "VirtualRide",
      "VirtualRow",
      "VirtualRun",
      "Walk",
      "WeightTraining",
      "Wheelchair",
      "Windsurf",
      "Workout",
      "Yoga",
    ],
  },
  {
    name: "Start Date",
    key: "startDate",
    type: "date",
    required: false,
    options: [],
  },
  {
    name: "End Date",
    key: "endDate",
    type: "date",
    required: false,
    options: [],
  },
];

const defaultFilters = {
  activity: "Ride",
  startDate: undefined,
  endDate: undefined,
};

export default (): JSX.Element => {
  const [filters, setFilters] = useState<FilteringI>({ ...defaultFilters });

  useEffect(() => {
    setFilters(getLocalStorage());
  }, []);

  const handleSubmit = (event: React.ChangeEvent<HTMLFormElement>): void => {
    event.preventDefault();
    const formData = Object.fromEntries(new FormData(event.target));
    console.log(formData);
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
                required={filter.required}
                defaultValue={filters[filter.key as keyof typeof filters]}
              />
            )}
          </div>
        ))}
      </form>
    </div>
  );
};
