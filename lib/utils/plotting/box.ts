import * as d3 from "d3";
import { PlotDataI, CoordinatesI } from "@/types/data";

export const getBoundingBox = (data: CoordinatesI[]): [[number, number], [number, number]] => {
  const xExt = <[number, number]>d3.extent(data, (d) => d.x);
  const yExt = <[number, number]>d3.extent(data, (d) => d.y);

  return [xExt, yExt];
};

export const getBoxedExtent = (data: CoordinatesI[]): [number, number][] => {
  // Finds the bounding box then pads the axis with smaller range
  // such that we get a square of boxed extents.
  const [xExt, yExt] = getBoundingBox(data);

  const xDiff = xExt[1] - xExt[0];
  const yDiff = yExt[1] - yExt[0];

  if (xDiff > yDiff) {
    yExt[0] -= (xDiff - yDiff) / 2;
    yExt[1] += (xDiff - yDiff) / 2;
  }
  if (yDiff > xDiff) {
    xExt[0] -= (yDiff - xDiff) / 2;
    xExt[1] += (yDiff - xDiff) / 2;
  }
  return [xExt, yExt];
};

export const isOverlap = (coords1: CoordinatesI[], coords2: CoordinatesI[]): boolean => {
  const [xExt1, yExt1] = getBoundingBox(coords1);
  const [xExt2, yExt2] = getBoundingBox(coords2);

  if (xExt1[0] > xExt2[1] || xExt1[1] < xExt2[0]) return false;
  if (yExt1[1] < yExt2[0] || yExt1[0] > yExt2[1]) return false;

  return true;
};

export const findLinks = (data: PlotDataI[]): { [key: number]: number[] } => {
  const links: { [key: number]: number[] } = {};
  [...Array(data.length)]
    .map((_, i) => i)
    .forEach((ind) => {
      links[ind as keyof typeof links] = [];
      [...Array(data.length)]
        .map((_, i) => i)
        .slice(ind + 1, data.length)
        .forEach((ind2) => {
          if (isOverlap(data[ind].coordinates, data[ind2].coordinates)) {
            links[ind].push(ind2);
          }
        });
    });
  return links;
};

export const getGroupings = (data: PlotDataI[]): number[][] => {
  const groups: Set<number>[] = [];

  const links = findLinks(data);

  Object.entries(links).forEach(([key, values]) => {
    let found = false;
    let foundInd = 0;
    [...Array(groups.length)].forEach((_, ind) => {
      if (groups[ind].has(Number(key))) {
        found = true;
        foundInd = ind;
      } else {
        values.forEach((value) => {
          if (groups[ind].has(Number(value))) {
            found = true;
            foundInd = ind;
          }
        });
      }
    });
    if (!found) {
      groups.push(new Set());
      foundInd = groups.length - 1;
      groups[foundInd].add(Number(key));
    }
    values.forEach((value) => {
      groups[foundInd].add(value);
    });
  });

  return groups.map((group) => Array.from(group)).sort((a, b) => (a.length < b.length ? 0 : -1));
};
