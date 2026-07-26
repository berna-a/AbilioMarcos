import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  artworks: defineTable({
    title: v.optional(v.string()),
    slug: v.optional(v.string()),
    year: v.union(v.number(), v.null(), v.string()),
    description: v.union(v.string(), v.null()),
    status: v.optional(v.string()),
    availability: v.optional(v.string()),
    price: v.union(v.string(), v.number(), v.null()),
    primary_image_url: v.union(v.string(), v.null()),
    additional_images: v.union(v.array(v.string()), v.null()),
    // Preferred image storage from here on: a Convex `_storage` id resolved to
    // a URL at read time via ctx.storage.getUrl(). This survives switching
    // Convex deployments (dev → prod) — unlike `primary_image_url`, which used
    // to hold the resolved URL baked in for one specific deployment.
    primary_storage_id: v.optional(v.id("_storage")),
    additional_storage_ids: v.optional(v.array(v.id("_storage"))),
    is_featured: v.optional(v.boolean()),
    created_at: v.optional(v.string()),
    updated_at: v.optional(v.string()),
    purchase_url: v.union(v.string(), v.null()),
    size_category: v.union(v.string(), v.null()),
    custom_width_cm: v.union(v.string(), v.null()),
    custom_height_cm: v.union(v.string(), v.null()),
    reference: v.union(v.string(), v.null()),
    technique: v.union(v.string(), v.null()),
    title_translations: v.any(),
    description_translations: v.any(),
    exhibition_name: v.union(v.string(), v.null()),
    theme: v.union(v.string(), v.null()),
    dominant_color: v.union(v.string(), v.null()),
    art_style: v.union(v.string(), v.null()),
    old_id: v.optional(v.string()),
  }).index("by_slug", ["slug"]),

  // `title`/`title_translations`/`section`/`display_order` were missing here
  // (same drift pattern fixed for inquiries/orders/analytics_events/
  // whatsapp_leads earlier) — confirmed against live data, present on every row.
  about_content: defineTable({
    title: v.optional(v.string()),
    section: v.optional(v.string()),
    content: v.optional(v.string()),
    display_order: v.optional(v.number()),
    created_at: v.optional(v.string()),
    updated_at: v.optional(v.string()),
    title_translations: v.optional(v.any()),
    content_translations: v.any(),
    id: v.union(v.string(), v.null()),
    old_id: v.optional(v.string()),
  }),

  about_exhibitions: defineTable({
    title: v.optional(v.string()),
    year: v.union(v.number(), v.null(), v.string()),
    location: v.union(v.string(), v.null()),
    type: v.optional(v.string()),
    display_order: v.optional(v.number()),
    created_at: v.optional(v.string()),
    updated_at: v.optional(v.string()),
    title_translations: v.any(),
    location_translations: v.any(),
    id: v.union(v.string(), v.null()),
    old_id: v.optional(v.string()),
  }),

  // Shape matches what actually lived in Supabase (verified against the
  // migration_data/*.json dumps) — the original guess here (name/email/
  // message/artwork_id/status only) was missing half the real columns.
  inquiries: defineTable({
    artwork_id: v.optional(v.union(v.string(), v.null())),
    artwork_title: v.optional(v.union(v.string(), v.null())),
    name: v.optional(v.string()),
    email: v.optional(v.string()),
    phone: v.optional(v.union(v.string(), v.null())),
    message: v.optional(v.string()),
    budget_range: v.optional(v.union(v.string(), v.null())),
    status: v.optional(v.string()),
    attribution: v.optional(v.any()),
    session_id: v.optional(v.union(v.string(), v.null())),
    source: v.optional(v.union(v.string(), v.null())),
    created_at: v.optional(v.string()),
    old_id: v.optional(v.string()),
  }),

  orders: defineTable({
    artwork_id: v.optional(v.union(v.string(), v.null())),
    artwork_title: v.optional(v.union(v.string(), v.null())),
    stripe_session_id: v.optional(v.string()),
    customer_email: v.optional(v.union(v.string(), v.null())),
    amount: v.optional(v.union(v.number(), v.string(), v.null())),
    currency: v.optional(v.string()),
    payment_status: v.optional(v.string()),
    shipping_status: v.optional(v.string()),
    session_id: v.optional(v.union(v.string(), v.null())),
    attribution: v.optional(v.any()),
    created_at: v.optional(v.string()),
    old_id: v.optional(v.string()),
  }).index("by_stripe_session_id", ["stripe_session_id"]),

  newsletter_subscribers: defineTable({
    email: v.optional(v.string()),
    status: v.optional(v.string()),
    attribution: v.optional(v.any()),
    created_at: v.optional(v.string()),
    old_id: v.optional(v.string()),
  }),

  // Real Supabase shape was `event_name` + `properties` (a free-form bag) —
  // not `event_type`/`page_url`/`metadata` as originally guessed here.
  analytics_events: defineTable({
    event_name: v.optional(v.string()),
    properties: v.optional(v.any()),
    session_id: v.optional(v.string()),
    created_at: v.optional(v.string()),
    old_id: v.optional(v.string()),
  })
    .index("by_created_at", ["created_at"])
    .index("by_event_name", ["event_name"])
    // `created_at` is a Postgres-style "YYYY-MM-DD HH:MM:SS.ffffff+00" UTC
    // string — lexicographic order matches chronological order, so range
    // queries on it work like a real timestamp index. Used by the admin
    // dashboard (last-30/60-days queries) to avoid scanning the whole
    // (28k+ and growing) table per event type.
    .index("by_event_name_and_created_at", ["event_name", "created_at"]),

  user_roles: defineTable({
    user_id: v.optional(v.string()),
    role: v.optional(v.string()),
    created_at: v.optional(v.string()),
    old_id: v.optional(v.string()),
  }),

  // Real Supabase shape keyed leads by `ref_code` (the "[cód: AB-XXXX]" tag
  // embedded in the WhatsApp message) — not `phone_number`/`message`.
  whatsapp_leads: defineTable({
    ref_code: v.optional(v.string()),
    session_id: v.optional(v.union(v.string(), v.null())),
    attribution: v.optional(v.any()),
    artwork_id: v.optional(v.union(v.string(), v.null())),
    artwork_title: v.optional(v.union(v.string(), v.null())),
    sale_amount: v.optional(v.union(v.number(), v.null())),
    sale_closed_at: v.optional(v.union(v.string(), v.null())),
    created_at: v.optional(v.string()),
    old_id: v.optional(v.string()),
  }).index("by_ref_code", ["ref_code"]),
}, { schemaValidation: false });
