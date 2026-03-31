

# Abílio Marcos — Implementation Plan (v4.1) — Final Refinements

Only two changes from v4. Everything else remains identical.

---

## Change 1: Primary Collection Support

**Architecture choice:** Add an `is_primary` boolean flag to the `artwork_collections` join table.

This is preferred over a `primary_collection_id` FK on artworks because:
- It keeps all collection relationships in one place
- It avoids denormalization
- It works naturally with the many-to-many model
- A database constraint can enforce at most one primary per artwork

### artwork_collections (updated)

| Field | Type | Notes |
|---|---|---|
| artwork_id | uuid | FK → artworks |
| collection_id | uuid | FK → collections |
| sort_order | integer | Order within collection |
| **is_primary** | **boolean** | **Default false. At most one true per artwork.** |
| PK: (artwork_id, collection_id) | | |

A partial unique index enforces the constraint: only one row per `artwork_id` where `is_primary = true`.

**Frontend usage of primary collection:**
- Artwork detail page breadcrumbs: Home → [Primary Collection] → [Artwork Title]
- Related works: prioritize works from the same primary collection
- Default collection context when navigating to detail from non-collection routes
- If no primary collection is set, breadcrumbs fall back to "All Works"

**Admin:** When assigning collections, one can be toggled as primary. Optional — not required.

---

## Change 2: Archived Visibility Behavior

Clarified `publication_status` logic:

| Status | Frontend | Admin |
|---|---|---|
| **draft** | Hidden | Visible in default listing |
| **published** | Visible (subject to `availability` for commerce) | Visible in default listing |
| **archived** | Hidden | **Hidden from default listing, but accessible via status filter or search** |

**Admin behavior:** The artwork list defaults to showing `draft` + `published` works. Archived works are excluded from the default view but can be found by selecting "Archived" in the status filter dropdown or by searching. This prevents clutter while keeping archived works fully accessible.

**No data is lost** — archived is a soft-hide, not a delete.

---

All other sections (sitemap, hero, intro animation, component system, remaining data model, commerce logic, phases, checkpoints, risks) remain exactly as defined in v4.

