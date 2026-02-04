# About Page - Configuration Guide

## Overview
The About Page allows you to manage all content sections of your website's About page. Each section can be independently configured and saved to Firebase Firestore.

## Page Structure

### Collection: `aboutpage`
Each section is stored as a separate document in the `aboutpage` collection:

1. **herosection** - Hero section content
2. **headingprep** - Heading prep statistics section
3. **testimonials** - Team testimonials
4. **infrastructure** - 4th trimester infrastructure features
5. **mission** - Mission statement and values

## Sections

### 1. Hero Section (`herosection`)
**Features:**
- Top text label
- Main heading
- Sub heading
- Description text
- Background image (via ImageKit)
- Enable/Disable toggle

**Data Structure:**
```javascript
{
  isEnabled: boolean,
  heroData: {
    topText: string,
    mainHeading: string,
    subHeading: string,
    description: string,
    backgroundImage: string | null
  },
  updatedAt: ISO timestamp
}
```

### 2. Heading Prep Section (`headingprep`)
**Features:**
- Main text
- Statistic label, value, and suffix
- Three description lines
- Enable/Disable toggle

**Data Structure:**
```javascript
{
  isEnabled: boolean,
  headingPrepData: {
    mainText: string,
    statisticLabel: string,
    statisticValue: string,
    statisticSuffix: string,
    descriptionLine1: string,
    descriptionLine2: string,
    descriptionLine3: string
  },
  updatedAt: ISO timestamp
}
```

### 3. Testimonials Section (`testimonials`)
**Features:**
- Multiple testimonial cards
- Author image (via ImageKit)
- Author name and credentials
- Testimonial content
- Add/Remove testimonials dynamically
- Enable/Disable toggle

**Data Structure:**
```javascript
{
  isEnabled: boolean,
  testimonials: [
    {
      id: number,
      authorImage: string | null,
      authorName: string,
      authorCredentials: string,
      content: string
    }
  ],
  updatedAt: ISO timestamp
}
```

### 4. Infrastructure Section (`infrastructure`)
**Features:**
- Section heading and description
- Main image (via ImageKit)
- Multiple feature items with icons
- Add/Remove features dynamically
- Enable/Disable toggle

**Data Structure:**
```javascript
{
  isEnabled: boolean,
  infrastructureData: {
    heading: string,
    description: string,
    mainImage: string | null,
    features: [
      {
        id: number,
        icon: string,
        title: string,
        description: string
      }
    ]
  },
  updatedAt: ISO timestamp
}
```

### 5. Mission Section (`mission`)
**Features:**
- Heading and subheading
- Tagline
- Two description lines
- Accent color picker
- Enable/Disable toggle

**Data Structure:**
```javascript
{
  isEnabled: boolean,
  missionData: {
    heading: string,
    subheading: string,
    tagline: string,
    descriptionLine1: string,
    descriptionLine2: string,
    color: string
  },
  updatedAt: ISO timestamp
}
```

## Usage

### Accessing the Page
1. Navigate to the admin panel
2. Click on "About Page" in the sidebar
3. Select a section from the navigation menu

### Editing Content
1. Click on a section to expand it
2. Fill in or modify the content fields
3. Upload images using the ImageKit browser (where applicable)
4. Click "Save [Section Name]" to save changes
5. A success message will appear when saved

### Managing Dynamic Items
**For Testimonials and Features:**
- Click "Add Testimonial" or "Add Feature" to create new items
- Fill in the details for each item
- Click the trash icon to remove unwanted items
- Save the entire section to persist changes

### Enable/Disable Sections
- Use the toggle switch at the top of each section
- Disabled sections won't be displayed on the live website
- Remember to save after toggling

## Image Management

All images are managed through ImageKit:
1. Click "Select Image" or "Change Image" button
2. Browse your ImageKit library
3. Select an image
4. The image URL is automatically saved
5. Click "Remove Image" to clear the image

## Best Practices

1. **Save Frequently**: Each section has its own save button - save after making changes
2. **Preview Changes**: Check the live website after saving to verify changes
3. **Image Optimization**: Use appropriately sized images from ImageKit
4. **Content Consistency**: Maintain consistent tone and style across sections
5. **Backup**: Firebase automatically versions your data, but keep backups of important content

## Technical Details

### Firebase Integration
- Uses Firestore `setDoc()` with `{ merge: true }` to update documents
- Automatic timestamp tracking with `updatedAt` field
- Real-time data loading on component mount

### Design System
- Follows Swiss Style design principles
- Uses primary color: `#DC5F92`
- Consistent spacing: 8px base unit
- Responsive layout for all screen sizes

### Component Architecture
```
AboutPage/
├── AboutPage.jsx           # Main container
├── AboutPage.css          # Layout styles
└── components/
    ├── HeroSection.jsx
    ├── HeroSection.css    # Shared base styles
    ├── HeadingPrepSection.jsx
    ├── TestimonialsSection.jsx
    ├── InfrastructureSection.jsx
    └── MissionSection.jsx
```

## Troubleshooting

### Changes Not Saving
- Check Firebase console for connection
- Verify `.env` file has correct Firebase credentials
- Check browser console for errors

### Images Not Displaying
- Verify ImageKit configuration in `.env`
- Check image URL is valid
- Ensure ImageKit account is active

### Section Not Appearing
- Check if section is enabled (toggle at top)
- Verify data was saved successfully
- Check for JavaScript errors in console

## Future Enhancements
- Drag-and-drop reordering of testimonials and features
- Preview mode before publishing
- Version history and rollback
- Bulk import/export functionality
