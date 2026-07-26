/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as about from "../about.js";
import type * as adminArtworks from "../adminArtworks.js";
import type * as analytics from "../analytics.js";
import type * as artworks from "../artworks.js";
import type * as backfill from "../backfill.js";
import type * as backfillQueries from "../backfillQueries.js";
import type * as dashboard from "../dashboard.js";
import type * as files from "../files.js";
import type * as inquiries from "../inquiries.js";
import type * as lib_auth from "../lib/auth.js";
import type * as lib_images from "../lib/images.js";
import type * as lib_time from "../lib/time.js";
import type * as migrate from "../migrate.js";
import type * as newsletter from "../newsletter.js";
import type * as orders from "../orders.js";
import type * as translate from "../translate.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  about: typeof about;
  adminArtworks: typeof adminArtworks;
  analytics: typeof analytics;
  artworks: typeof artworks;
  backfill: typeof backfill;
  backfillQueries: typeof backfillQueries;
  dashboard: typeof dashboard;
  files: typeof files;
  inquiries: typeof inquiries;
  "lib/auth": typeof lib_auth;
  "lib/images": typeof lib_images;
  "lib/time": typeof lib_time;
  migrate: typeof migrate;
  newsletter: typeof newsletter;
  orders: typeof orders;
  translate: typeof translate;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
