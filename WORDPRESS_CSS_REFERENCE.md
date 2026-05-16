# WordPress to Next.js - CSS & Styling Reference

This document provides exact CSS/Tailwind patterns extracted from the Engage Youth Foundation WordPress design.

---

## Color Constants

```typescript
// colors.ts
export const colors = {
  // Primary dark
  dark: {
    charcoal: '#0a0a0a',    // Header/Nav background
    bg: '#1a1a1a',           // General dark background
    section: '#2d2d2d',      // Dark section backgrounds
  },
  
  // Hero gradients
  gradients: {
    heroDark: 'linear-gradient(135deg, #1a3a52 0%, #0f2438 100%)',
    heroDarkAlt: 'linear-gradient(180deg, #1a3a52 0%, #0f2438 100%)',
  },
  
  // Light backgrounds
  light: {
    bg: '#ffffff',           // Main content background
    section: '#f5f5f5',      // Alternative light section
    border: '#e5e5e5',       // Light borders
  },
  
  // Text colors
  text: {
    dark: '#2d2d2d',         // Dark text on light backgrounds
    light: '#ffffff',        // Light text on dark backgrounds
    muted: '#a0a0a0',        // Muted/secondary text
    accent: '#0891b2',       // Teal accent (Privacy page)
  },
  
  // Status colors
  error: '#dc2626',
  success: '#16a34a',
  warning: '#f59e0b',
};
```

---

## Typography

```typescript
// typography.ts
export const typography = {
  fonts: {
    body: 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  },
  
  sizes: {
    h1: 'clamp(2rem, 5vw, 3.75rem)',        // 40-60px
    h2: 'clamp(1.75rem, 4vw, 2.25rem)',     // 28-36px
    h3: 'clamp(1.25rem, 3vw, 1.75rem)',     // 20-28px
    h4: 'clamp(1rem, 2vw, 1.25rem)',        // 16-20px
    body: '1rem',                            // 16px
    small: '0.875rem',                       // 14px
  },
  
  weights: {
    light: 300,
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
  
  lineHeights: {
    tight: 1.25,
    normal: 1.5,
    relaxed: 1.75,
    loose: 2,
  },
};
```

---

## Global Layout

```tsx
// layout.css / global.css
:root {
  /* Spacing scale */
  --space-xs: 0.25rem;
  --space-sm: 0.5rem;
  --space-md: 1rem;
  --space-lg: 1.5rem;
  --space-xl: 2rem;
  --space-2xl: 2.5rem;
  --space-3xl: 3rem;
  --space-4xl: 4rem;
  
  /* Border radius */
  --radius-sm: 0.25rem;
  --radius-md: 0.5rem;
  --radius-lg: 0.75rem;
  --radius-xl: 1rem;
  --radius-full: 9999px;
  
  /* Shadows */
  --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  --shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
}

body {
  font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto;
  line-height: 1.5;
  color: #2d2d2d;
  background: white;
}

/* Container */
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
  
  @media (min-width: 1024px) {
    padding: 0 2rem;
  }
}
```

---

## Header / Navigation

```tsx
// Header.tsx
import styles from './Header.module.css';

const Header = ({ isOpen, setIsOpen }) => (
  <header className={styles.header}>
    <nav className={styles.nav}>
      <Logo />
      <button 
        className={styles.menuToggle}
        onClick={() => setIsOpen(!isOpen)}
      >
        ≡
      </button>
    </nav>
  </header>
);

export default Header;

// Header.module.css
.header {
  background: #0a0a0a;
  height: 60px;
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
}

.menuToggle {
  display: none;
  background: none;
  border: none;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
  
  @media (max-width: 768px) {
    display: block;
  }
}
```

---

## Hero Section

```tsx
// HeroSection.tsx
interface HeroProps {
  title: string;
  subtitle?: string;
  height?: 'small' | 'medium' | 'large';
  gradient?: boolean;
}

const HeroSection = ({ 
  title, 
  subtitle, 
  height = 'medium',
  gradient = true 
}: HeroProps) => {
  const heightMap = {
    small: 'h-40',
    medium: 'h-64',
    large: 'h-96',
  };
  
  return (
    <section 
      className={`
        ${heightMap[height]}
        ${gradient ? 'bg-gradient-to-br from-[#1a3a52] to-[#0f2438]' : 'bg-[#2d2d2d]'}
        flex items-center justify-center text-center
        text-white
      `}
    >
      <div className="container">
        <h1 className="text-5xl font-bold mb-4">{title}</h1>
        {subtitle && <p className="text-xl text-gray-300">{subtitle}</p>}
      </div>
    </section>
  );
};
```

```css
/* HeroSection.css */
.hero {
  background: linear-gradient(135deg, #1a3a52 0%, #0f2438 100%);
  height: 250px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
}

.hero::before {
  /* Optional animated background */
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at 20% 50%, rgba(255,255,255,.1) 0%, transparent 50%);
  pointer-events: none;
}

.hero-content {
  position: relative;
  z-index: 1;
  text-align: center;
}

.hero h1 {
  font-size: 2.5rem;
  font-weight: 700;
  color: white;
  margin-bottom: 1rem;
  line-height: 1.2;
}

.hero p {
  font-size: 1.125rem;
  color: rgba(255, 255, 255, 0.9);
  line-height: 1.5;
}
```

---

## Carousel / Slider

```tsx
// CarouselSection.tsx
import { useState } from 'react';

interface SlideItem {
  heading: string;
  text: string;
}

const CarouselSection = ({ slides }: { slides: SlideItem[] }) => {
  const [current, setCurrent] = useState(0);
  
  return (
    <div className="carousel-container">
      <div className="carousel-track">
        {slides.map((slide, idx) => (
          <div 
            key={idx} 
            className={`carousel-slide ${idx === current ? 'active' : ''}`}
            style={{ transform: `translateX(-${current * 100}%)` }}
          >
            <h2 className="text-4xl font-bold">{slide.heading}</h2>
            <p className="text-lg mt-4">{slide.text}</p>
          </div>
        ))}
      </div>
      
      <div className="carousel-indicators">
        {slides.map((_, idx) => (
          <button
            key={idx}
            className={`indicator ${idx === current ? 'active' : ''}`}
            onClick={() => setCurrent(idx)}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
};
```

```css
/* CarouselSection.css */
.carousel-container {
  position: relative;
  overflow: hidden;
  background: linear-gradient(135deg, #1a3a52 0%, #0f2438 100%);
  color: white;
  padding: 60px 20px;
}

.carousel-track {
  display: flex;
  transition: transform 0.5s ease-in-out;
  position: relative;
}

.carousel-slide {
  flex: 0 0 100%;
  min-height: 300px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  padding: 20px;
}

.carousel-slide h2 {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
}

.carousel-slide p {
  font-size: 1.125rem;
  line-height: 1.6;
  max-width: 500px;
}

.carousel-indicators {
  display: flex;
  justify-content: center;
  gap: 12px;
  margin-top: 30px;
}

.indicator {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: 2px solid white;
  background: transparent;
  cursor: pointer;
  transition: all 0.3s ease;
}

.indicator.active {
  background: white;
}
```

---

## Card Components

```tsx
// ActivityCard.tsx
interface ActivityCardProps {
  title: string;
  description: string;
}

const ActivityCard = ({ title, description }: ActivityCardProps) => (
  <div className="activity-card">
    <h3 className="card-title">{title}</h3>
    <p className="card-description">{description}</p>
  </div>
);

// BlogCard.tsx
interface BlogCardProps {
  title: string;
  date: string;
  category: string;
  excerpt: string;
  url: string;
}

const BlogCard = ({ title, date, category, excerpt, url }: BlogCardProps) => (
  <div className="blog-card">
    <h3 className="blog-title">{title}</h3>
    <div className="blog-meta">
      <span className="blog-date">Posted on {date}</span>
      <span className="blog-category">{category}</span>
    </div>
    <p className="blog-excerpt">{excerpt}</p>
    <a href={url} className="read-more-link">Read More</a>
  </div>
);
```

```css
/* Card styles */
.activity-card,
.blog-card {
  background: white;
  border-radius: 8px;
  padding: 24px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.activity-card:hover,
.blog-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 15px rgba(0, 0, 0, 0.15);
}

.card-title,
.blog-title {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 12px;
  color: #2d2d2d;
}

.card-description,
.blog-excerpt {
  font-size: 0.95rem;
  line-height: 1.6;
  color: #555;
  margin-bottom: 16px;
}

.blog-meta {
  display: flex;
  gap: 16px;
  margin-bottom: 12px;
  font-size: 0.875rem;
  color: #a0a0a0;
}

.read-more-link {
  color: #0891b2;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.3s ease;
}

.read-more-link:hover {
  color: #0e7490;
  text-decoration: underline;
}
```

---

## Grid Layouts

```tsx
// ActivityGridSection.tsx
const ActivityGridSection = ({ activities }) => (
  <section className="activities-section">
    <div className="container">
      <h2 className="section-heading">Key Activities</h2>
      <div className="activity-grid">
        {activities.map(activity => (
          <ActivityCard key={activity.id} {...activity} />
        ))}
      </div>
    </div>
  </section>
);
```

```css
/* Grid layouts */
.activities-section,
.blog-grid-section {
  padding: 60px 20px;
  background: white;
}

.activity-grid,
.blog-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 24px;
  
  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (min-width: 1024px) {
    grid-template-columns: repeat(4, 1fr);
  }
}

.blog-grid {
  @media (min-width: 1024px) {
    grid-template-columns: repeat(3, 1fr);
  }
}

.section-heading {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 40px;
  color: #2d2d2d;
  text-align: center;
}
```

---

## Forms

```tsx
// ContactForm.tsx
const ContactForm = () => {
  const [formData, setFormData] = useState({ name: '', email: '', file: null });
  
  return (
    <form className="contact-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <input
          type="text"
          placeholder="Name"
          value={formData.name}
          onChange={(e) => setFormData({...formData, name: e.target.value})}
          className="form-input"
        />
      </div>
      
      <div className="form-group">
        <input
          type="email"
          placeholder="Add email"
          value={formData.email}
          onChange={(e) => setFormData({...formData, email: e.target.value})}
          className="form-input"
        />
      </div>
      
      <div className="form-group">
        <label className="file-upload-label">
          <input type="file" className="file-input" />
          <span>Choose a file</span>
        </label>
        <span className="file-status">No file chosen.</span>
      </div>
      
      <button type="submit" className="btn btn-primary">
        Send Message
      </button>
    </form>
  );
};
```

```css
/* Form styles */
.contact-form,
.event-filter-form {
  max-width: 600px;
  margin: 40px auto;
  padding: 40px;
  background: white;
}

.form-group {
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
}

.form-input {
  padding: 12px 16px;
  border: 1px solid #e5e5e5;
  border-radius: 6px;
  font-size: 1rem;
  transition: border-color 0.3s ease;
  font-family: inherit;
}

.form-input:focus {
  outline: none;
  border-color: #0891b2;
  box-shadow: 0 0 0 3px rgba(8, 145, 178, 0.1);
}

.file-upload-label {
  display: inline-flex;
  align-items: center;
  padding: 12px 16px;
  border: 1px solid #e5e5e5;
  border-radius: 6px;
  background: #f9f9f9;
  cursor: pointer;
  transition: all 0.3s ease;
}

.file-upload-label:hover {
  background: #f0f0f0;
  border-color: #0891b2;
}

.file-input {
  display: none;
}

.file-status {
  display: block;
  font-size: 0.875rem;
  color: #a0a0a0;
  margin-top: 8px;
}

.form-select {
  padding: 12px 16px;
  border: 1px solid #e5e5e5;
  border-radius: 6px;
  background: white;
  font-size: 1rem;
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%232d2d2d' d='M6 9L1 4h10z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 12px center;
  padding-right: 36px;
}

.form-select:focus {
  outline: none;
  border-color: #0891b2;
}
```

---

## Buttons

```tsx
// Button.tsx
interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'text';
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
}

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md',
  onClick 
}: ButtonProps) => (
  <button 
    className={`btn btn-${variant} btn-${size}`}
    onClick={onClick}
  >
    {children}
  </button>
);
```

```css
/* Button styles */
.btn {
  font-family: inherit;
  font-weight: 500;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  border-radius: 24px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.btn-primary {
  background: white;
  color: #1a1a1a;
  padding: 12px 32px;
}

.btn-primary:hover {
  background: #f0f0f0;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.btn-secondary {
  background: transparent;
  color: white;
  border: 1px solid white;
  padding: 10px 24px;
}

.btn-secondary:hover {
  background: rgba(255, 255, 255, 0.1);
}

.btn-text {
  background: none;
  color: #0891b2;
  padding: 8px 0;
  text-decoration: none;
}

.btn-text:hover {
  color: #0e7490;
  text-decoration: underline;
}

.btn-sm {
  padding: 8px 16px;
  font-size: 0.875rem;
}

.btn-lg {
  padding: 16px 40px;
  font-size: 1.125rem;
}
```

---

## Accordion / FAQ

```tsx
// AccordionItem.tsx
import { useState } from 'react';

interface AccordionItemProps {
  question: string;
  answer: string;
  isOpen?: boolean;
}

const AccordionItem = ({ question, answer, isOpen = false }: AccordionItemProps) => {
  const [open, setOpen] = useState(isOpen);
  
  return (
    <div className={`accordion-item ${open ? 'open' : ''}`}>
      <button
        className="accordion-header"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
      >
        <span className="accordion-title">{question}</span>
        <span className="accordion-icon">
          {open ? '−' : '+'}
        </span>
      </button>
      
      {open && (
        <div className="accordion-content">
          <p>{answer}</p>
        </div>
      )}
    </div>
  );
};
```

```css
/* Accordion styles */
.accordion {
  border-top: 1px solid #e5e5e5;
}

.accordion-item {
  border-bottom: 1px solid #e5e5e5;
  transition: background-color 0.3s ease;
}

.accordion-item.open {
  background: #f9f9f9;
}

.accordion-header {
  width: 100%;
  padding: 16px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 600;
  color: #2d2d2d;
  transition: color 0.3s ease;
}

.accordion-header:hover {
  color: #0891b2;
  background: #f5f5f5;
}

.accordion-title {
  text-align: left;
}

.accordion-icon {
  font-size: 1.5rem;
  transition: transform 0.3s ease;
}

.accordion-item.open .accordion-icon {
  transform: rotate(0deg);
}

.accordion-content {
  padding: 0 20px 20px 20px;
  color: #555;
  line-height: 1.6;
  animation: slideDown 0.3s ease-out;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

---

## Footer

```tsx
// Footer.tsx
const Footer = () => (
  <footer className="footer">
    <div className="container">
      <div className="footer-newsletter">
        <input 
          type="email" 
          placeholder="Sign up to newsletter" 
          className="newsletter-input"
        />
        <button className="btn btn-primary">Subscribe</button>
      </div>
      
      <div className="footer-content">
        <p className="footer-copyright">
          © 2024 Engage Youth Foundation
        </p>
        
        <div className="footer-links">
          <a href="/privacy-policy">Privacy Policy</a>
          <a href="/contact-us">Contact us</a>
        </div>
        
        <ul className="social-links">
          <li><a href="#">Facebook</a></li>
          <li><a href="#">Instagram</a></li>
          <li><a href="#">YouTube</a></li>
        </ul>
      </div>
    </div>
  </footer>
);
```

```css
/* Footer styles */
.footer {
  background: #1a1a1a;
  color: white;
  padding: 60px 20px 30px;
  margin-top: 80px;
}

.footer-newsletter {
  display: flex;
  gap: 12px;
  max-width: 400px;
  margin-bottom: 40px;
}

.newsletter-input {
  flex: 1;
  padding: 12px 16px;
  border: none;
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  font-size: 1rem;
}

.newsletter-input::placeholder {
  color: rgba(255, 255, 255, 0.6);
}

.footer-content {
  display: grid;
  grid-template-columns: 1fr 1fr auto;
  gap: 40px;
  margin-bottom: 30px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 20px;
  }
}

.footer-copyright {
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.8);
}

.footer-links {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.footer-links a {
  color: rgba(255, 255, 255, 0.8);
  text-decoration: none;
  transition: color 0.3s ease;
}

.footer-links a:hover {
  color: white;
}

.social-links {
  display: flex;
  gap: 16px;
  list-style: none;
  padding: 0;
}

.social-links a {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  color: white;
  text-decoration: none;
  transition: background 0.3s ease;
}

.social-links a:hover {
  background: rgba(255, 255, 255, 0.2);
}
```

---

## Responsive Utilities

```css
/* Responsive utilities */
@media (max-width: 640px) {
  /* Mobile styles */
  .container {
    padding: 0 1rem;
  }
  
  .activity-grid,
  .blog-grid {
    grid-template-columns: 1fr;
  }
  
  .carousel-slide h2 {
    font-size: 1.75rem;
  }
  
  .hero h1 {
    font-size: 1.75rem;
  }
  
  .section-heading {
    font-size: 1.5rem;
  }
}

@media (min-width: 641px) and (max-width: 1024px) {
  /* Tablet styles */
  .activity-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .blog-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1025px) {
  /* Desktop styles */
  .container {
    max-width: 1200px;
  }
}
```

---

## Animation Keyframes

```css
/* Common animations */
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideInDown {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

/* Apply animations */
.fade-in {
  animation: fadeIn 0.3s ease-in;
}

.slide-in-up {
  animation: slideInUp 0.5s ease-out;
}

.slide-in-down {
  animation: slideInDown 0.5s ease-out;
}
```

---

## Tailwind Configuration Reference

If using Tailwind CSS, add these customizations:

```javascript
// tailwind.config.ts
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    colors: {
      dark: '#1a1a1a',
      charcoal: '#0a0a0a',
      light: '#ffffff',
      'light-bg': '#f5f5f5',
      accent: '#0891b2',
    },
    extend: {
      backgroundImage: {
        'hero-gradient': 'linear-gradient(135deg, #1a3a52 0%, #0f2438 100%)',
      },
      spacing: {
        'safe': 'max(1rem, env(safe-area-inset-left))',
      },
    },
  },
  plugins: [],
}

export default config
```

---

## Next.js Specific Patterns

```tsx
// pages/index.tsx
import { GetStaticProps } from 'next'
import HeroSection from '@/components/sections/HeroSection'
import CarouselSection from '@/components/sections/CarouselSection'

export default function Home({ heroSlides, activities }) {
  return (
    <>
      <CarouselSection slides={heroSlides} />
      <section className="py-16 bg-white">
        {/* Content */}
      </section>
    </>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  // Fetch data from WordPress/API
  return {
    props: {
      heroSlides: [],
      activities: [],
    },
    revalidate: 3600, // Revalidate every hour
  }
}
```

This CSS/styling reference provides all the visual patterns needed to exactly recreate the WordPress design in Next.js.
