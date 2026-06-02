export const SITE = {
  name: "Engage Youth Foundation",
  origin: "https://engage-youth.org",
  /** Header/footer lockup — self-hosted in /public/images/logo */
  logo: "/images/logo/eyf-logo.png",
} as const;

export const HERO_SLIDES = [
  {
    image: "/images/home/hero-slide-1.jpeg",
    title: "Engage Youth Foundation",
    body: "We are a non-profit organization, established as a dynamic hub dedicated to engaging, empowering and mobilizing the next generation. Our mission is to foster a vibrant and inclusive community where young minds are not only heard but actively participate in shaping a better tomorrow. Through innovative programs, mentorship initiatives, and collaborative projects, we provide a platform for youth to amplify their voices, develop leadership skills, and engage in meaningful social impact.",
  },
  {
    image: "/images/home/hero-slide-2.jpeg",
    title: "Channelizing freshness to the community",
    body: "We strive to channelize the vibrant energy of freshness into our community by creating a dynamic, diverse and inclusive environment. Multiple studies have shown positive outcomes as a result of early youth engagement, especially during the strategic future planning.",
  },
  {
    image: "/images/home/hero-slide-3.jpg",
    title: "Join us and get engaged",
    body: "Calling all passionate and purpose-driven young individuals! It is okay if you are still undecided, it is okay to be confused, it is okay to be in exploratory mode. We welcome all. Join us in our mission to make a positive impact on society through social engagement. By volunteering with us, you'll have the opportunity to connect with like-minded peers, contribute to impactful projects, and be a driving force for positive transformation. Together, let's harness the energy of our youth to create a better, more inclusive world. Join our community of change-makers and let your commitment to social engagement shape a brighter future for us all!",
  },
] as const;

/**
 * Homepage stats labels + safe fallback values.
 *
 * The live counters come from Sanity:
 *   • Number of Events  → getAllEventsCount()
 *   • Volunteer Number  → getSiteStats().volunteerCount
 *   • Volunteer Hours   → getSiteStats().volunteerHours
 *
 * `to: 0` is the honest fallback when Sanity isn't configured or the
 * singleton doesn't exist yet — better than showing a made-up number.
 */
export const HOME_STATS = [
  { title: "Number of Events", to: 0, duration: 2 },
  { title: "Volunteer Number", to: 0, duration: 2 },
  { title: "Volunteer Hours", to: 0, duration: 2 },
] as const;

export const HOME_ABOUT = {
  image: "/images/home/about.jpg",
  heading: "About us",
  text: "Welcome to Engage Youth Foundation, a dynamic foundation devoted to empowering and mobilizing the youth to drive positive change. For the last few years, our founders have been actively engaged and volunteering for societal causes.",
  readMoreHref: "/about-us",
} as const;

export const KEY_ACTIVITIES_INTRO = {
  title: "Key Activities",
  subtitle:
    "While most of our projects and initiatives are going to be driven by the needs of the community, our 2024 focus areas will be the following 4 themes. If there are more impactful themes that you feel could benefit the community, please contact us.",
} as const;

export const KEY_ACTIVITY_BLOCKS = [
  {
    title: "Ecological Sustainability",
    image: "/images/activities/sustainability.jpg",
    body: "We are fortunate enough to have mentors guiding us in the right direction and one focus area to build self awareness and currently lacking enough support is sustainability and environmental preservation projects. The U.S. Pacific Northwest is known for its diverse and ecologically rich habitats, encompassing a variety of landscapes and ecosystems. This includes but is not limited to rainforests, mountain ecosystem, Columbia river basin, coastal habitats, freshwater systems and island habitats.",
  },
  {
    title: "Fighting Homelessness",
    image: "/images/activities/homeless.jpg",
    body: "Helping the homeless requires a multifaceted approach that addresses immediate needs while also working toward long-term solutions. Collaborate with local homeless shelters (primarily serving young adults), provide food and hygiene support, clothing drives, community outreach, education support and employment opportunities etc. are different ways we are currently engaging.",
  },
  {
    title: "Food Drives and Distribution",
    image: "/images/activities/food-drive.jpg",
    body: "Due to the seasonality of food scarcity and the unpredictability of natural calamities, we are committed to support ad hoc requests and needs coming from local food banks.  We believe everyone should have access to healthy food and an adequate balanced diet with sufficient supply of potable water.We also plan to continue food drives within the community and by partnering with local grocery stores, food vendors and food banks.",
  },
  {
    title: "Youth Financial Literacy",
    image: "/images/activities/financial-literacy.webp",
    body: "One area we feel there is a bigger gap is in financial literacy. Many high schoolers and college students have openly expressed their helplessness when it comes to managing personal finances. Almost everyone wants to get access to good financial practices early enough in their school/college. We plan to continue supporting youth by conducting workshops, one-on-one mentoring, coaching, group discussion and case studies. Our goal is to build a generation with enough understanding of basic personal finances to set them for success.",
  },
] as const;
