import { ConvexHttpClient } from "convex/browser";

/** Shared Convex HTTP client for one-off queries/mutations from plain (non-React) lib code. */
export function getConvexClient(): ConvexHttpClient {
  const url = (typeof import.meta !== "undefined" && import.meta.env && import.meta.env.VITE_CONVEX_URL)
    ? import.meta.env.VITE_CONVEX_URL
    : "https://deafening-cormorant-584.eu-west-1.convex.cloud";
  return new ConvexHttpClient(url);
}
