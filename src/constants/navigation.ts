export type NavItem = {
  label: string;
  href: string;
  children?: NavItem[];
};

export const PRIMARY_NAV: NavItem[] = [
  {
    label: "About us",
    href: "/about-us",
    children: [
      { label: "Mission and Vision", href: "/about-us#vision" },
      { label: "Teams", href: "/about-us#board" },
      { label: "News and Social Media", href: "/news-and-social-media" },
    ],
  },
  {
    label: "How to help",
    href: "#",
    children: [
      { label: "Donation", href: "/donation" },
      { label: "In-Kind Donations", href: "/donation#in-kind" },
      { label: "Request volunteer support", href: "/request-for-volunteer" },
      { label: "FAQ", href: "/faq" },
    ],
  },
  {
    label: "Projects",
    href: "#",
    children: [
      { label: "Upcoming/Ongoing Events", href: "/events" },
      { label: "Past Events", href: "/events#past" },
    ],
  },
];

export const VOLUNTEER_CTA = {
  label: "VOLUNTEER WITH US",
  href: "/volunteer-with-us",
} as const;
