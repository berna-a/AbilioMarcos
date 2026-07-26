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

  about_content: defineTable({
    content: v.optional(v.string()),
    created_at: v.optional(v.string()),
    updated_at: v.optional(v.string()),
    content_translations: v.any(),
    id: v.union(v.string(), v.null()),
    old_id: v.optional(v.string()),
  }),

  about_exhibitions: defineTable({
    title: v.optional(v.string()),
    year: v.union(v.number(), v.null(), v.string()),
    location: v.union(v.string(), v.null()),
    type: v.optional(v.string()),
    created_at: v.optional(v.string()),
    updated_at: v.optional(v.string()),
    title_translations: v.any(),
    location_translations: v.any(),
    id: v.union(v.string(), v.null()),
    old_id: v.optional(v.string()),
  }),

  inquiries: defineTable({
    name: v.optional(v.string()),
    email: v.optional(v.string()),
    message: v.optional(v.string()),
    artwork_id: v.union(v.string(), v.null()),
    status: v.optional(v.string()),
    created_at: v.optional(v.string()),
    old_id: v.optional(v.string()),
  }),

  orders: defineTable({
    customer_name: v.optional(v.string()),
    customer_email: v.optional(v.string()),
    status: v.optional(v.string()),
    total_amount: v.union(v.number(), v.null()),
    created_at: v.optional(v.string()),
    old_id: v.optional(v.string()),
  }),

  newsletter_subscribers: defineTable({
    email: v.optional(v.string()),
    status: v.optional(v.string()),
    created_at: v.optional(v.string()),
    old_id: v.optional(v.string()),
  }),

  analytics_events: defineTable({
    event_type: v.optional(v.string()),
    page_url: v.optional(v.string()),
    session_id: v.optional(v.string()),
    created_at: v.optional(v.string()),
    metadata: v.any(),
    old_id: v.optional(v.string()),
  }),

  user_roles: defineTable({
    user_id: v.optional(v.string()),
    role: v.optional(v.string()),
    created_at: v.optional(v.string()),
    old_id: v.optional(v.string()),
  }),

  whatsapp_leads: defineTable({
    phone_number: v.optional(v.string()),
    message: v.optional(v.string()),
    status: v.optional(v.string()),
    created_at: v.optional(v.string()),
    old_id: v.optional(v.string()),
  }),
}, { schemaValidation: false });
