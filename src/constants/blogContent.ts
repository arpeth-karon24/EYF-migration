export type BlogPost = {
  /** URL segment under /news-and-social-media/ */
  slug: string;
  id: string;
  title: string;
  date: string;
  category: string;
  location: string;
  excerpt: string;
  image: string;
  /** Article body shown on the detail page */
  paragraphs: string[];
  /** Original WordPress article */
  sourceUrl: string;
};

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "child-rights-and-you-blog",
    id: "post-1",
    title: "Child Rights and You Blog",
    date: "November 18, 2023",
    category: "News",
    location: "Mumbai, Maharashtra, India",
    excerpt:
      "Exploring the fundamental rights of children and how Engage Youth Foundation is working to protect and promote them...",
    image: "/images/blog/blog-1.jpg",
    paragraphs: [
      "Child Rights and You (CRY) is a leading nonprofit and nongovernmental organization in India working toward the upliftment of children through rights-based policy change, grassroots programs, and sustained advocacy.",
      "Engage Youth Foundation highlights partnerships and learning journeys that connect young people with organizations like CRY so our community can understand how child rights translate into everyday safety, education, and dignity—and how youth can participate in positive change.",
    ],
    sourceUrl: "https://engage-youth.org/2023/11/18/hello2/",
  },
  {
    slug: "akshaya-patra-blog",
    id: "post-2",
    title: "Akshaya Patra Blog",
    date: "November 18, 2023",
    category: "News",
    location: "India",
    excerpt:
      "Our collaboration with Akshaya Patra to provide nutritious meals to students and combat classroom hunger...",
    image: "/images/blog/blog-2.jpg",
    paragraphs: [
      "The Akshaya Patra Foundation works to eliminate classroom hunger through large-scale school meal programs, built on a public-private partnership model that reaches millions of children across India.",
      "We are proud to amplify stories of how nutritious midday meals improve attendance, concentration, and well-being—and how volunteers and donors can support similar outcomes in their own communities.",
    ],
    sourceUrl: "https://engage-youth.org/2023/11/18/hello/",
  },
  {
    slug: "narayan-seva-sansthan",
    id: "post-3",
    title: "Narayan Seva Sansthan",
    date: "November 1, 2023",
    category: "News",
    location: "Udaipur, Rajasthan, India",
    excerpt:
      "Supporting the initiatives of Narayan Seva Sansthan in providing medical care and rehabilitation for the underprivileged...",
    image: "/images/blog/blog-3.jpg",
    paragraphs: [
      "Narayan Seva Sansthan serves people in need through medical care, rehabilitation, and humanitarian programs—with a strong presence in Udaipur and outreach that touches many families.",
      "Engage Youth Foundation shares this story to inspire compassion and action: when young leaders learn about organizations delivering sustained impact on the ground, they are better equipped to volunteer, fundraise, and advocate with empathy.",
    ],
    sourceUrl: "https://engage-youth.org/2023/11/01/narayan-seva-sansthan/",
  },
];

export function getBlogPostBySlug(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((p) => p.slug === slug);
}

/** Sidebar: title + link to article */
export const RECENT_POST_LINKS = BLOG_POSTS.map((p) => ({
  title: p.title,
  href: `/news-and-social-media/${p.slug}` as const,
}));

export const ARCHIVES = ["May 2024", "November 2023"];

export const CATEGORIES = ["History", "News"];
