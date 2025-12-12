# Project Structure Overview

## Directory Hierarchy

```
mommy-first-admin/
│
├── public/                          # Static assets
│
├── src/
│   ├── components/                  # Reusable UI components
│   │   ├── Layout/                  # Main layout wrapper
│   │   │   ├── Layout.jsx          # Layout component with Outlet
│   │   │   └── Layout.css          # Layout styles
│   │   │
│   │   ├── Sidebar/                # Navigation sidebar
│   │   │   ├── Sidebar.jsx         # Sidebar with menu items
│   │   │   └── Sidebar.css         # Swiss-style sidebar
│   │   │
│   │   └── Header/                 # Top header bar
│   │       ├── Header.jsx          # Search and user actions
│   │       └── Header.css          # Header styling
│   │
│   ├── pages/                      # Page components (routes)
│   │   ├── Dashboard/              # Main dashboard
│   │   │   ├── Dashboard.jsx      # Stats and recent activity
│   │   │   └── Dashboard.css      # Dashboard styles
│   │   │
│   │   ├── HeroSection/            # Hero banner management
│   │   │   ├── HeroSection.jsx    # CRUD for hero banners
│   │   │   └── HeroSection.css    # Hero section styles
│   │   │
│   │   ├── Products/               # Product management
│   │   │   ├── Products.jsx       # Product listing and CRUD
│   │   │   └── Products.css       # Product card styles
│   │   │
│   │   ├── Categories/             # Category management
│   │   │   ├── Categories.jsx     # Category organization
│   │   │   └── Categories.css     # Category styles
│   │   │
│   │   ├── Banners/                # Banner management
│   │   │   ├── Banners.jsx        # Promotional banners
│   │   │   └── Banners.css        # Banner styles
│   │   │
│   │   └── Settings/               # Settings page
│   │       ├── Settings.jsx       # Store configuration
│   │       └── Settings.css       # Settings styles
│   │
│   ├── App.jsx                     # Main App with routing
│   ├── App.css                     # App-level styles
│   ├── index.css                   # Global styles & design system
│   └── main.jsx                    # React entry point
│
├── index.html                      # HTML template
├── package.json                    # Dependencies
├── vite.config.js                  # Vite configuration
├── eslint.config.js                # ESLint rules
├── README.md                       # Project documentation
└── DESIGN-SYSTEM.md               # Design system guide
```

## File Naming Convention

### Components and Pages
- **Folder**: PascalCase (e.g., `Dashboard/`, `HeroSection/`)
- **JSX Files**: PascalCase matching folder (e.g., `Dashboard.jsx`)
- **CSS Files**: PascalCase matching component (e.g., `Dashboard.css`)

### Example Structure
```
PageName/
├── PageName.jsx    # Component logic
└── PageName.css    # Component styles
```

## Component Types

### Layout Components (`/components`)
Reusable structural components used across multiple pages:
- **Layout**: Main wrapper with sidebar and header
- **Sidebar**: Navigation menu
- **Header**: Top bar with search and actions

### Page Components (`/pages`)
Route-specific components for each admin section:
- **Dashboard**: Overview and statistics
- **HeroSection**: Hero banner management
- **Products**: Product management
- **Categories**: Category organization
- **Banners**: Promotional banner management
- **Settings**: Configuration options

## Routing Structure

```jsx
<Router>
  <Routes>
    <Route path="/" element={<Layout />}>
      <Route index element={<Dashboard />} />
      <Route path="hero" element={<HeroSection />} />
      <Route path="products" element={<Products />} />
      <Route path="categories" element={<Categories />} />
      <Route path="banners" element={<Banners />} />
      <Route path="settings" element={<Settings />} />
    </Route>
  </Routes>
</Router>
```

## Style Architecture

### Global Styles (`index.css`)
- CSS custom properties (variables)
- Design system tokens
- Reusable component classes
- Utility classes
- Global reset

### Component Styles (`.css` files)
- Component-specific styles
- Follow Swiss design principles
- Use CSS custom properties
- BEM-like naming convention

## Adding New Features

### 1. Add New Page
```bash
# Create folder and files
src/pages/NewPage/
├── NewPage.jsx
└── NewPage.css
```

### 2. Create Component
```jsx
// NewPage.jsx
import './NewPage.css';

const NewPage = () => {
  return (
    <div className="new-page">
      <h1 className="page-title">New Page</h1>
      {/* Content */}
    </div>
  );
};

export default NewPage;
```

### 3. Add Route
```jsx
// App.jsx
import NewPage from './pages/NewPage/NewPage';

// Add in routes
<Route path="new-page" element={<NewPage />} />
```

### 4. Add Menu Item
```jsx
// Sidebar.jsx
const menuItems = [
  // ...existing items
  { icon: IconName, label: 'New Page', path: '/new-page' }
];
```

## Best Practices

### File Organization
✓ One component per folder
✓ Co-locate styles with components
✓ Keep related files together
✓ Use descriptive folder names

### Component Structure
✓ Import statements first
✓ Component logic
✓ Return JSX
✓ Export at bottom

### Styling
✓ Use CSS custom properties
✓ Follow design system
✓ Keep specificity low
✓ Avoid inline styles

### State Management
✓ Use useState for local state
✓ Keep state close to usage
✓ Consider lifting state up when needed
✓ Future: Add Redux/Context if needed

## Dependencies

### Core
- **react**: ^19.2.0
- **react-dom**: ^19.2.0
- **react-router-dom**: ^6.x

### UI
- **bootstrap**: ^5.x
- **lucide-react**: ^0.x

### Build Tools
- **vite**: ^7.2.4
- **@vitejs/plugin-react**: ^5.1.1

### Development
- **eslint**: ^9.39.1
- **eslint plugins**: react-hooks, react-refresh

## Quick Commands

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

## Development Workflow

1. **Start dev server**: `npm run dev`
2. **Edit files**: Make changes in `src/`
3. **See changes**: Hot reload in browser
4. **Add features**: Follow structure above
5. **Test**: Verify in browser
6. **Build**: `npm run build` when ready

## Notes

- All pages use the same Layout component
- Sidebar and Header are always visible
- Swiss design system is enforced globally
- Responsive breakpoint: 768px
- Primary color: #DC5F92
- Icons from lucide-react

## Future Considerations

- Add API integration layer
- Implement state management (Redux/Zustand)
- Add TypeScript for type safety
- Create custom hooks for common logic
- Add test suite (Jest/Vitest)
- Implement data fetching library (React Query)
