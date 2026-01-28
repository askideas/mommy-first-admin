# Authentication Setup Guide

## Overview
This application now has a secure authentication system using Firebase Authentication. All pages are protected and require login access.

## Security Features
✅ **Route Protection**: All routes except `/login` require authentication
✅ **Automatic Redirects**: Unauthorized users are automatically redirected to login
✅ **Session Management**: User sessions persist across page refreshes
✅ **Secure Logout**: Clean logout with session clearing
✅ **Error Handling**: Comprehensive error messages for better UX

## How It Works

### 1. Authentication Flow
- User visits any page
- If not authenticated → redirected to `/login`
- User enters email and password
- On successful login → redirected to homepage
- User can access all protected pages
- On logout → redirected back to login

### 2. Protected Routes
All routes are wrapped in `ProtectedRoute` component:
- `/` - HomePage
- `/media` - Media Page
- `/shop` - Shop Page
- `/reviews` - Reviews Slider
- `/faqs` - FAQs Slider

### 3. Public Routes
Only the login page is accessible without authentication:
- `/login` - Login Page

## Setup Instructions

### Step 1: Configure Firebase (Already Done ✅)
The Firebase configuration is already set up in `src/config/firebase.js`

### Step 2: Create Admin User in Firebase Console

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Click on "Authentication" in the left sidebar
4. Click on "Get Started" (if not already enabled)
5. Enable "Email/Password" provider:
   - Click on "Sign-in method" tab
   - Click on "Email/Password"
   - Enable it and save
6. Create your admin user:
   - Click on "Users" tab
   - Click "Add user"
   - Enter email: your-admin@example.com
   - Enter password: YourSecurePassword123!
   - Click "Add user"

### Step 3: Test the Login

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Open your browser and go to `http://localhost:5173`

3. You should be automatically redirected to `/login`

4. Enter the credentials you created in Firebase Console

5. On successful login, you'll be redirected to the homepage

## File Structure

```
src/
├── context/
│   └── AuthContext.jsx           # Authentication context and provider
├── components/
│   ├── Header/
│   │   ├── Header.jsx           # Updated with logout button
│   │   └── Header.css           # Updated styles
│   └── ProtectedRoute/
│       └── ProtectedRoute.jsx   # Route protection component
├── pages/
│   └── Login/
│       ├── Login.jsx            # Login page component
│       └── Login.css            # Login page styles
├── config/
│   └── firebase.js              # Updated with Auth
└── App.jsx                       # Updated with AuthProvider and protected routes
```

## Components

### AuthContext (`src/context/AuthContext.jsx`)
Manages authentication state across the app:
- `currentUser`: Current authenticated user
- `login(email, password)`: Login function
- `logout()`: Logout function
- `loading`: Loading state during authentication check
- `error`: Error messages

### ProtectedRoute (`src/components/ProtectedRoute/ProtectedRoute.jsx`)
Wraps routes that require authentication:
- Checks if user is authenticated
- Redirects to `/login` if not authenticated
- Renders children if authenticated

### Login Page (`src/pages/Login/Login.jsx`)
Beautiful, modern login page with:
- Email and password fields
- Form validation
- Error handling
- Loading states
- Responsive design

## Usage in Code

### Using Auth in Components
```jsx
import { useAuth } from '../context/AuthContext';

function MyComponent() {
  const { currentUser, logout } = useAuth();
  
  return (
    <div>
      <p>Welcome, {currentUser.email}</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

### Protecting Routes
```jsx
<Route
  path="/protected"
  element={
    <ProtectedRoute>
      <YourComponent />
    </ProtectedRoute>
  }
/>
```

## Security Best Practices Implemented

1. ✅ **No credentials in code**: All config uses environment variables
2. ✅ **Client-side validation**: Email format and required fields
3. ✅ **Server-side validation**: Firebase handles authentication
4. ✅ **Session persistence**: Uses Firebase's built-in session management
5. ✅ **Automatic redirects**: Prevents unauthorized access
6. ✅ **Error handling**: User-friendly error messages
7. ✅ **Loading states**: Prevents double submissions

## Environment Variables Required

Make sure your `.env` file has:
```
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-auth-domain
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-storage-bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id
```

## Troubleshooting

### "Firebase initialization error"
- Check your `.env` file has all required variables
- Verify variables start with `VITE_`
- Restart the dev server after adding variables

### "Invalid email or password"
- Verify the user exists in Firebase Console
- Check Email/Password provider is enabled
- Ensure password meets Firebase requirements (min 6 characters)

### Redirects not working
- Clear browser cache and cookies
- Check browser console for errors
- Verify routes are wrapped in `ProtectedRoute`

### User stays logged in after closing browser
- This is expected behavior (persistent sessions)
- To change: modify Firebase auth persistence settings

## Next Steps (Optional Enhancements)

- [ ] Add password reset functionality
- [ ] Add "Remember me" checkbox
- [ ] Implement role-based access control
- [ ] Add multi-factor authentication
- [ ] Create user management page
- [ ] Add email verification requirement
- [ ] Implement refresh token rotation

## Testing Checklist

- [ ] Login with valid credentials works
- [ ] Login with invalid credentials shows error
- [ ] Accessing protected routes without login redirects to login
- [ ] Logout clears session and redirects to login
- [ ] Session persists after page refresh
- [ ] All pages are accessible after login
- [ ] Direct URL access is blocked without authentication

---

**Your application is now secure! 🔒**

Only authenticated users can access the admin dashboard.
