export const filterOptions = [
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

export const defaultFilters = {
  activity: "Ride",
  startDate: "",
  endDate: "",
};
