export const VOLUNTEER_GUIDELINES = [
  {
    label: "Be committed to our mission",
    description:
      "Share our passion for engaging and inspiring young people to reach their full potential.",
  },
  {
    label: "Be reliable and responsible",
    description: "Attend volunteer sessions and fulfil your commitments.",
  },
  {
    label: "Be respectful and professional",
    description: "Treat all individuals with respect, courtesy, and professionalism.",
  },
  {
    label: "Maintain confidentiality",
    description: "Protect sensitive information and maintain confidentiality as required.",
  },
  {
    label: "Uphold our values",
    description: "Adhere to our values of integrity, diversity, equity, inclusion, and respect.",
  },
  {
    label: "Flexibility and adaptability",
    description: "Be flexible and adaptable to changing circumstances and needs.",
  },
  {
    label: "Social media and public representations",
    description: "Exercise discretion when sharing information about EYF on social media.",
  },
  {
    label: "Recognition and appreciation",
    description:
      "Acknowledge and appreciate the contributions of fellow volunteers and program participants.",
  },
  {
    label: "Problem resolution",
    description:
      "Report any issues or concerns related to your volunteer experience promptly to program coordinators.",
  },
];

export type VolunteerSpotlight = {
  title: string;
  description: string;
  image: string;
  imageAlt: string;
};

/** Image + copy pairs — alternating layout on the volunteer page */
export const VOLUNTEER_SPOTLIGHTS: VolunteerSpotlight[] = [
  {
    title: "Programs that reach young people",
    description:
      "From workshops to community gatherings, volunteers help us create welcoming spaces where youth can learn, connect, and build confidence alongside peers and mentors.",
    image: "/images/volunteer/community.jpg",
    imageAlt: "Group of young people collaborating at an Engage Youth Foundation program",
  },
  {
    title: "Hands-on community impact",
    description:
      "Whether you are supporting drives, events, or day-of logistics, your time directly strengthens programs that address real needs in our neighborhoods.",
    image: "/images/volunteer/food-drive-full.jpg",
    imageAlt: "Volunteers organizing food and supplies at a community drive",
  },
  {
    title: "Awareness and outreach",
    description:
      "Volunteers amplify our mission by helping with outreach, storytelling, and education—ensuring more families and partners understand how they can get involved.",
    image: "/images/volunteer/homeless-full.jpg",
    imageAlt: "Community outreach and support activities",
  },
];

/** Full-width banner between intro and spotlights */
export const VOLUNTEER_HERO_STRIP = {
  src: "/images/volunteer/food-drive-full.jpg",
  alt: "Volunteers working together at a community food drive",
  headline: "Your time changes outcomes",
  subline:
    "Every shift, event, and conversation helps us build stronger pathways for young people across our region.",
} as const;

export const VOLUNTEER_INTRO = {
  title: "Be a Catalyst for Positive Change",
  text: "At Engage Youth Foundation, we believe in the power of community and the impact that dedicated individuals can make. Join us in our mission to create positive change, empower youth, and build stronger communities. As a volunteer, you have the opportunity to contribute your skills, passion, and time to make a real difference.",
};
