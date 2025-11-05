# Better Mix - Pages Architecture Documentation

## Overview

The Better Mix application uses **Next.js App Router** with route groups to separate public marketing pages from authenticated application pages. This architecture provides clean separation between public-facing content and internal app functionality.

## Route Groups Architecture

### 1. Public Route Group: `(public)`
**Location**: `/src/app/(public)/`
**Purpose**: Marketing and landing pages accessible to all visitors
**Layout**: Clean top navigation without sidebar or app chrome

**Files**:
- `/src/app/(public)/layout.tsx` - Public layout with top navigation
- `/src/app/(public)/page.tsx` - Landing page at root URL (`/`)

### 2. App Route Group: `(app)`
**Location**: `/src/app/(app)/`
**Purpose**: Authenticated application pages with full app shell
**Layout**: Navigation rail sidebar + header with settings

**Files**:
- `/src/app/(app)/layout.tsx` - App shell layout with sidebar navigation
- `/src/app/(app)/upload/page.tsx` - Upload functionality
- `/src/app/(app)/results/page.tsx` - Processing results
- `/src/app/(app)/history/page.tsx` - Processing history
- `/src/app/(app)/admin/page.tsx` - Admin dashboard

## Page Details

### 🏠 Landing Page (`/`)
**File**: `/src/app/(public)/page.tsx`
**Route**: `/`
**Layout**: Public layout (clean top nav)

**Sections Built**:
1. **Hero Section**
   - Large "Better Mix" title
   - Subtitle: "Polish your sound with calm, clear tools..."
   - Primary CTA: "Start Free Preview" → `/upload`
   - Secondary CTA: "Hear a Demo" → scrolls to signature demo
   - Gradient background: `#0b0d10` to `#141821` with pastel overlay

2. **Signature Demo**
   - Before/after audio comparison using `ABPlayer` component
   - Toggle switch to compare audio samples
   - Caption: "Best on headphones"
   - Placeholder audio URLs (ready to replace)

3. **Three Capability Panels**
   - Mix Analysis (spectral bars icon)
   - Stem Enhancement (split waveform icon)  
   - Mastering (curve/limiter icon)
   - Grid layout with custom SVG icons

4. **Genre Demo Tabs**
   - Tabbed interface: Acoustic, Electronic, Voice
   - Each tab has before/after audio comparison
   - Uses same `ABPlayer` component
   - Placeholder URLs for each genre

5. **How It Works (3-Step Process)**
   - Step 1: Upload (WAV, FLAC, MP3)
   - Step 2: Choose service (Mastering, Enhance, Analysis)
   - Step 3: Review (Download or view JSON)
   - "You stay in control. Files are yours."

6. **Call to Action**
   - "Ready when you are" section
   - Buttons: "Start Free Preview", "View History"
   - "No account required for previews"

7. **Footer**
   - Brand name and legal links (Privacy, Terms, Contact)

### 🎵 Upload Page (`/upload`)
**File**: `/src/app/(app)/upload/page.tsx`
**Route**: `/upload`
**Layout**: App layout (sidebar + header)

**Components**:
- File upload zone with drag & drop
- Service selection (Mastering, Enhancement, Analysis)
- Upload wizard with step progression
- File validation and preview

### 📊 Results Page (`/results`)
**File**: `/src/app/(app)/results/page.tsx`
**Route**: `/results`
**Layout**: App layout (sidebar + header)

**Components**:
- Audio playback controls
- Before/after waveform comparison
- Download options
- Analysis results display
- Processing summary

### 📁 History Page (`/history`)
**File**: `/src/app/(app)/history/page.tsx`
**Route**: `/history`
**Layout**: App layout (sidebar + header)

**Components**:
- Processing history table
- Bulk actions
- Pagination controls
- History filters
- Analysis modal

### ⚙️ Admin Page (`/admin`)
**File**: `/src/app/(app)/admin/page.tsx`
**Route**: `/admin`
**Layout**: App layout (sidebar + header)

**Components**:
- User management
- Job monitoring
- Pricing configuration
- Feature toggles
- System analytics

## Navigation Structure

### Public Layout Navigation
**File**: `/src/app/(public)/layout.tsx`

**Navigation Items**:
- Home (`/`) - Active with underline when on landing page
- Upload (`/upload`) - Routes to app upload page
- Results (`/results`) - Routes to app results page
- History (`/history`) - Routes to app history page
- Admin (`/admin`) - Routes to app admin page

**Features**:
- Active link highlighting with underline
- Mobile responsive hamburger menu
- "Better Mix" brand logo linking to home

### App Layout Navigation
**File**: `/src/app/(app)/layout.tsx`

**Navigation Rail** (Thin vertical sidebar):
- Home icon → `/`
- Upload icon → `/upload`
- Results icon → `/results`
- History icon → `/history`
- Admin icon → `/admin`

**Header Features**:
- Mode indicator pill (Dev/Prod/Mock)
- Settings drawer with API configuration
- Mobile sidebar toggle
- "Better Mix" title

## Shared Components

### ABPlayer Component
**File**: `/src/components/ABPlayer.tsx`
**Purpose**: Before/after audio comparison with toggle
**Props**:
- `beforeUrl`: Audio file URL for "before" state
- `afterUrl`: Audio file URL for "after" state
- `label`: Optional display label
- `startAfter`: Optional prop to default to "after"

**Usage**:
- Signature demo section
- Genre demo tabs
- Results page comparisons

## Navigation Issue Analysis

The navigation issue you experienced likely stems from:

1. **Route Group Separation**: The landing page (`/`) is in the `(public)` group while other pages are in the `(app)` group
2. **Different Layouts**: Public and app pages use completely different layout systems
3. **Link Configuration**: Navigation links properly configured with Next.js `Link` components

## URL Routing Map

```
/ → (public)/page.tsx → Public Layout (Clean top nav)
/upload → (app)/upload/page.tsx → App Layout (Sidebar + header)
/results → (app)/results/page.tsx → App Layout (Sidebar + header)  
/history → (app)/history/page.tsx → App Layout (Sidebar + header)
/admin → (app)/admin/page.tsx → App Layout (Sidebar + header)
```

## Styling System

**Theme**: Dark studio theme with cyan primary accents
**Framework**: Tailwind CSS with custom design tokens
**Colors**: 
- Background: Dark gradients (`#0b0d10`, `#141821`)
- Primary: Cyan for CTAs and active states
- Cards: `studio-card` class with subtle borders
- Typography: Inter font with generous line heights

## Key Features

1. **Responsive Design**: Mobile-first with collapsible navigation
2. **Audio Integration**: Custom audio players with comparison functionality
3. **Progressive Enhancement**: Works without JavaScript for basic navigation
4. **Accessibility**: Proper ARIA labels and keyboard navigation
5. **Performance**: Next.js optimizations with route-based code splitting

## Troubleshooting Navigation

If navigation isn't working:
1. Check browser console for JavaScript errors
2. Verify you're accessing the correct URLs directly
3. Clear browser cache and localStorage
4. Ensure JavaScript is enabled
5. Try accessing `/` directly in the address bar

The landing page at `/` should load immediately with the full Better Mix marketing experience, while `/upload` and other routes will show the app interface with sidebar navigation.