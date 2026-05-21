/**
 * Plain-text Q&A for the FAQ page.
 *
 * The rich/JSX version (with links and lists) is rendered client-side
 * in the FAQ accordion component. This plain-text version exists so
 * server-side code (Schema.org FAQPage builder, metadata, etc.) can
 * read the answers without needing a React renderer.
 *
 * Keep both versions in sync.
 */

export interface FAQItem {
  question: string;
  /** Plain-text answer for Schema.org / SEO. */
  answer: string;
}

export const FAQ_ITEMS: FAQItem[] = [
  {
    question: "What is Engage Youth Foundation (EYF)?",
    answer:
      "Engage Youth Foundation is a non-profit organization dedicated to inspiring, engaging, and empowering youth to become self-motivated contributors to their communities. We provide platforms, resources, and opportunities to nurture positive change.",
  },
  {
    question: "How can I get involved with EYF?",
    answer:
      "There are many ways to get involved with EYF: Volunteer — we offer volunteer opportunities for youth with diverse interests and skills. Donate — your contribution directly supports our programs and initiatives. Attend events — we host educational workshops, community projects, and social gatherings. Spread the word — share our mission with your friends and family.",
  },
  {
    question: "What age group does EYF focus on?",
    answer:
      "EYF is inclusive and welcomes individuals from 10+ years age groups. While our primary focus is youth, our initiatives often involve people of all ages who share our commitment to community engagement.",
  },
  {
    question: "Does EYF offer any programs for skill development?",
    answer:
      "No, we do not offer any programs aimed at skill development. Explore our Key Activities on the homepage to know more about our programs.",
  },
  {
    question: "How can I support EYF financially?",
    answer:
      "Your financial support is greatly appreciated. Visit our Donation page to find information on making donations, sponsorships, and supporting our initiatives.",
  },
  {
    question: "Is EYF involved in environmental initiatives?",
    answer:
      "Yes, we are committed to environmental sustainability. Check our Projects and events to learn about our environmental projects and how you can contribute.",
  },
  {
    question: "Can I suggest a community project for EYF to consider?",
    answer:
      "Absolutely! We value community input. If you have a project idea aligned with our mission, feel free to contact us through the Contact us page with your proposal, or email your proposal at engageyouthfoundation@gmail.com.",
  },
  {
    question: "How does EYF ensure data privacy and security?",
    answer:
      "EYF takes data privacy seriously. Our privacy policy outlines how we collect, use, and protect user information. You can find more details in our Privacy Policy section.",
  },
  {
    question: "Are there internship opportunities at EYF?",
    answer: "No, we do not offer internship opportunities.",
  },
  {
    question: "How can I stay updated on EYF's activities?",
    answer:
      "Stay connected by subscribing to our newsletter and following us on social media. We regularly share updates, event information, and success stories. If you have additional questions, reach out through our Contact us page or write to us at engageyouthfoundation@gmail.com.",
  },
];
