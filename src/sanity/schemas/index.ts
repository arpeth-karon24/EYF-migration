import { postSchema } from './post';
import { eventSchema } from './event';
import { teamMemberSchema } from './teamMember';
import { siteStatsSchema } from './siteStats';
import { volunteerRegistrationSchema } from './volunteerRegistration';
import { newsletterSubscriberSchema } from './newsletterSubscriber';
import { notificationLogSchema } from './notificationLog';

export const schemas = [
  postSchema,
  eventSchema,
  teamMemberSchema,
  siteStatsSchema,
  volunteerRegistrationSchema,
  newsletterSubscriberSchema,
  notificationLogSchema,
];
