import { defineField, defineType } from 'sanity';

/**
 * Singleton document for live, site-wide counters surfaced on the
 * homepage stats bar (volunteer count + volunteer hours).
 *
 * Why a singleton:
 *   • Exactly one source of truth — no chance of duplicate "Site Stats"
 *     docs floating around in the dataset.
 *   • The document ID is hard-coded to "siteStats" so writes via the API
 *     can target it deterministically (no slug lookup needed).
 *
 * How values update:
 *   1. Auto-increment — when a volunteer registration succeeds at
 *      /api/volunteer, the Cloudflare Function PATCHes this doc with
 *      .inc({ volunteerCount: 1 }). Fire-and-forget; never blocks the
 *      user response.
 *   2. Manual override — admins can edit either field in Sanity Studio
 *      at any time (e.g., after a real-world event when hours are known).
 *      Sanity's webhook then triggers a GitHub Actions rebuild and the
 *      new values appear on the live site within ~2-5 min.
 *
 * In Sanity Studio:
 *   • The schema appears under "Site Stats" in the document type list.
 *   • Create ONE document with ID "siteStats" (set manually in Vision
 *     or via the API). Subsequent edits target that same document.
 */
export const siteStatsSchema = defineType({
  name: 'siteStats',
  title: 'Site Stats',
  type: 'document',
  fields: [
    defineField({
      name: 'volunteerCount',
      title: 'Volunteer Number',
      description:
        'Live count shown on the homepage. Auto-incremented by +1 on each new (deduped) website registration. You can also edit it manually here — e.g. to seed a historical/offline starting number or correct a mistake.',
      type: 'number',
      initialValue: 0,
      validation: (Rule) => Rule.required().min(0).integer(),
    }),
    defineField({
      name: 'volunteerHours',
      title: 'Volunteer Hours',
      description:
        'Cumulative volunteer hours logged across all EYF events and programs. Update this manually after each event once hours are known.',
      type: 'number',
      initialValue: 0,
      validation: (Rule) => Rule.required().min(0).integer(),
    }),
    defineField({
      name: 'lastUpdated',
      title: 'Last Updated',
      description: 'Auto-updated whenever any stat changes (read-only — for audit).',
      type: 'datetime',
      readOnly: true,
    }),
  ],
  preview: {
    select: {
      volunteers: 'volunteerCount',
      hours: 'volunteerHours',
    },
    prepare({ volunteers, hours }) {
      return {
        title: 'Site Stats',
        subtitle: `${volunteers ?? 0} volunteers · ${hours ?? 0} hours`,
      };
    },
  },
});
