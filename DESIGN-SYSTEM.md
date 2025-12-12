# Swiss Style Design System Guide

## Overview
This admin panel follows Swiss (International Typographic Style) design principles, emphasizing clarity, readability, and objectivity through the use of sans-serif typography, grid-based layouts, and minimalist aesthetics.

## Core Principles

### 1. Typography
- **System Fonts**: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', Arial, sans-serif
- **Font Weights**: Regular (400), Semi-bold (600), Bold (700)
- **Letter Spacing**: Negative for headlines (-0.5px to -1px), positive for labels (+0.5px)
- **Text Transform**: UPPERCASE for labels and tags

### 2. Grid System
- **Base Unit**: 8px spacing system
- **Spacing Scale**: 4px, 8px, 16px, 24px, 32px
- **Grid Layouts**: CSS Grid with responsive columns
- **Alignment**: Left-aligned text, centered elements for symmetry

### 3. Color System

#### Primary Colors
```css
--primary: #DC5F92         /* Main brand color */
--primary-light: #FD8CBB   /* Light variant */
--primary-gradient: linear-gradient(218.44deg, #FD8CBB 4.36%, #DC5F92 86.2%)
```

#### Neutral Colors
```css
--text-primary: #1a1a1a    /* Main text */
--text-secondary: #666     /* Secondary text */
--text-tertiary: #999      /* Tertiary text */
--border: #e0e0e0          /* Borders and dividers */
--background: #fafafa      /* Page background */
--white: #ffffff           /* Cards and surfaces */
```

### 4. Visual Hierarchy

#### Headings
- **H1**: 36px, weight 700, letter-spacing -1px
- **H2**: 28px, weight 700, letter-spacing -0.5px
- **H3**: 18-24px, weight 700, letter-spacing -0.3px
- **Labels**: 11-13px, weight 600, letter-spacing +0.5px, UPPERCASE

#### Spacing
- **Component Padding**: 16px, 20px, 24px
- **Section Gaps**: 24px, 32px
- **Element Gaps**: 8px, 12px, 16px

### 5. Components

#### Buttons
```css
/* Primary Button */
.btn-primary {
  background: linear-gradient(218.44deg, #FD8CBB 4.36%, #DC5F92 86.2%);
  color: white;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 600;
}

/* Secondary Button */
.btn-secondary {
  background: white;
  border: 1px solid #e0e0e0;
  color: #1a1a1a;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 600;
}
```

#### Cards
```css
.card {
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  padding: 24px;
  transition: all 0.2s;
}

.card:hover {
  border-color: #DC5F92;
  box-shadow: 0 8px 24px rgba(220, 95, 146, 0.15);
  transform: translateY(-4px);
}
```

#### Forms
```css
.form-input {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 12px 16px;
  font-size: 15px;
}

.form-input:focus {
  border-color: #DC5F92;
  box-shadow: 0 0 0 3px rgba(220, 95, 146, 0.1);
}
```

### 6. Interaction Design

#### Hover States
- **Transform**: translateY(-2px to -4px)
- **Shadow**: Increase shadow intensity
- **Color**: Shift to primary color or gradient
- **Transition**: 0.2s ease for smooth animations

#### Active States
- **Background**: Primary color with 5-10% opacity
- **Border**: Primary color
- **Font Weight**: Increase to 600 or 700

#### Focus States
- **Outline**: None (use box-shadow instead)
- **Box Shadow**: 0 0 0 3px rgba(220, 95, 146, 0.1)
- **Border**: Primary color

### 7. Layout Patterns

#### Sidebar Navigation
- Fixed position, 280px width
- White background with 1px border
- Menu items with left accent bar when active
- Collapsible on mobile

#### Content Area
- Left margin: 280px (sidebar width)
- Top margin: 70px (header height)
- Padding: 32px
- Max-width: 1400px for content

#### Header
- Fixed position, 70px height
- White background with bottom border
- Search bar and user actions aligned

### 8. Responsive Design

#### Breakpoints
- **Desktop**: > 768px
- **Tablet/Mobile**: ≤ 768px

#### Mobile Adaptations
- Sidebar becomes overlay (full width, max 280px)
- Header search bar reduces width
- Grid columns collapse to single column
- Reduced padding (20px instead of 32px)

### 9. Best Practices

#### Do's ✓
- Use system fonts for better performance
- Maintain consistent spacing (8px grid)
- Keep borders thin (1px)
- Use subtle shadows with primary color tint
- Apply negative letter spacing to large text
- Use uppercase for labels and tags
- Keep contrast high for readability

#### Don'ts ✗
- Don't use multiple font families
- Don't use decorative elements
- Don't use heavy shadows or effects
- Don't mix border styles
- Don't use bright, saturated colors
- Don't use skeuomorphic designs
- Don't ignore the 8px spacing grid

### 10. Accessibility

#### Color Contrast
- Text on white: Use #1a1a1a (AAA compliant)
- Secondary text: Use #666 (AA compliant)
- Primary color: Use for accents only

#### Focus Indicators
- Always provide visible focus states
- Use box-shadow instead of outline
- Minimum 3px width for focus ring

#### Interactive Elements
- Minimum touch target: 44x44px
- Clear hover and active states
- Descriptive button text

## Implementation Examples

### Page Header
```jsx
<div className="page-header">
  <div>
    <h1 className="page-title">Dashboard</h1>
    <p className="page-subtitle">Manage your e-commerce homepage</p>
  </div>
  <button className="btn-primary">
    <Plus size={20} />
    Add Item
  </button>
</div>
```

### Stat Card
```jsx
<div className="stat-card">
  <div className="stat-icon">
    <ShoppingBag size={24} />
  </div>
  <div className="stat-content">
    <p className="stat-label">Total Products</p>
    <h3 className="stat-value">156</h3>
    <span className="stat-change up">+12%</span>
  </div>
</div>
```

### Form Group
```jsx
<div className="form-group">
  <label className="form-label">Product Name</label>
  <input type="text" className="form-input" placeholder="Enter name" />
</div>
```

## Resources

- **Fonts**: System UI fonts (no external fonts needed)
- **Icons**: Lucide React (lucide.dev)
- **Grid**: CSS Grid and Flexbox
- **Colors**: CSS Custom Properties

## Maintenance

When adding new components:
1. Follow the 8px spacing grid
2. Use existing CSS variables
3. Apply consistent border-radius values
4. Maintain typographic hierarchy
5. Test hover and focus states
6. Ensure mobile responsiveness
7. Keep accessibility in mind
