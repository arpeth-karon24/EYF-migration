import { postSchema } from './post';
import { eventSchema } from './event';
import { teamMemberSchema } from './teamMember';
import { siteStatsSchema } from './siteStats';
import { volunteerRegistrationSchema } from './volunteerRegistration';

export const schemas = [
  postSchema,
  eventSchema,
  teamMemberSchema,
  siteStatsSchema,
  volunteerRegistrationSchema,
];
