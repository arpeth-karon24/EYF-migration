import { defineField, defineType } from 'sanity';

/**
 * Idempotency log for post notification emails.
 *
 * One document per post that has been notified. The _id is derived from the
 * post _id (e.g. "notiflog.drafts_abc123") so a second webhook fire for the
 * same post finds an existing document and skips re-sending.
 */
export const notificationLogSchema = defineType({
  name: 'notificationLog',
  title: 'Notification Log',
  type: 'document',
  fields: [
    defineField({
      name: 'postId',
      title: 'Post ID',
      type: 'string',
      readOnly: true,
    }),
    defineField({
      name: 'recipientCount',
      title: 'Recipients',
      type: 'number',
      readOnly: true,
      description: 'Number of subscribers who were sent this notification.',
    }),
    defineField({
      name: 'sentAt',
      title: 'Sent At',
      type: 'datetime',
      readOnly: true,
    }),
    defineField({
      name: 'failedCount',
      title: 'Failed',
      type: 'number',
      readOnly: true,
      description: 'Subscribers that failed to receive this notification. Non-zero means a retry is needed.',
    }),
  ],
  orderings: [
    {
      title: 'Newest first',
      name: 'sentAtDesc',
      by: [{ field: 'sentAt', direction: 'desc' }],
    },
  ],
  preview: {
    select: { postId: 'postId', recipientCount: 'recipientCount', sentAt: 'sentAt' },
    prepare({ postId, recipientCount, sentAt }) {
      const date = sentAt ? new Date(sentAt).toLocaleDateString() : '';
      return {
        title: postId ?? 'Unknown post',
        subtitle: `${recipientCount ?? 0} recipients · ${date}`,
      };
    },
  },
});
