# Navigation & Footer Update Guide

## Quick Navigation Links

Add these navigation items to your site header and footer:

```typescript
// Navigation menu items
const navigationLinks = [
  { label: 'Home', href: '/' },
  { label: 'About Us', href: '/about-us' },
  { label: 'Our Team', href: '/team' },
  { label: 'Events', href: '/events' },
  { label: 'Volunteer', href: '/volunteer-with-us' },
  { label: 'Blog & News', href: '/blog' },
  { label: 'FAQ', href: '/faq' },
  { label: 'Donate', href: '/donate' },
  { label: 'Contact', href: '/contact-us' },
];

// Policy/Legal footer links
const policyLinks = [
  { label: 'Privacy Policy', href: '/privacy-policy' },
  { label: 'Terms of Service', href: '/terms' },
  { label: 'Contact Us', href: '/contact-us' },
];
```

## File Structure

```
src/
├── app/
│   ├── about-us/
│   │   └── page.tsx
│   ├── team/
│   │   └── page.tsx
│   ├── volunteer-with-us/
│   │   └── page.tsx
│   ├── events/
│   │   └── page.tsx
│   ├── contact-us/
│   │   └── page.tsx
│   ├── faq/
│   │   └── page.tsx
│   ├── blog/
│   │   └── page.tsx
│   │   └── [slug]/
│   │       └── page.tsx (template for individual posts)
│   ├── donate/
│   │   └── page.tsx
│   ├── privacy-policy/
│   │   └── page.tsx
│   └── terms/
│       └── page.tsx
└── components/
    └── sections/
        ├── HeroSection.tsx
        ├── ContentSection.tsx
        ├── MissionVisionSection.tsx
        ├── GuidelinesList.tsx
        ├── TeamGrid.tsx
        ├── CTASection.tsx
        ├── ContactForm.tsx
        └── index.ts (exports)
```

## Component Usage Examples

### HeroSection
```typescript
<HeroSection
  title="Page Title"
  subtitle="Optional subtitle"
  description="Page description"
  ctaText="Call to Action"
  ctaLink="/destination"
  backgroundImage="/path/to/image.jpg"
/>
```

### ContentSection
```typescript
<ContentSection title="Section Title" centered>
  <p>Your content here</p>
</ContentSection>
```

### GuidelinesList
```typescript
<GuidelinesList
  title="Guidelines"
  items={[
    { label: "Item 1", description: "Description" },
    { label: "Item 2", description: "Description" }
  ]}
  numbered={true}
/>
```

### TeamGrid
```typescript
<TeamGrid
  title="Board of Directors"
  members={teamMembers}
  columns={3}
/>
```

### CTASection
```typescript
<CTASection
  title="Join Us"
  description="Description"
  buttonText="Sign Up"
  buttonLink="/signup"
/>
```

### ContactForm
```typescript
<ContactForm
  onSubmit={handleSubmit}
  submitButtonText="Send"
/>
```

## Pages Overview

| Page | Route | Status | Content Type |
|------|-------|--------|--------------|
| Home | `/` | Existing | Mixed |
| About | `/about-us` | ✅ Complete | Static/Editable |
| Team | `/team` | ✅ Complete | Dynamic |
| Events | `/events` | ✅ Complete | Dynamic |
| Volunteer | `/volunteer-with-us` | ✅ Complete | Static/Editable |
| Blog | `/blog` | ✅ Complete | Dynamic |
| Blog Post | `/blog/[slug]` | Ready | Dynamic |
| FAQ | `/faq` | ✅ Complete | Accordion |
| Donate | `/donate` | ✅ Complete | Static |
| Contact | `/contact-us` | ✅ Complete | Form |
| Privacy | `/privacy-policy` | ✅ Complete | Static |
| Terms | `/terms` | ✅ Complete | Static |

## Color Reference

Use these Tailwind classes for consistency:

- **Background**: `bg-eyf-page` (#1c1c1c)
- **Footer BG**: `bg-eyf-footer` (#1f2024)
- **Gold Accent**: `text-eyf-gold` (#e0be53)
- **Blue Accent**: `text-eyf-accentBlue` (#0088cc)
- **Button Gray**: `bg-eyf-btnGray` (#444444)
- **Muted Text**: `text-eyf-muted` (#777777)

## Typography Reference

- **Headings**: `font-poppins` or `font-montserrat`
- **Body**: `font-opensans`
- **Bold**: `font-bold` (700+)
- **Semibold**: `font-semibold` (600)

## Quick Setup Checklist

- [ ] Update SiteHeader.tsx with navigation links
- [ ] Update SiteFooter.tsx with footer links
- [ ] Connect Sanity CMS for content
- [ ] Set up Supabase database
- [ ] Configure email/Slack notifications
- [ ] Add your organization details (email, phone, address)
- [ ] Replace placeholder images
- [ ] Update color scheme if needed
- [ ] Test all forms
- [ ] Test responsive design
- [ ] Deploy to production

## Common Customizations

### Change Gold Color
In `tailwind.config.ts`:
```typescript
gold: "#YOUR_COLOR",
```

### Change Page Background
Update `bg-eyf-page` throughout components

### Add Custom Font
Import in `app/layout.tsx` and update `tailwind.config.ts`

### Add Hero Background Image
Pass `backgroundImage` prop to HeroSection

## Integration Checklist

### Sanity CMS
- [ ] Create team member schema
- [ ] Create blog post schema
- [ ] Create event schema
- [ ] Add API credentials to env vars
- [ ] Update pages to fetch from Sanity

### Supabase
- [ ] Create tables (contacts, events, volunteers)
- [ ] Add RLS policies
- [ ] Add API credentials to env vars
- [ ] Test form submissions

### Email/Notifications
- [ ] Set up Slack webhook or email service
- [ ] Test contact form submission
- [ ] Verify notifications are received

## Next Steps

1. **Update Navigation**: Modify header/footer components
2. **Connect CMS**: Set up Sanity schemas and fetch data
3. **Add Content**: Create content in CMS or database
4. **Customize**: Update colors, fonts, and branding
5. **Test**: Check all pages and forms
6. **Deploy**: Push to production

## Support

Refer to:
- [REBUILD_GUIDE.md](REBUILD_GUIDE.md) - Design system details
- [IMPLEMENTATION_GUIDE.md](IMPLEMENTATION_GUIDE.md) - Backend setup
- Component source files for detailed prop documentation
