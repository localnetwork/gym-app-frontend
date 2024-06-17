import { parseCookies } from "nookies";

import Jsona from "jsona";
import { toast } from "react-toastify";
const dataFormatter = new Jsona();

export function deserialize(data) {
  return dataFormatter.deserialize(data);
}

const cookies = parseCookies();
const TOKEN = process.env.NEXT_PUBLIC_TOKEN || "";

export const auth = cookies?.[TOKEN] ? true : false;

export function sortBlocks(list) {
  return list.sort((a, b) => a.order - b.order);
}

export function timeAgo(params) {
  const now = new Date();
  const date = new Date(params);
  const diffInSeconds = Math.floor((now - date) / 1000);

  const secondsInMinute = 60;
  const secondsInHour = 3600;
  const secondsInDay = 86400;
  const secondsInWeek = 604800;
  const secondsInMonth = 2592000; // Approximate
  const secondsInYear = 31536000; // Approximate

  if (diffInSeconds < secondsInMinute) {
    return `${diffInSeconds} seconds ago`;
  } else if (diffInSeconds < secondsInHour) {
    const minutes = Math.floor(diffInSeconds / secondsInMinute);
    return `${minutes} minute${minutes !== 1 ? "s" : ""} ago`;
  } else if (diffInSeconds < secondsInDay) {
    const hours = Math.floor(diffInSeconds / secondsInHour);
    return `${hours} hour${hours !== 1 ? "s" : ""} ago`;
  } else if (diffInSeconds < secondsInWeek) {
    const days = Math.floor(diffInSeconds / secondsInDay);
    return `${days} day${days !== 1 ? "s" : ""} ago`;
  } else if (diffInSeconds < secondsInMonth) {
    const weeks = Math.floor(diffInSeconds / secondsInWeek);
    return `${weeks} week${weeks !== 1 ? "s" : ""} ago`;
  } else if (diffInSeconds < secondsInYear) {
    const months = Math.floor(diffInSeconds / secondsInMonth);
    return `${months} month${months !== 1 ? "s" : ""} ago`;
  } else {
    const years = Math.floor(diffInSeconds / secondsInYear);
    return `${years} year${years !== 1 ? "s" : ""} ago`;
  }
}

export function paramsToString(params) {
  return params
    ? Object.keys(params)
        .map((key, index) => {
          if (Array.isArray(params[key]))
            return params[key]
              .map((value, i) => `${key}[${i}]=${value}`)
              .join("&");
          else return `${key}=${Object.values(params)[index]}`;
        })
        .join("&")
    : null;
}


export function serverError() {
  toast.error("There's an error with your request. Please try again later.");
}
