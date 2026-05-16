# EYF Website Implementation Guide

## ✅ Completed

### Pages Created
- ✅ `/about-us` - About page with mission, vision, and team sections
- ✅ `/team` - Team directory page
- ✅ `/volunteer-with-us` - Volunteer guidelines and registration
- ✅ `/contact-us` - Contact form page
- ✅ `/events` - Events listing with date filter
- ✅ `/faq` - FAQ accordion page
- ✅ `/blog` - Blog listing page
- ✅ `/donate` - Donation page with tiers
- ✅ `/privacy-policy` - Privacy policy page
- ✅ `/terms` - Terms of service page

### Reusable Components Created
- ✅ `HeroSection` - Hero banner with CTA
- ✅ `ContentSection` - Centered content wrapper
- ✅ `MissionVisionSection` - Two-column mission/vision layout
- ✅ `GuidelinesList` - Numbered guidelines component
- ✅ `TeamGrid` - Team member grid display
- ✅ `CTASection` - Call-to-action section
- ✅ `ContactForm` - Form with validation and submission

## 🔧 Next Steps: Backend Integration

### 1. Update Navigation Footer Links

Edit [src/components/footer/SiteFooter.tsx](src/components/footer/SiteFooter.tsx):

```typescript
// Add these navigation links to your footer
const navigationLinks = [
  { href: '/about-us', label: 'About Us' },
  { href: '/team', label: 'Our Team' },
  { href: '/volunteer-with-us', label: 'Volunteer' },
  { href: '/events', label: 'Events' },
  { href: '/blog', label: 'Blog & News' },
  { href: '/faq', label: 'FAQ' },
  { href: '/donate', label: 'Donate' },
  { href: '/contact-us', label: 'Contact' },
];
```

### 2. Sanity CMS Schema Setup

Create these schemas in your Sanity Studio:

#### Page Content Schema
```javascript
// schemas/page.js
export default {
  name: 'page',
  title: 'Page Content',
  type: 'document',
  fields: [
    { name: 'title', type: 'string', title: 'Page Title' },
    { name: 'slug', type: 'slug', source: 'title' },
    { name: 'sections', type: 'array', of: [{ type: 'richText' }] },
    { name: 'seo', type: 'object', fields: [
      { name: 'metaDescription', type: 'string' },
      { name: 'keywords', type: 'array', of: [{ type: 'string' }] }
    ]}
  ]
}
```

#### Team Member Schema
```javascript
// schemas/teamMember.js
export default {
  name: 'teamMember',
  title: 'Team Member',
  type: 'document',
  fields: [
    { name: 'name', type: 'string', title: 'Full Name' },
    { name: 'role', type: 'string', title: 'Role/Position' },
    { name: 'bio', type: 'text', title: 'Biography' },
    { name: 'image', type: 'image', title: 'Profile Image' },
    { name: 'boardType', type: 'string', enum: ['board', 'advisory', 'team'] },
    { name: 'email', type: 'string', title: 'Email (optional)' },
    { name: 'socialLinks', type: 'array', of: [{
      type: 'object',
      fields: [
        { name: 'platform', type: 'string' },
        { name: 'url', type: 'url' }
      ]
    }]}
  ]
}
```

#### Blog Post Schema
```javascript
// schemas/blogPost.js
export default {
  name: 'blogPost',
  title: 'Blog Post',
  type: 'document',
  fields: [
    { name: 'title', type: 'string', title: 'Title' },
    { name: 'slug', type: 'slug', source: 'title' },
    { name: 'excerpt', type: 'text', title: 'Excerpt' },
    { name: 'content', type: 'array', of: [{ type: 'block' }] },
    { name: 'category', type: 'string', title: 'Category' },
    { name: 'image', type: 'image', title: 'Featured Image' },
    { name: 'author', type: 'string', title: 'Author' },
    { name: 'date', type: 'datetime', title: 'Published Date' }
  ]
}
```

#### Event Schema
```javascript
// schemas/event.js
export default {
  name: 'event',
  title: 'Event',
  type: 'document',
  fields: [
    { name: 'title', type: 'string', title: 'Event Title' },
    { name: 'slug', type: 'slug', source: 'title' },
    { name: 'description', type: 'text', title: 'Description' },
    { name: 'date', type: 'datetime', title: 'Event Date' },
    { name: 'location', type: 'string', title: 'Location' },
    { name: 'image', type: 'image', title: 'Event Image' },
    { name: 'registrationLink', type: 'url', title: 'Registration Link' }
  ]
}
```

### 3. Contact Form Submission Handler

Update [src/app/contact-us/page.tsx](src/app/contact-us/page.tsx):

```typescript
// Option 1: Send to Slack (using existing slack.ts service)
import { sendSlackMessage } from '@/services/slack';

async function handleContactFormSubmit(formData: FormData) {
  'use server';
  
  const name = formData.get('name') as string;
  const email = formData.get('email') as string;
  const subject = formData.get('subject') as string;
  const message = formData.get('message') as string;
  
  // Send to Slack
  await sendSlackMessage({
    text: `New Contact Form Submission from ${name}`,
    blocks: [
      { type: 'section', text: { type: 'mrkdwn', text: `**New Contact:** ${name}` } },
      { type: 'section', text: { type: 'mrkdwn', text: `**Email:** ${email}` } },
      { type: 'section', text: { type: 'mrkdwn', text: `**Subject:** ${subject}` } },
      { type: 'section', text: { type: 'mrkdwn', text: `**Message:** ${message}` } }
    ]
  });
  
  // Also store in Supabase for backup
  const { data, error } = await supabase
    .from('contact_submissions')
    .insert([{ name, email, subject, message, created_at: new Date() }]);
}
```

### 4. Dynamic Content Loading from Sanity

Create a utility file to fetch from Sanity:

```typescript
// src/lib/sanity.ts
import { SanityClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';

export const client = new SanityClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: '2024-01-01',
  useCdn: true,
});

const builder = imageUrlBuilder(client);

export const urlFor = (source: any) => builder.image(source);

// Fetch team members
export async function getTeamMembers() {
  return client.fetch(`*[_type == 'teamMember'] | order(name asc)`);
}

// Fetch blog posts
export async function getBlogPosts() {
  return client.fetch(`*[_type == 'blogPost'] | order(date desc)`);
}

// Fetch events
export async function getEvents() {
  return client.fetch(`*[_type == 'event'] | order(date asc)`);
}
```

Update pages to use dynamic content:

```typescript
// src/app/team/page.tsx
import { getTeamMembers } from '@/lib/sanity';
import { TeamGrid } from '@/components/sections';

export default async function TeamPage() {
  const boardMembers = await getTeamMembers().then(members => 
    members.filter((m: any) => m.boardType === 'board')
  );
  const advisoryMembers = await getTeamMembers().then(members => 
    members.filter((m: any) => m.boardType === 'advisory')
  );

  return (
    <>
      {/* ... */}
      <TeamGrid title="Board of Directors" members={boardMembers} />
      <TeamGrid title="Advisory Board" members={advisoryMembers} />
    </>
  );
}
```

### 5. Supabase Database Setup

Create tables for form submissions and events:

```sql
-- Create contact_submissions table
CREATE TABLE contact_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT,
  message TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create events table (if not using Sanity)
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  date TIMESTAMP NOT NULL,
  location TEXT,
  image_url TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create volunteers table
CREATE TABLE volunteers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  interests TEXT[],
  registered_at TIMESTAMP DEFAULT NOW()
);
```

### 6. Update Navigation Header

Edit [src/components/navbar/SiteHeader.tsx](src/components/navbar/SiteHeader.tsx) to include new page links:

```typescript
const navigationItems = [
  { label: 'About', href: '/about-us' },
  { label: 'Team', href: '/team' },
  { label: 'Events', href: '/events' },
  { label: 'Volunteer', href: '/volunteer-with-us' },
  { label: 'Blog', href: '/blog' },
  { label: 'Donate', href: '/donate' },
  { label: 'Contact', href: '/contact-us' },
];
```

### 7. Environment Variables

Add to `.env.local`:

```env
# Sanity
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
NEXT_PUBLIC_SANITY_DATASET=production

# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key

# Slack (for form notifications)
SLACK_WEBHOOK_URL=your_webhook_url

# Email Service (optional)
SENDGRID_API_KEY=your_key
```

## 📱 Responsive Design Notes

All components are built with mobile-first Tailwind CSS using:
- Mobile breakpoints: Full width
- Tablet breakpoints: `md:` (768px)
- Desktop breakpoints: `lg:` (1024px), `navlg:` (1025px)
- Container max-width: 1140px

## 🎨 Customization

### Colors
Customize in [tailwind.config.ts](tailwind.config.ts):
```typescript
eyf: {
  page: "#1c1c1c",
  gold: "#e0be53",
  accentBlue: "#0088cc",
  // ... more colors
}
```

### Typography
Fonts are configured in `layout.tsx`:
- Poppins (headings)
- Montserrat (secondary)
- Open Sans (body)

## 📊 SEO Optimization

Each page includes:
- Metadata with title and description
- Open Graph tags (can be added)
- Sitemap (auto-generated)
- robots.txt (already exists)

## 🚀 Deployment

1. Build: `npm run build`
2. Deploy to Cloudflare Pages: `npm run pages:deploy`
3. Or deploy to Vercel: `vercel deploy`

## 📝 Content Management Workflow

1. Add content in Sanity Studio
2. Content automatically syncs to frontend
3. Update footer navigation with new links
4. Test responsive design across devices
5. Deploy when ready

## 🐛 Testing Checklist

- [ ] All pages load correctly
- [ ] Forms submit without errors
- [ ] Mobile responsive on all breakpoints
- [ ] Links navigate correctly
- [ ] Images load properly
- [ ] Accessibility features working
- [ ] SEO metadata correct

## 📞 Support & Troubleshooting

For issues with:
- **Forms**: Check Slack webhook URL and Supabase connection
- **Images**: Verify Cloudinary configuration
- **Content**: Verify Sanity CMS schemas and API key
- **Database**: Check Supabase connection string

