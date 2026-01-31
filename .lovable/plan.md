
# Firebase Migration Plan for NavEye

## Overview
Migrate the NavEye app from Lovable Cloud (Supabase) to Firebase, including Firestore for database and Firebase Auth for admin authentication.

---

## What Will Be Migrated

### Database Collections (Firestore)
| Current Table | Firebase Collection | Purpose |
|---------------|---------------------|---------|
| `downloads` | `downloads` | Track download statistics |
| `blog_posts` | `blogPosts` | Blog content management |
| `bug_reports` | `bugReports` | User-submitted bug reports |
| `user_roles` | `userRoles` | Admin role management |

### Authentication
- Admin login via Firebase Authentication (email/password)

---

## Implementation Steps

### Step 1: Setup Firebase Configuration
Create a new Firebase client configuration file:
- **New file**: `src/integrations/firebase/client.ts`
- Initialize Firebase app with your credentials
- Export `db` (Firestore), `auth` (Firebase Auth)

### Step 2: Create Firebase Type Definitions
- **New file**: `src/integrations/firebase/types.ts`
- Define TypeScript interfaces for all collections

### Step 3: Update Download Stats Hook
**File**: `src/hooks/useDownloadStats.ts`
- Replace Supabase queries with Firestore `getDocs()` and `addDoc()`
- Use `collection()` and `query()` from Firestore

### Step 4: Update Public Pages
**Files to update**:
- `src/pages/Blog.tsx` - Fetch published posts from Firestore
- `src/pages/BlogPost.tsx` - Fetch single post by ID
- `src/pages/ReportBug.tsx` - Submit bug reports to Firestore
- `src/pages/Download.tsx` - Already uses the hook (will work after Step 3)

### Step 5: Update Admin Pages
**Files to update**:
- `src/pages/AdminLogin.tsx` - Use Firebase Auth `signInWithEmailAndPassword`
- `src/pages/AdminBlog.tsx` - Full CRUD with Firestore
- `src/pages/AdminBugReports.tsx` - Full CRUD with Firestore

### Step 6: Add Firestore Security Rules
You'll need to configure these in Firebase Console:
- Public read for published blog posts
- Public write for bug reports and downloads
- Admin-only access for full blog/bug management

---

## Technical Details

### Required Firebase Config (you'll provide)
```
apiKey: "your-api-key"
authDomain: "your-project.firebaseapp.com"
projectId: "your-project-id"
storageBucket: "your-project.appspot.com"
messagingSenderId: "your-sender-id"
appId: "your-app-id"
```

### Dependencies to Install
```bash
npm install firebase
```

### Environment Variables for Vercel
After migration, add these to Vercel:
- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_STORAGE_BUCKET`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_APP_ID`

---

## Data Migration
Before switching, you should:
1. Export current data from Lovable Cloud (download stats, blog posts, bug reports)
2. Import into Firebase Firestore collections
3. Create an admin user in Firebase Auth

---

## Files Summary

| Action | File |
|--------|------|
| Create | `src/integrations/firebase/client.ts` |
| Create | `src/integrations/firebase/types.ts` |
| Update | `src/hooks/useDownloadStats.ts` |
| Update | `src/pages/Blog.tsx` |
| Update | `src/pages/BlogPost.tsx` |
| Update | `src/pages/ReportBug.tsx` |
| Update | `src/pages/AdminLogin.tsx` |
| Update | `src/pages/AdminBlog.tsx` |
| Update | `src/pages/AdminBugReports.tsx` |

---

## Next Steps
1. Create a Firebase project at [console.firebase.google.com](https://console.firebase.google.com)
2. Enable Firestore Database
3. Enable Authentication (Email/Password)
4. Share your Firebase config with me
5. I'll implement all the changes
