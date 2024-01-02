# Strava Viz

This is an application for Strava route visualizations, built using [Strava API](https://developers.strava.com/) & [Next.js](https://nextjs.org/)

The main stack used is:
- Strava API (data + Oauth)
- indexedDb
- localStorage
- d3.js

**No data is stored off the device.**

Currently, visualizations are supported for Runs + Rides.

Makes use of custom bounding box logic to parse out visuals, although this can largely be worked on.
