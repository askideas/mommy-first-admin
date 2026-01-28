# Quick Test Guide

## Quick Start

### 1. Enable Firebase Authentication

1. Open [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Go to **Authentication** → **Sign-in method**
4. Enable **Email/Password** provider
5. Click **Save**

### 2. Create Test Admin User

In Firebase Console:
- Go to **Authentication** → **Users**
- Click **Add user**
- Email: `admin@mommyfirst.com`
- Password: `Admin123!`
- Click **Add user**

### 3. Test Login

```bash
# Start the app
npm run dev
```

Then:
1. Open http://localhost:5173
2. You'll be redirected to `/login`
3. Enter:
   - Email: `admin@mommyfirst.com`
   - Password: `Admin123!`
4. Click **Sign In**

### 4. Test Protection

Try accessing these URLs directly:
- http://localhost:5173/shop
- http://localhost:5173/media
- http://localhost:5173/reviews

You should be redirected to login if not authenticated!

### 5. Test Logout

- Click the logout button in the header (logout icon)
- You should be redirected to login page
- Try accessing any page → redirected to login

## All Tests ✅

- [ ] Login page loads at `/login`
- [ ] Invalid credentials show error
- [ ] Valid credentials redirect to homepage
- [ ] Protected pages redirect to login when not authenticated
- [ ] All pages accessible after login
- [ ] Logout button works
- [ ] Session persists after page refresh
- [ ] Direct URL access blocked without auth

## Common Test Credentials

Create these users in Firebase for testing:

1. **Admin User**
   - Email: `admin@mommyfirst.com`
   - Password: `Admin123!`

2. **Test User**
   - Email: `test@mommyfirst.com`
   - Password: `Test123!`

## Expected Behavior

### Not Logged In
- ❌ Cannot access: `/`, `/media`, `/shop`, `/reviews`, `/faqs`
- ✅ Can access: `/login`
- All protected routes → redirect to `/login`

### Logged In
- ✅ Can access: All pages
- ❌ Cannot access: None (all accessible)
- Logout button visible in header

## Security Verification

1. **Test 1**: Direct URL Access
   ```
   Visit: http://localhost:5173/shop
   Expected: Redirect to /login (if not authenticated)
   ```

2. **Test 2**: After Login
   ```
   Visit: http://localhost:5173/login (when already logged in)
   Expected: Can access, but no automatic redirect
   ```

3. **Test 3**: Session Persistence
   ```
   1. Login successfully
   2. Refresh the page
   3. Expected: Still logged in
   ```

4. **Test 4**: Logout
   ```
   1. Click logout button
   2. Expected: Redirect to /login
   3. Try accessing /shop
   4. Expected: Redirect to /login
   ```

## Troubleshooting Quick Fixes

### Can't login?
```bash
# Check Firebase Console
# 1. Authentication is enabled
# 2. Email/Password provider is enabled
# 3. User exists in Users tab
```

### Stuck on loading?
```bash
# Check browser console for errors
# Verify .env file has all VITE_FIREBASE_* variables
# Restart dev server
```

### Routes not protected?
```bash
# Clear browser cache
# Hard refresh (Ctrl + Shift + R)
# Check App.jsx has ProtectedRoute wrapper
```

---

**All set! Your admin panel is now secure! 🎉**
