import { defineField, defineType } from 'sanity';

/**
 * Per-subscriber delivery record for newsletter notifications.
 *
 * One document per (post × subscriber) pair. The _id is deterministic:
 * "delivery.<safe-post-id>.<safe-email>" so createIfNotExists is idempotent
 * and duplicate inserts across retries are harmless.
 *
 * Status lifecycle: pending → sent | failed
 * Failed entries are candidates for newsletter-retry.
 */
export const deliveryLogSchema = defineType({
  name: 'deliveryLog',
  title: 'Delivery Log',
  type: 'document',
  fields: [
    defineField({
      name: 'postId',
      title: 'Post ID',
      type: 'string',
      readOnly: true,
    }),
    defineField({
      name: 'subscriberEmail',
      title: 'Subscriber Email',
      type: 'string',
      readOnly: true,
    }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      readOnly: true,
      options: {
        list: [
          { title: 'Pending', value: 'pending' },
          { title: 'Sent', value: 'sent' },
          { title: 'Failed', value: 'failed' },
        ],
      },
    }),
    defineField({
      name: 'attemptedAt',
      title: 'Last Attempted At',
      type: 'datetime',
      readOnly: true,
    }),
    defineField({
      name: 'sentAt',
      title: 'Sent At',
      type: 'datetime',
      readOnly: true,
    }),
    defineField({
      name: 'lastError',
      title: 'Last Error',
      type: 'string',
      readOnly: true,
    }),
    defineField({
      name: 'retryCount',
      title: 'Retry Count',
      type: 'number',
      readOnly: true,
      description: 'Number of retry attempts after the initial send failure.',
    }),
  ],
  orderings: [
    {
      title: 'Newest first',
      name: 'attemptedAtDesc',
      by: [{ field: 'attemptedAt', direction: 'desc' }],
    },
  ],
  preview: {
    select: {
      postId: 'postId',
      subscriberEmail: 'subscriberEmail',
      status: 'status',
      retryCount: 'retryCount',
    },
    prepare({ postId, subscriberEmail, status, retryCount }) {
      const retries = retryCount ? ` · ${retryCount} retr${retryCount === 1 ? 'y' : 'ies'}` : '';
      return {
        title: subscriberEmail ?? 'Unknown',
        subtitle: `${postId ?? ''} · ${status ?? 'unknown'}${retries}`,
      };
    },
  },
});
