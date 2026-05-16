# Component Specifications for Next.js Recreation

Detailed component specifications extracted from WordPress design analysis.

---

## Component: HeroSection

### Props
```typescript
interface HeroSectionProps {
  title: string;
  subtitle?: string;
  description?: string;
  backgroundImage?: string;
  gradient?: boolean;
  gradientStart?: string;  // default: #1a3a52
  gradientEnd?: string;    // default: #0f2438
  height?: 'small' | 'medium' | 'large';
  alignment?: 'center' | 'left' | 'right';
  textColor?: 'white' | 'dark';
  cta?: {
    text: string;
    href: string;
  };
}
```

### Dimensions
- **Height**: Small (150px), Medium (250px), Large (350px)
- **Padding**: 40px vertical (mobile), 60px (desktop)
- **Text**: Centered on page
- **Max Width**: 1200px centered container

### Typography
- **Title (H1)**: 2.5rem (mobile) → 3.75rem (desktop), weight 700, line-height 1.2
- **Subtitle (H2)**: 1.25rem (mobile) → 1.75rem (desktop), weight 500, line-height 1.4
- **Description**: 1rem, weight 400, line-height 1.6

### Background
- **Gradient**: linear-gradient(135deg, #1a3a52 0%, #0f2438 100%)
- **Fallback**: Solid #1a1a1a or #2d2d2d
- **Optional overlay**: radial-gradient(circle at 20% 50%, rgba(255,255,255,.1) 0%, transparent 50%)

### States
- **Default**: Full visibility
- **With Image**: Image as background, overlay for text readability
- **Animated**: Subtle parallax or background animation optional

---

## Component: CarouselSection

### Props
```typescript
interface Slide {
  id: string;
  heading: string;
  description: string;
  image?: string;
  cta?: {
    text: string;
    href: string;
  };
}

interface CarouselSectionProps {
  slides: Slide[];
  autoplay?: boolean;
  autoplayInterval?: number; // milliseconds
  showIndicators?: boolean;
  height?: string; // CSS height value
  loop?: boolean;
}
```

### Current State
- 3 slides total (as seen on homepage)
- Slides auto-rotate or manual navigation
- Indicator dots at bottom (3 dots for 3 slides)
- Active indicator: solid background, inactive: transparent with border

### Slide Content
1. **Slide 1**: "Join us and get engaged"
2. **Slide 2**: "Engage Youth Foundation" 
3. **Slide 3**: "Channelizing freshness to the community"

### Dimensions
- **Height**: 300px minimum (mobile), 400px (desktop)
- **Padding**: 60px vertical, 20px horizontal (mobile)
- **Heading**: H2 font size, white color
- **Description**: 1.125rem, white, max-width 600px

### Navigation
- **Indicators**: 12px diameter buttons
- **Spacing**: 12px gap between indicators
- **Position**: Bottom center, 30px from bottom
- **Active State**: White background, solid
- **Inactive State**: White border (2px), transparent background

### Animations
- **Slide transition**: 0.5s ease-in-out
- **Indicator animation**: Smooth color change 0.3s

---

## Component: ActivityGrid

### Props
```typescript
interface Activity {
  id: string;
  title: string;
  description: string;
  icon?: string;
  link?: string;
}

interface ActivityGridProps {
  activities: Activity[];
  columns?: {
    mobile: number;     // default: 1
    tablet: number;     // default: 2
    desktop: number;    // default: 4
  };
  spacing?: 'sm' | 'md' | 'lg'; // default: md
}
```

### Activities
1. Ecological Sustainability
2. Fighting Homelessness
3. Food Drives and Distribution
4. Youth Financial Literacy

### Card Structure
```
┌─────────────────────┐
│                     │
│   [Icon/Image]      │
│                     │
├─────────────────────┤
│ Activity Title      │
├─────────────────────┤
│ Description text    │
│ (2-3 lines)         │
└─────────────────────┘
```

### Styling
- **Background**: White (#ffffff)
- **Border-radius**: 8px
- **Padding**: 24px
- **Box-shadow**: 0 4px 6px rgba(0, 0, 0, 0.1)
- **Hover**: translateY(-4px), shadow: 0 10px 15px rgba(0, 0, 0, 0.15)

### Typography
- **Title (H3)**: 1.25rem, weight 600, color #2d2d2d
- **Description**: 0.95rem, weight 400, color #555, line-height 1.6

### Grid Dimensions
- **Gap**: 20px (mobile), 24px (desktop)
- **Max-width**: 1200px container
- **Desktop Layout**: 4 equal columns
- **Tablet Layout**: 2 columns
- **Mobile Layout**: 1 column, full-width

---

## Component: FAQAccordion

### Props
```typescript
interface FAQItem {
  id: string;
  question: string;
  answer: string;
  expanded?: boolean; // First item default true
}

interface FAQAccordionProps {
  items: FAQItem[];
  allowMultiple?: boolean; // default: false (only one open)
  animated?: boolean;      // default: true
}
```

### FAQ Items (10 total)
1. "What is Engage Youth Foundation (EYF)?" - **Expanded by default**
2. "How can I get involved with EYF?"
3. "What age group does EYF focus on?"
4. "Does EYF offer any programs for skill development?"
5. "How can I support EYF financially?"
6. "Is EYF involved in environmental initiatives?"
7. "Can I suggest a community project for EYF to consider?"
8. "How does EYF ensure data privacy and security?"
9. "Are there internship opportunities at EYF?"
10. "How can I stay updated on EYF's activities?"

### Item Structure
```
┌─────────────────────────────────────────┐
│ Question Text        [Expand/Collapse] │
├─────────────────────────────────────────┤
│ Answer text (when expanded)             │
│ Multiple lines supported                │
└─────────────────────────────────────────┘
```

### Styling
- **Background**: White with alternating light gray on open
- **Border**: 1px solid #e5e5e5 (bottom of each item)
- **Padding**: 16px 20px (header), 20px (content)
- **Hover**: Background #f5f5f5, text color #0891b2

### Header
- **Height**: 56px
- **Display**: Flex, space-between
- **Font**: 1rem, weight 600, color #2d2d2d
- **Icon**: +/− character, rotates on open

### Content
- **Font**: 0.95rem, weight 400, color #555
- **Line-height**: 1.6
- **Max-height**: Auto (expands to fit)
- **Animation**: slideDown 0.3s ease-out

### Interactions
- **Single open mode**: Opening one closes the previous
- **Keyboard**: Enter/Space to toggle, Tab to navigate
- **Aria**: aria-expanded attribute for accessibility

---

## Component: BlogGrid

### Props
```typescript
interface BlogPost {
  id: string;
  title: string;
  date: string;        // "November 18, 2023"
  category: string;    // "News"
  location?: string;   // "Mumbai, Maharashtra, India"
  excerpt: string;     // First 100-150 chars
  image?: string;
  url: string;
  shareCount?: number;
}

interface BlogGridProps {
  posts: BlogPost[];
  columns?: {
    mobile: number;    // default: 1
    tablet: number;    // default: 2
    desktop: number;   // default: 3
  };
  showSidebar?: boolean;
}
```

### Blog Posts Listed
1. "Child Rights and You Blog" - November 18, 2023
2. "Akshaya Patra Blog" - November 18, 2023
3. "Narayan Seva Sansthan" - November 1, 2023
(+ more in Recent Posts list)

### Card Structure
```
┌──────────────────────────────────┐
│  [Featured Image - Optional]     │
├──────────────────────────────────┤
│ Blog Post Title (H3)             │
│ Posted on Date | Category        │
│ Location (if available)          │
├──────────────────────────────────┤
│ Post excerpt text...             │
│ (Truncate after ~150 chars)      │
├──────────────────────────────────┤
│ [Social icons] [Read More]       │
└──────────────────────────────────┘
```

### Card Styling
- **Background**: White (#ffffff)
- **Border-radius**: 8px
- **Padding**: 24px
- **Box-shadow**: 0 4px 6px rgba(0, 0, 0, 0.1)
- **Hover**: Scale 1.02, shadow: 0 10px 15px rgba(0, 0, 0, 0.15)

### Typography
- **Title (H3)**: 1.25rem, weight 600, color #2d2d2d, line-height 1.3
- **Metadata**: 0.875rem, color #a0a0a0
- **Excerpt**: 0.95rem, weight 400, color #555, line-height 1.6
- **Read More Link**: 0.95rem, color #0891b2, weight 500

### Grid Dimensions
- **Gap**: 20px (mobile), 24px (desktop)
- **Max-width**: 1200px
- **Desktop**: 3 columns
- **Tablet**: 2 columns
- **Mobile**: 1 column

### Sidebar (if shown)
- **Width**: 250px on desktop, hidden on mobile/tablet
- **Sections**:
  - Recent Posts (bulleted list)
  - Archives (by month/year)
  - Categories (links)

---

## Component: ContactForm

### Props
```typescript
interface ContactFormProps {
  onSubmit: (data: FormData) => Promise<void>;
  isLoading?: boolean;
  successMessage?: string;
  errorMessage?: string;
}

interface FormData {
  name: string;
  email: string;
  message?: string;
  file?: File;
}
```

### Fields
1. **Name** (text input)
   - Placeholder: "Name"
   - Required: Yes
   
2. **Email** (email input)
   - Placeholder: "Add email"
   - Required: Yes
   - Validation: Valid email format
   
3. **File Upload**
   - Label: "Choose a file"
   - Status: "No file chosen." initially
   - Optional: Yes
   
4. **Message** (textarea)
   - Placeholder: "Message"
   - Rows: 6
   - Optional: Yes

### Form Styling
- **Max-width**: 600px
- **Margin**: 40px auto
- **Padding**: 40px
- **Background**: White (#ffffff)
- **Spacing between fields**: 20px

### Input Styling
- **Padding**: 12px 16px
- **Border**: 1px solid #e5e5e5
- **Border-radius**: 6px
- **Font**: 1rem, inherit
- **Focus**: Border #0891b2, box-shadow: 0 0 0 3px rgba(8, 145, 178, 0.1)

### File Upload
- **Display**: As button with status text
- **Padding**: 12px 16px
- **Background**: #f9f9f9
- **Border**: 1px solid #e5e5e5
- **Hover**: Background #f0f0f0, border #0891b2
- **Status text**: 0.875rem, color #a0a0a0

### Submit Button
- **Text**: "Send Message"
- **Type**: Pill-shaped (border-radius: 24px)
- **Padding**: 12px 32px
- **Background**: White (#ffffff)
- **Color**: Dark text (#1a1a1a)
- **Width**: 100% on mobile, auto on desktop
- **Hover**: Background #f0f0f0, shadow elevation

### Validation
- **Real-time**: Optional (debounced validation)
- **On Submit**: Full validation before sending
- **Error Display**: Inline under field or toast notification
- **Success**: Toast notification or page redirect

---

## Component: EventsFilter

### Props
```typescript
interface EventsFilterProps {
  onFilter: (filters: FilterState) => void;
  categories?: string[];
  eventTypes?: string[];
  locations?: string[];
}

interface FilterState {
  keywords: string;
  location: string;
  dateRange: [Date | null, Date | null];
  category: string;
  eventType: string;
}
```

### Fields
1. **Keywords** (text input)
   - Placeholder: "Keywords"
   
2. **Location** (text input)
   - Placeholder: "Location"
   
3. **Date Range** (date picker)
   - Button text: "Any dates" (default)
   - Shows selected range when chosen
   
4. **Category** (select dropdown)
   - Default: "Choose an Event Category"
   - Options: "Ecological Sustainability", "Family & Education", etc.
   
5. **Event Type** (select dropdown)
   - Default: "Choose an Event Type"
   - Options: "Class, Training, or Workshop", "Conference", etc.

### Results
- **No events state**: "There are currently no events."
- **With events**: Grid or list of event cards

### Styling
- **Background**: White or light gray section
- **Max-width**: 1200px
- **Padding**: 20px on mobile, 40px on desktop
- **Grid**: Flex or grid layout, wrapping on mobile

---

## Component: Newsletter Subscription (Footer)

### Props
```typescript
interface NewsletterProps {
  onSubscribe: (email: string) => Promise<void>;
  placeholder?: string;
  buttonText?: string;
}
```

### Structure
```
┌─────────────────────────────────────┐
│ [Email Input]  [Subscribe Button]  │
└─────────────────────────────────────┘
```

### Input Styling
- **Flex**: 1 (fill available space)
- **Padding**: 12px 16px
- **Border**: None
- **Border-radius**: 6px
- **Background**: rgba(255, 255, 255, 0.1)
- **Color**: White
- **Font**: 1rem

### Button
- **Padding**: 12px 32px
- **Background**: White
- **Color**: Dark text
- **Border-radius**: 24px (pill shape)
- **Cursor**: Pointer

### Accessibility
- **Label**: Hidden or aria-label
- **Validation**: Client-side email validation
- **Feedback**: Success/error messages

---

## Component: Footer

### Props
```typescript
interface FooterProps {
  showNewsletter?: boolean;
  links?: Array<{
    text: string;
    href: string;
  }>;
  socialLinks?: Array<{
    platform: 'facebook' | 'instagram' | 'youtube' | 'linkedin';
    url: string;
  }>;
}
```

### Structure
```
┌─────────────────────────────────────────┐
│  [Newsletter Subscription]              │
├─────────────────────────────────────────┤
│  © 2024 EYF                             │
│  [Privacy] [Contact]                    │
│  [Social Icons]                         │
└─────────────────────────────────────────┘
```

### Styling
- **Background**: #1a1a1a
- **Color**: White
- **Padding**: 60px 20px 30px
- **Margin-top**: 80px

### Copyright
- **Font**: 0.875rem
- **Color**: rgba(255, 255, 255, 0.8)

### Links
- **Display**: Flex column or row
- **Gap**: 12px (vertical) or 16px (horizontal)
- **Font**: 0.95rem
- **Color**: rgba(255, 255, 255, 0.8)
- **Hover**: White color

### Social Icons
- **Size**: 32x32px
- **Gap**: 16px
- **Background**: rgba(255, 255, 255, 0.1)
- **Border-radius**: 4px
- **Hover**: Background rgba(255, 255, 255, 0.2)

---

## Component: Header/Navigation

### Props
```typescript
interface HeaderProps {
  logo?: React.ReactNode;
  navigation?: Array<{
    label: string;
    href: string;
  }>;
  onMenuToggle?: (open: boolean) => void;
}
```

### Structure
```
[Logo Text]  [        ]  [Menu ☰]
            (center)
```

### Styling
- **Background**: #0a0a0a (pure black)
- **Height**: 60px
- **Position**: Sticky, top: 0
- **Z-index**: 100
- **Box-shadow**: 0 2px 4px rgba(0, 0, 0, 0.1)

### Logo
- **Display**: Flex items center
- **Gap**: 8px (between icon and text)
- **Font**: 1rem, weight 600, color white

### Menu Toggle
- **Responsive**: Display none (desktop), display block (mobile)
- **Background**: None
- **Border**: None
- **Color**: White
- **Font-size**: 1.5rem
- **Cursor**: Pointer

### Mobile Menu
- **Position**: Fixed/absolute from top
- **Width**: 100%
- **Height**: Calc(100vh - 60px)
- **Background**: #1a1a1a or #2d2d2d
- **Z-index**: 99 (below header)
- **Animation**: Slide down 0.3s ease

---

## Responsive Breakpoints Summary

### Mobile
- Breakpoint: < 640px
- Single column layouts
- Hamburger menu navigation
- Full-width cards/forms
- Smaller typography (clamp function)
- Padding: 1rem gutters

### Tablet
- Breakpoint: 640px - 1024px
- 2-column grids where appropriate
- Medium spacing
- Medium typography

### Desktop
- Breakpoint: > 1024px
- Full multi-column layouts
- 4-column activity grid
- 3-column blog grid
- Max-width containers (1200px)
- Larger spacing/padding

---

## Animation Specifications

### Page Transitions
- **Duration**: 300ms
- **Easing**: ease-out
- **Effect**: Fade in or slide up

### Component Hover Effects
- **Duration**: 300ms
- **Easing**: ease
- **Effects**: Color change, scale, shadow

### Carousel Slide
- **Duration**: 500ms
- **Easing**: ease-in-out
- **Effect**: Smooth horizontal translation

### Accordion Expand
- **Duration**: 300ms
- **Easing**: ease-out
- **Effects**: Slide down + fade in

### Button Press
- **Duration**: 200ms
- **Easing**: ease
- **Effect**: Scale down slightly, then back

---

## Testing Specifications

### Accessibility (WCAG AA)
- [ ] Color contrast ratios ≥ 4.5:1 for text
- [ ] All interactive elements keyboard accessible
- [ ] Forms have proper labels
- [ ] Headings proper hierarchy
- [ ] ARIA attributes where needed

### Responsive Design
- [ ] Mobile (320px, 480px)
- [ ] Tablet (768px, 1024px)
- [ ] Desktop (1200px, 1920px)
- [ ] Touch targets ≥ 48px

### Performance
- [ ] First Contentful Paint < 2s
- [ ] Largest Contentful Paint < 2.5s
- [ ] Cumulative Layout Shift < 0.1
- [ ] Images optimized (WebP, proper sizes)

---

This specification document provides the blueprint for implementing all components to match the WordPress design exactly in Next.js.
