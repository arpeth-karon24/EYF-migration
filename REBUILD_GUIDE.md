# EYF Website Rebuild Guide - Next.js Implementation

## Design System

### Color Palette
- **Primary Background**: `#1c1c1c` (dark page background)
- **Footer Background**: `#1f2024`
- **Gold Accent**: `#e0be53`
- **Blue Accent**: `#0088cc`
- **Text Primary**: White/Near-white
- **Text Muted**: `#777777`
- **Button Gray**: `#444444`
- **Button Hover**: `#1c1c1c`
- **Borders**: `#eee`

### Typography
- **Headings**: Poppins, Montserrat
- **Body**: Open Sans
- **Max Width Container**: 1140px

## Component Architecture

### Reusable Components to Create

#### 1. **HeroSection** (Generic hero with title, description, optional image, CTA)
```
Props: {
  title: string
  description?: string
  backgroundImage?: string
  ctaText?: string
  ctaLink?: string
  backgroundOverlay?: boolean
}
```

#### 2. **ContentSection** (Centered content with max-width)
```
Props: {
  title: string
  content: React.ReactNode
  className?: string
  backgroundDark?: boolean
}
```

#### 3. **MissionVisionSection** (Two-column layout)
```
Props: {
  missionTitle: string
  missionContent: string
  visionTitle: string
  visionContent: string
  dividerImage?: string
}
```

#### 4. **GuidelinesList** (Numbered list component)
```
Props: {
  title: string
  items: Array<{ label: string; description: string }>
  numbered?: boolean
}
```

#### 5. **TeamGrid** (Card-based grid for team members)
```
Props: {
  members: Array<{
    id: string
    name: string
    role: string
    image?: string
    bio?: string
    boardType: 'board' | 'advisory' | 'team'
  }>
}
```

#### 6. **CTASection** (Centered call-to-action)
```
Props: {
  title: string
  subtitle?: string
  buttonText: string
  buttonLink: string
  buttonVariant?: 'primary' | 'secondary'
}
```

#### 7. **ContactForm** (Form with validation)
```
Props: {
  onSubmit: (data: FormData) => Promise<void>
}
```

### Page Structure

#### About Page (`/about-us`)
- Hero: "About us"
- Content section with introduction
- Mission & Vision section
- Evolution timeline (text-based sections)
- Board of Directors grid
- Advisory Board grid
- Footer

#### Team Page (`/team`)
- Hero: "Our Team"
- Team member grid (board + advisory)
- Individual team member detail pages (`/team/[slug]`)

#### Volunteer Page (`/volunteer-with-us`)
- Hero: "Support our community"
- CTA Section with "Register here" button
- Guidelines list
- Join section
- Footer

#### Events Page (`/events`)
- Hero: "Events"
- Date filter selector
- Events grid/list
- Individual event detail pages (`/events/[id]`)

#### Contact Page (`/contact-us`)
- Hero: "Contact us"
- Contact form with name, email, file upload
- Contact information (optional)
- Footer

#### FAQ Page (`/faq`)
- Hero: "Frequently Asked Questions"
- Accordion component with FAQs
- Footer

#### Blog Page (`/blog`)
- Hero: "Blog & News"
- Blog post listing with pagination
- Blog post detail pages (`/blog/[slug]`)

#### Donation Page (`/donate`)
- Hero: "Support Our Mission"
- Donation options (one-time, monthly)
- Impact statistics
- Footer

#### Policy Pages
- Privacy Policy (`/privacy-policy`)
- Terms of Service (`/terms`)
- Footer

## Implementation Priority

1. **Phase 1**: Core reusable components
2. **Phase 2**: About, Team, Volunteer pages
3. **Phase 3**: Contact, Events pages
4. **Phase 4**: FAQ, Blog, Donation pages
5. **Phase 5**: Policy pages and optimization

## Integration Points

- **Sanity CMS**: Store page content, team members, blog posts
- **Supabase**: Store form submissions, events data
- **Cloudinary**: Image hosting and optimization
- **Forms**: Contact form with email notifications (Slack integration available)

## Responsive Design

- Mobile-first approach with Tailwind
- Breakpoint: `navlg` (1025px) for navigation changes
- Ensure touch-friendly interactive elements
- Test on various screen sizes

## Next Steps

1. Create base component library
2. Set up page routing
3. Create CMS schemas
4. Build pages iteratively
5. Test and optimize
