# Testing Guide - EYF Website Pages

## Quick Start Testing (2 minutes)

### Step 1: Start Development Server
```bash
cd c:\Users\acnee\OneDrive\Desktop\EYF
npm run dev
```

The app will start at: **http://localhost:3000**

### Step 2: Test Each Page
Open your browser and visit:

| Page | URL | Expected |
|------|-----|----------|
| Home | http://localhost:3000 | Hero + About + Events |
| About | http://localhost:3000/about-us | About page with mission/vision |
| Team | http://localhost:3000/team | Team page (loading state if no Sanity) |
| Volunteer | http://localhost:3000/volunteer-with-us | Volunteer guidelines |
| Events | http://localhost:3000/events | Events list with date filter |
| Blog | http://localhost:3000/blog | Blog posts (loading state if no Sanity) |
| FAQ | http://localhost:3000/faq | FAQ accordion |
| Donate | http://localhost:3000/donate | Donation page |
| Contact | http://localhost:3000/contact-us | Contact form |
| Privacy | http://localhost:3000/privacy-policy | Privacy policy |
| Terms | http://localhost:3000/terms | Terms of service |

---

## Testing Checklist

### ✅ Page Load Tests
- [ ] All pages load without errors
- [ ] No 404 errors in console
- [ ] No JavaScript errors (F12 → Console)
- [ ] Page titles display correctly

### ✅ Navigation Tests
- [ ] Header links navigate correctly
- [ ] Footer links navigate correctly
- [ ] Back button works
- [ ] URL updates when navigating

### ✅ Layout & Design Tests
- [ ] Dark background (#1c1c1c) displays
- [ ] Gold accent color (#e0be53) shows
- [ ] Text is readable (white on dark)
- [ ] Images load properly (if added)
- [ ] Spacing looks consistent

### ✅ Form Tests
**Contact Form (`/contact-us`):**
- [ ] Fill all fields
- [ ] Submit button works
- [ ] Success message appears
- [ ] Form clears after submission
- [ ] File upload works (optional)

### ✅ Interactive Elements
**FAQ Page:**
- [ ] Click question to expand
- [ ] Answer displays
- [ ] Click again to collapse
- [ ] Multiple FAQs can open/close

**Events Page:**
- [ ] Date picker works
- [ ] Filter by start date works
- [ ] Filter by end date works
- [ ] Clear filters works

### ✅ Content Loading (Sanity Integration)
**Events Page:**
- [ ] "Loading events..." appears initially
- [ ] Events display after loading
- [ ] Event details show (title, date, location)

**Team Page:**
- [ ] "Loading team members..." appears initially
- [ ] Team cards display after loading
- [ ] Shows Board of Directors section
- [ ] Shows Advisory Board section

**Blog Page:**
- [ ] "Loading blog posts..." appears initially
- [ ] Blog posts display in grid
- [ ] Shows post title, excerpt, category, date

---

## Step-by-Step Testing Guide

### Test 1: Basic Page Load
```bash
# 1. Start server
npm run dev

# 2. Open browser
# http://localhost:3000

# 3. Check browser console (F12)
# Should see no red errors
```

### Test 2: Navigation Flow
```
1. Click "About Us" link
   → Should go to /about-us
   
2. Click "Our Team" link
   → Should go to /team
   
3. Click "Events" link
   → Should go to /events
   
4. Click "Volunteer" link
   → Should go to /volunteer-with-us
   
5. Click "Contact Us" link
   → Should go to /contact-us
```

### Test 3: Forms
**Contact Form Test:**
```
1. Go to /contact-us
2. Fill form:
   - Name: "John Doe"
   - Email: "john@example.com"
   - Subject: "Test"
   - Message: "Testing the form"
3. Click "Send Message"
4. Should see: "Thank you for your message..."
5. Form should clear
```

### Test 4: FAQ Accordion
```
1. Go to /faq
2. Click first question
   → Answer should expand
3. Click another question
   → First closes, second opens
4. Click same question again
   → Should collapse
5. Click "Contact Us" button
   → Should go to /contact-us
```

### Test 5: Events Page
```
1. Go to /events
2. Leave date filters empty
   → Shows "no events scheduled" or loading state
3. Set start date
   → Should filter events (when Sanity connected)
4. Set end date
   → Should further filter events
5. Clear dates
   → Should show all events again
```

---

## Responsive Design Testing

### Test on Different Screen Sizes

#### Mobile (375px - iPhone SE)
```bash
# In Chrome DevTools:
1. F12 → Toggle device toolbar (Ctrl+Shift+M)
2. Select "iPhone SE"
3. Check:
   - Text readable
   - Buttons clickable
   - No horizontal scroll
   - Forms stack vertically
```

#### Tablet (768px - iPad)
```bash
1. DevTools → iPad
2. Check:
   - 2-column layouts work
   - Navigation accessible
   - Forms aligned properly
```

#### Desktop (1440px)
```bash
1. DevTools → Disable device toolbar
2. Resize browser to full screen
3. Check:
   - Max-width container (1140px) works
   - 3-column grids display
   - Hover effects work
```

### Responsive Breakpoints to Test
- Mobile: 375px
- Tablet: 768px (md:)
- Large: 1024px (lg:)
- Desktop: 1440px

---

## Browser DevTools Testing

### F12 Console Errors
```
1. Press F12 to open DevTools
2. Go to "Console" tab
3. Look for red error messages
4. Should be mostly empty or no red errors
```

### Network Tab
```
1. Press F12 → Network tab
2. Reload page (F5)
3. Check:
   - All requests succeed (green 200)
   - No red 404 errors
   - Images load
   - No blocked content
```

### Performance
```
1. F12 → Lighthouse tab
2. Click "Analyze page load"
3. Check metrics:
   - First Contentful Paint < 3s
   - Largest Contentful Paint < 4s
   - Cumulative Layout Shift < 0.1
```

---

## Sanity Integration Testing

### Before Sanity Setup
- Pages show "Loading..." state
- No errors in console
- Components render empty/placeholder content

### After Sanity Setup

#### Test Events Page
```
1. Add event in Sanity:
   - Title: "Youth Workshop"
   - Date: Today
   - Location: "Downtown"
   
2. Go to /events
3. Should see:
   - "Youth Workshop"
   - Today's date
   - "Downtown" location
   
4. Filter by date range
5. Should filter events correctly
```

#### Test Team Page
```
1. Add team member in Sanity:
   - Name: "John Smith"
   - Role: "Board Member"
   - Board Type: "board"
   
2. Go to /team
3. Should see:
   - "John Smith" name
   - "Board Member" role
   - Profile image (if added)
   
4. Try adding advisory board member
5. Should show in "Advisory Board" section
```

#### Test Blog Page
```
1. Add blog post in Sanity:
   - Title: "Youth Engagement Tips"
   - Excerpt: "Learn how..."
   - Category: "Education"
   - Date: Today
   
2. Go to /blog
3. Should see:
   - "Youth Engagement Tips"
   - Category badge
   - Date
   - Excerpt
```

---

## Automated Testing Commands

### Build Test
```bash
# Test production build
npm run build

# Should complete without errors
# Creates .next folder
```

### Lint Test
```bash
# Check for code errors
npm run lint

# Should show no errors (or warnings only)
```

---

## Common Issues & Fixes

### Issue: "Page not found" (404)
**Solution:**
- Check route exists in `/src/app/[page-name]/page.tsx`
- Restart dev server: `npm run dev`

### Issue: "Loading..." state never ends
**Solution:**
- Not connected to Sanity CMS yet
- Check `NEXT_PUBLIC_SANITY_PROJECT_ID` in `.env.local`
- Mock data will work until Sanity is set up

### Issue: Form doesn't submit
**Solution:**
- Check browser console for errors (F12)
- Verify form fields have correct names
- Check `onSubmit` handler in ContactForm component

### Issue: Styles not loading (unstyled page)
**Solution:**
- Clear browser cache: Ctrl+Shift+Delete
- Restart dev server: `npm run dev`
- Rebuild: `npm run build`

### Issue: Images not showing
**Solution:**
- Check image paths in code
- Verify Cloudinary is configured
- Check `/public` folder for images

---

## Testing Checklist by Page

### Home Page
- [ ] Hero section displays
- [ ] Stats counters show (0 values)
- [ ] About snippet displays
- [ ] Key Activities section shows 4 areas
- [ ] Newsletter signup visible

### About Page
- [ ] Hero section with title
- [ ] About introduction text
- [ ] Mission & Vision section displays
- [ ] Evolution sections show all subsections
- [ ] Board/Advisory sections appear

### Team Page
- [ ] Loading state shows initially
- [ ] Team grid displays after loading
- [ ] Team member cards show name, role, image
- [ ] Proper column layout (3 columns on desktop)

### Volunteer Page
- [ ] Hero section displays
- [ ] "Register here" button visible
- [ ] 9 volunteer guidelines display with numbers
- [ ] "Why Volunteer" section shows
- [ ] All styling matches design

### Events Page
- [ ] Loading state shows
- [ ] Date filters work
- [ ] Event cards display properly
- [ ] Event details (title, date, location) show
- [ ] Filter clears when dates removed

### Contact Page
- [ ] Contact form displays
- [ ] All input fields work
- [ ] Form submits without errors
- [ ] Success message shows after submit
- [ ] Contact info section displays

### FAQ Page
- [ ] All 8 FAQs display
- [ ] Accordion expand/collapse works
- [ ] Only one FAQ open at a time
- [ ] "Contact Us" link works

### Blog Page
- [ ] Loading state shows
- [ ] Blog posts display in grid
- [ ] Shows title, excerpt, category, date
- [ ] "Read More" links visible

### Donate Page
- [ ] 4 donation tiers display
- [ ] "Donate Now" button visible
- [ ] Impact statistics show (100+, 50+, etc)
- [ ] Monthly giving section shows

### Policy Pages
- [ ] Privacy Policy displays correctly
- [ ] Terms of Service displays correctly
- [ ] All sections readable
- [ ] Last updated date shows

---

## Performance Testing

### Lighthouse Audit
```
1. F12 → Lighthouse
2. Select "Mobile"
3. Click "Analyze page load"
4. Aim for:
   - Performance: > 70
   - Accessibility: > 90
   - Best Practices: > 90
   - SEO: > 90
```

### Page Load Speed
- Homepage: < 2 seconds
- Other pages: < 3 seconds
- First Contentful Paint: < 1.5s

---

## Deployment Testing

### Before Deploying

```bash
# 1. Build locally
npm run build

# 2. Start production build
npm start

# 3. Test at http://localhost:3000
# 4. Check all pages work
# 5. Check forms work
# 6. Check loading states (Sanity integration)

# 5. If all good, deploy:
npm run pages:deploy
```

---

## Testing Summary

✅ **Quick Test (5 min)**
- Start dev server
- Visit 3-4 pages
- Check for errors in console

✅ **Standard Test (15 min)**
- Test all pages load
- Test forms
- Test responsive design
- Check console for errors

✅ **Complete Test (30 min)**
- All above +
- Test interactive elements
- Test with Sanity (if setup)
- Performance audit
- Build and start production version

---

## Tips

💡 **Keep DevTools Open**
- F12 while navigating
- Watch for errors immediately
- Monitor network requests

💡 **Test on Real Mobile Device**
- Use phone/tablet, not just DevTools
- Touch interactions may differ
- Network conditions may affect loading

💡 **Test After Each Change**
- Test locally before deploying
- Quick smoke test on deployed site
- Check critical paths work

💡 **Clear Cache**
- Hard refresh: Ctrl+Shift+R
- Clear browser cache if styles don't update
- Restart dev server if something's weird

