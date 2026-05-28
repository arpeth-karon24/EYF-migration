import { defineField, defineType } from 'sanity';

/**
 * One document per unique newsletter subscriber.
 *
 * Deduplication:
 *   The document _id is derived deterministically from the normalised email
 *   (e.g. "subscriber.john_doe_example_com") so createIfNotExists is a no-op
 *   for repeat subscriptions — no duplicates, no double-sends.
 *
 * Unsubscribe:
 *   active = false (soft-delete) so history is preserved and re-subscribe is
 *   possible without losing the original subscribedAt date.
 */
export const newsletterSubscriberSchema = defineType({
  name: 'newsletterSubscriber',
  title: 'Newsletter Subscriber',
  type: 'document',
  fields: [
    defineField({
      name: 'email',
      title: 'Email',
      type: 'string',
      validation: (Rule) => Rule.required().email(),
    }),
    defineField({
      name: 'active',
      title: 'Active',
      type: 'boolean',
      description: 'False = unsubscribed. Re-subscribing sets this back to true.',
      initialValue: true,
    }),
    defineField({
      name: 'subscribedAt',
      title: 'Subscribed At',
      type: 'datetime',
      readOnly: true,
    }),
    defineField({
      name: 'unsubscribedAt',
      title: 'Unsubscribed At',
      type: 'datetime',
      readOnly: true,
    }),
    defineField({
      name: 'resubscribedAt',
      title: 'Re-subscribed At',
      type: 'datetime',
      readOnly: true,
    }),
  ],
  orderings: [
    {
      title: 'Newest first',
      name: 'subscribedAtDesc',
      by: [{ field: 'subscribedAt', direction: 'desc' }],
    },
  ],
  preview: {
    select: { title: 'email', active: 'active', subscribedAt: 'subscribedAt' },
    prepare({ title, active, subscribedAt }) {
      const date = subscribedAt ? new Date(subscribedAt).toLocaleDateString() : '';
      return {
        title: title ?? 'Unknown',
        subtitle: active ? `Active · ${date}` : `Unsubscribed · ${date}`,
      };
    },
  },
});
