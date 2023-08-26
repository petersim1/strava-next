export const fallbackOptions = ["Run", "Ride"];

export const filterOptions = {
  activity: {
    name: "Activity",
    type: "select",
    required: true,
    options: fallbackOptions,
  },
  startDate: {
    name: "Date From",
    type: "date",
    required: false,
    options: [],
  },
  endDate: {
    name: "Date To",
    type: "date",
    required: false,
    options: [],
  },
};

export const defaultFilters = {
  activity: "",
  startDate: "",
  endDate: "",
};

export const mockIdbData = [
  {
    id: "1234",
    sportType: "Ride",
    startDate: new Date("june 1 2023").valueOf(),
    map: {
      id: "12345",
      summary_polyline: "hey",
      resource_state: 2,
    },
  },
  {
    id: "1235",
    sportType: "Ride",
    startDate: new Date("june 4 2023").valueOf(),
    map: {
      id: "12345",
      summary_polyline: "hey",
      resource_state: 2,
    },
  },
  {
    id: "1236",
    sportType: "Run",
    startDate: new Date("june 3 2023").valueOf(),
    map: {
      id: "12345",
      summary_polyline: "hey",
      resource_state: 2,
    },
  },
  {
    id: "1237",
    sportType: "Run",
    startDate: new Date("june 2 2023").valueOf(),
    map: {
      id: "12345",
      summary_polyline: "hey",
      resource_state: 2,
    },
  },
];
