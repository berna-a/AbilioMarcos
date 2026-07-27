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
import type * as auth from "../auth.js";
import type * as authAdmin from "../authAdmin.js";
import type * as backfill from "../backfill.js";
import type * as backfillQueries from "../backfillQueries.js";
import type * as checkout from "../checkout.js";
import type * as checkoutQueries from "../checkoutQueries.js";
import type * as dashboard from "../dashboard.js";
import type * as files from "../files.js";
import type * as http from "../http.js";
import type * as inquiries from "../inquiries.js";
import type * as lib_auth from "../lib/auth.js";
import type * as lib_emails from "../lib/emails.js";
import type * as lib_images from "../lib/images.js";
import type * as lib_time from "../lib/time.js";
import type * as migrate from "../migrate.js";
import type * as newsletter from "../newsletter.js";
import type * as orders from "../orders.js";
import type * as stripeWebhook from "../stripeWebhook.js";
import type * as stripeWebhookAction from "../stripeWebhookAction.js";
import type * as stripeWebhookMutations from "../stripeWebhookMutations.js";
import type * as translate from "../translate.js";
import type * as users from "../users.js";
import type * as whatsappLead from "../whatsappLead.js";
import type * as whatsappLeadQueries from "../whatsappLeadQueries.js";

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
  auth: typeof auth;
  authAdmin: typeof authAdmin;
  backfill: typeof backfill;
  backfillQueries: typeof backfillQueries;
  checkout: typeof checkout;
  checkoutQueries: typeof checkoutQueries;
  dashboard: typeof dashboard;
  files: typeof files;
  http: typeof http;
  inquiries: typeof inquiries;
  "lib/auth": typeof lib_auth;
  "lib/emails": typeof lib_emails;
  "lib/images": typeof lib_images;
  "lib/time": typeof lib_time;
  migrate: typeof migrate;
  newsletter: typeof newsletter;
  orders: typeof orders;
  stripeWebhook: typeof stripeWebhook;
  stripeWebhookAction: typeof stripeWebhookAction;
  stripeWebhookMutations: typeof stripeWebhookMutations;
  translate: typeof translate;
  users: typeof users;
  whatsappLead: typeof whatsappLead;
  whatsappLeadQueries: typeof whatsappLeadQueries;
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
