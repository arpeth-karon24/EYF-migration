import { defineField, defineType } from 'sanity';

/**
 * One document per unique volunteer.
 *
 * Deduplication:
 *   The document _id is derived deterministically from the (normalized)
 *   email — e.g. "volunteer.john_example_com". Because the /api/volunteer
 *   Function uses createIfNotExists with that ID, a second submission from
 *   the same email is a no-op: no duplicate document, no double-count.
 *
 * Homepage count:
 *   The "Volunteer Number" stat = manual baseline (siteStats.volunteerCount)
 *   + count of these documents. So unique website signups are tracked
 *   automatically, while historical/offline volunteers can still be seeded
 *   via the baseline.
 *
 * This effectively turns Sanity into a lightweight, searchable volunteer
 * CRM — admins can browse, filter, and export registrations in Studio.
 */
export const volunteerRegistrationSchema = defineType({
  name: 'volunteerRegistration',
  title: 'Volunteer Registration',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'email',
      title: 'Email',
      type: 'string',
      validation: (Rule) => Rule.required().email(),
    }),
    defineField({
      name: 'contactNumber',
      title: 'Contact Number',
      type: 'string',
    }),
    defineField({
      name: 'city',
      title: 'City',
      type: 'string',
    }),
    defineField({
      name: 'eventTitle',
      title: 'Event / Interest Area',
      description: 'The event or interest area they registered for (first registration).',
      type: 'string',
    }),
    defineField({
      name: 'availability',
      title: 'Availability',
      type: 'string',
    }),
    defineField({
      name: 'skillsAndInterests',
      title: 'Skills & Interests',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'registeredAt',
      title: 'Registered At',
      type: 'datetime',
      readOnly: true,
    }),
  ],
  orderings: [
    {
      title: 'Newest first',
      name: 'registeredAtDesc',
      by: [{ field: 'registeredAt', direction: 'desc' }],
    },
  ],
  preview: {
    select: { title: 'name', subtitle: 'email', extra: 'eventTitle' },
    prepare({ title, subtitle, extra }) {
      return {
        title: title ?? 'Unnamed volunteer',
        subtitle: extra ? `${subtitle} · ${extra}` : subtitle,
      };
    },
  },
});
