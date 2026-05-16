# Implementation Quick Reference & Checklist

Use this document as your day-to-day guide when building the Next.js version.

---

## 📋 Page Implementation Checklist

### ✅ Pages to Build (In Order of Priority)

- [ ] **Home Page** (`/`)
  - [ ] Carousel hero (3 slides)
  - [ ] Stats section (0 Events, 0 Volunteers, 0 Hours)
  - [ ] About preview section
  - [ ] Events filter widget
  - [ ] Key activities grid (4 items)
  
- [ ] **About Page** (`/about-us`)
  - [ ] Hero section
  - [ ] Opening content paragraphs
  - [ ] Mission & Vision section
  - [ ] Our Evolution subsections
  - [ ] Board of Directors grid
  - [ ] Advisory Board grid

- [ ] **Volunteer Page** (`/volunteer-with-us`)
  - [ ] Hero with CTA button
  - [ ] Support our community section
  - [ ] Guidelines list (9 items)
  - [ ] External form link integration

- [ ] **FAQ Page** (`/faq`)
  - [ ] Hero section
  - [ ] Accordion component
  - [ ] 10 FAQ items
  - [ ] First item expanded by default

- [ ] **Contact Page** (`/contact-us`)
  - [ ] Hero section
  - [ ] Contact form
  - [ ] Form fields validation
  - [ ] File upload functionality
  - [ ] Success/error handling

- [ ] **News/Blog Page** (`/news-and-social-media`)
  - [ ] Featured hero image section
  - [ ] Blog cards grid (3 columns)
  - [ ] Sidebar with Recent Posts
  - [ ] Sidebar with Archives
  - [ ] Sidebar with Categories

- [ ] **Privacy Policy** (`/privacy-policy`)
  - [ ] Hero with accent color
  - [ ] Text content sections
  - [ ] Subsection headings
  - [ ] Decorative section dividers

- [ ] **Team Page** (`/team`)
  - [ ] Team member grid/list
  - [ ] Individual member pages
  - [ ] Member details display

- [ ] **Events Page** (`/events`) - Currently returns 404
  - [ ] Events listing
  - [ ] Filter controls
  - [ ] Event cards

- [ ] **Donate Page** (`/donate`) - Currently returns 404
  - [ ] Donation options
  - [ ] Payment integration

---

## 🎨 Design Token Setup

### Colors to Define
```
✓ dark.charcoal: #0a0a0a
✓ dark.bg: #1a1a1a
✓ dark.section: #2d2d2d
✓ light.bg: #ffffff
✓ light.section: #f5f5f5
✓ light.border: #e5e5e5
✓ text.dark: #2d2d2d
✓ text.light: #ffffff
✓ text.muted: #a0a0a0
✓ text.accent: #0891b2
✓ gradient.hero: linear-gradient(135deg, #1a3a52 0%, #0f2438 100%)
```

### Typography to Configure
```
✓ Font family (system font or Google Font)
✓ H1: 40-60px, weight 700, line-height 1.2
✓ H2: 28-36px, weight 700
✓ H3: 20-28px, weight 600
✓ H4: 16-20px, weight 600
✓ Body: 16px, weight 400, line-height 1.5-1.75
✓ Small: 14px, weight 400
```

### Spacing Scale
```
✓ xs: 4px
✓ sm: 8px
✓ md: 16px
✓ lg: 24px
✓ xl: 32px
✓ 2xl: 40px
✓ 3xl: 60px
```

### Responsive Breakpoints
```
✓ mobile: < 640px
✓ tablet: 640px - 1024px
✓ desktop: > 1024px
```

---

## 🧩 Core Components to Build

Priority order:

1. **Layout Components**
   - [ ] Header (sticky nav with mobile menu)
   - [ ] Footer (with newsletter + social)
   - [ ] Container (max-width wrapper)

2. **Basic Components**
   - [ ] Button (variants: primary, secondary, text)
   - [ ] Link (text links with hover)

3. **Section Components**
   - [ ] HeroSection (with gradient option)
   - [ ] CarouselSection (3-slide carousel)
   - [ ] GridSection (reusable grid wrapper)

4. **Content Components**
   - [ ] ActivityCard + ActivityGrid
   - [ ] BlogCard + BlogGrid
   - [ ] StatCounter (3-column stats)

5. **Interactive Components**
   - [ ] AccordionItem + AccordionSection (FAQ)
   - [ ] ContactForm
   - [ ] EventsFilter
   - [ ] NewsletterSubscribe

6. **Utility Components**
   - [ ] ResponsiveImage
   - [ ] SocialLinks
   - [ ] Breadcrumb (optional)

---

## 🔧 Technical Setup

### File Structure
```
src/
├── app/
│   ├── layout.tsx
│   ├── page.tsx (Home)
│   ├── about-us/
│   │   └── page.tsx
│   ├── team/
│   │   ├── page.tsx
│   │   └── [slug]/page.tsx
│   ├── volunteer-with-us/
│   │   └── page.tsx
│   ├── faq/
│   │   └── page.tsx
│   ├── contact-us/
│   │   └── page.tsx
│   ├── news-and-social-media/
│   │   └── page.tsx
│   ├── privacy-policy/
│   │   └── page.tsx
│   ├── events/
│   │   └── page.tsx
│   ├── donate/
│   │   └── page.tsx
│   └── api/
│       └── (API routes)
│
├── components/
│   ├── layout/
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   └── Container.tsx
│   │
│   ├── sections/
│   │   ├── HeroSection.tsx
│   │   ├── CarouselSection.tsx
│   │   ├── ActivityGridSection.tsx
│   │   ├── BlogGridSection.tsx
│   │   └── ...
│   │
│   ├── cards/
│   │   ├── ActivityCard.tsx
│   │   ├── BlogCard.tsx
│   │   └── StatCounter.tsx
│   │
│   ├── forms/
│   │   ├── ContactForm.tsx
│   │   ├── EventsFilter.tsx
│   │   └── NewsletterForm.tsx
│   │
│   ├── ui/
│   │   ├── Button.tsx
│   │   ├── Link.tsx
│   │   ├── Accordion.tsx
│   │   └── ...
│   │
│   └── index.ts (exports)
│
├── constants/
│   ├── colors.ts
│   ├── typography.ts
│   ├── spacing.ts
│   └── breakpoints.ts
│
├── styles/
│   ├── globals.css
│   ├── variables.css
│   └── utilities.css
│
├── hooks/
│   ├── useMediaQuery.ts
│   ├── useCarousel.ts
│   └── useAccordion.ts
│
├── lib/
│   ├── cn.ts (classname utility)
│   └── types.ts
│
└── types/
    └── index.ts
```

---

## 📱 Responsive Design Checklist

### Mobile Optimizations (< 640px)
- [ ] Single column layouts
- [ ] Hamburger menu navigation
- [ ] Full-width form fields
- [ ] Stacked cards
- [ ] Touch targets ≥ 48px
- [ ] Padding 1rem on sides
- [ ] Smaller hero heights
- [ ] Readable font sizes (min 16px)

### Tablet Adjustments (640px - 1024px)
- [ ] 2-column grids where appropriate
- [ ] Medium spacing between elements
- [ ] Menu may expand partially
- [ ] Medium typography sizes

### Desktop Layout (> 1024px)
- [ ] 4-column activity grid
- [ ] 3-column blog grid
- [ ] Full menu navigation
- [ ] Max-width 1200px containers
- [ ] Generous spacing

---

## 🎬 Animation Standards

### All Transitions
- Duration: 300ms default (500ms for carousel)
- Easing: ease-out (default), ease-in-out (carousel)
- Hardware accelerated: Use transform/opacity

### Hover States
- Duration: 300ms
- Scale: +2-4% or color change
- Shadow: Increase shadow depth
- Cursor: pointer (on interactive elements)

### Page Transitions
- Fade in: 300ms ease-out opacity
- Slide up: 300ms ease-out transform

---

## 🌐 Content Data Structure

### Hero Carousel
```javascript
const carouselSlides = [
  {
    id: 1,
    heading: "Join us and get engaged",
    description: "Calling all passionate and purpose-driven young individuals..."
  },
  {
    id: 2,
    heading: "Engage Youth Foundation",
    description: "We are a 501 3(c) non-profit organization..."
  },
  {
    id: 3,
    heading: "Channelizing freshness to the community",
    description: "We strive to channelize the vibrant energy..."
  }
]
```

### Activities
```javascript
const activities = [
  {
    id: 1,
    title: "Ecological Sustainability",
    description: "We are fortunate enough to have mentors..."
  },
  // ... 3 more
]
```

### FAQ Items
```javascript
const faqItems = [
  {
    id: 1,
    question: "What is Engage Youth Foundation (EYF)?",
    answer: "Engage Youth Foundation is a non-profit organization...",
    expanded: true
  },
  // ... 9 more
]
```

---

## 🔗 External Integrations

### Forms
- [ ] Contact form - MetaForm or custom handler
- [ ] Volunteer signup - Google Forms (currently: https://forms.gle/bn7ZJo9YKHk7f1ua9)
- [ ] Newsletter - MailChimp or similar

### Analytics
- [ ] Google Analytics integration
- [ ] Event tracking for CTAs

### Social Media
- [ ] Links to: Facebook, Instagram, YouTube, LinkedIn
- [ ] Social share buttons on blog posts

---

## 🧪 Testing Checklist

### Functionality
- [ ] All links navigate correctly
- [ ] Forms submit and validate
- [ ] Carousel navigates correctly
- [ ] Accordion expands/collapses
- [ ] Mobile menu opens/closes

### Accessibility
- [ ] Keyboard navigation works
- [ ] ARIA labels present
- [ ] Color contrast ≥ 4.5:1
- [ ] Images have alt text
- [ ] Heading hierarchy correct

### Performance
- [ ] Images optimized
- [ ] CSS/JS minified
- [ ] Lazy loading implemented
- [ ] Core Web Vitals green

### Responsive
- [ ] Mobile: 320px, 480px
- [ ] Tablet: 768px, 1024px
- [ ] Desktop: 1200px, 1920px
- [ ] Touch friendly on mobile

### Browser Compatibility
- [ ] Chrome/Edge (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Mobile browsers

---

## 📊 Asset Checklist

### Images to Source/Create
- [ ] Logo (high resolution, transparent background)
- [ ] Favicon
- [ ] Social media icons
- [ ] Background images/textures (optional)
- [ ] Team member photos
- [ ] Featured blog images
- [ ] Activity section images (optional)

### Content to Migrate
- [ ] All page content/copy
- [ ] Blog posts (with dates, categories, authors)
- [ ] Team member information
- [ ] FAQ answers
- [ ] Links and navigation structure

---

## 🚀 Deployment Checklist

- [ ] Environment variables configured
- [ ] Build optimized (next build)
- [ ] No console errors/warnings
- [ ] Robots.txt configured
- [ ] Sitemap.xml generated
- [ ] Meta tags set per page
- [ ] Open Graph tags added
- [ ] Twitter cards (optional)
- [ ] 404 page created
- [ ] Error page created

---

## 📚 Reference Files

All detailed analysis in:
1. **WORDPRESS_DESIGN_ANALYSIS.md** - Design breakdown
2. **WORDPRESS_CSS_REFERENCE.md** - CSS implementation guide
3. **COMPONENT_SPECIFICATIONS.md** - Component API details
4. **IMPLEMENTATION_GUIDE.md** (existing) - Your project guide

---

## 🎯 Quick Implementation Notes

### Copy to Tailwind Config
```javascript
theme: {
  colors: {
    primary: '#0891b2',
    dark: '#1a1a1a',
    light: '#ffffff',
  },
  extend: {
    backgroundImage: {
      'hero': 'linear-gradient(135deg, #1a3a52 0%, #0f2438 100%)',
    },
  },
}
```

### Common Class Patterns
```
// Dark hero sections
bg-gradient-to-br from-[#1a3a52] to-[#0f2438] text-white

// Light content areas
bg-white text-[#2d2d2d]

// Container
max-w-6xl mx-auto px-4 md:px-8

// Section padding
py-16 md:py-24 lg:py-32

// Grid layouts
grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6
```

### Default Spacing
```
Mobile: gap-4 px-4
Tablet: gap-6 px-6
Desktop: gap-8 px-8
```

---

Use this checklist daily while building. Update tasks as you complete them!
