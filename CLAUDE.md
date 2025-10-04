# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A Next.js 14 social media application called "NextPosts" that allows users to create, view, and like posts with images. Uses Server Actions for mutations, SQLite for data persistence, and Cloudinary for image storage.

## Key Commands

### Development
```bash
npm run dev      # Start development server on http://localhost:3000
npm run build    # Create production build
npm start        # Start production server
npm run lint     # Run Next.js linting
```

## Architecture

### Data Flow Pattern
- **Server Components** (`app/page.js`, `app/feed/page.js`) fetch data using `lib/posts.js` functions
- **Server Actions** (`actions/posts.js`) handle mutations (create posts, toggle likes)
- **Client Components** (`components/posts.js`, `components/post-form.js`) use `'use client'` directive for interactivity
- Mutations trigger `revalidatePath()` to update cached data

### Database Schema (SQLite via better-sqlite3)
- `users` table: Stores user information (id, first_name, last_name, email)
- `posts` table: Stores posts with foreign key to users (id, image_url, title, content, created_at, user_id)
- `likes` table: Junction table for many-to-many relationship (user_id, post_id)
- Database file: `posts.db` at project root
- Auto-initializes with dummy users (IDs 1 and 2) on first run

### Image Handling
- Upload flow: Client uploads file → Server Action calls `uploadImage()` → Cloudinary stores image → Returns secure_url
- Requires environment variables in `.env.local`:
  - `CLOUDINARY_CLOUD_NAME`
  - `CLOUDINARY_API_KEY`
  - `CLOUDINARY_API_SECRET`
- Images stored in Cloudinary folder: `nextjs-course-mutations`

### File Structure
```
app/
  ├── page.js              # Home page (shows 2 latest posts)
  ├── feed/page.js         # Feed page (shows all posts)
  ├── new-post/page.js     # Create post page
  ├── layout.js            # Root layout with Header
  └── globals.css          # Global styles
components/
  ├── posts.js             # Client component with useOptimistic for like updates
  ├── post-form.js         # Client component with useFormState for validation
  ├── form-submit.js       # Form submit button
  ├── like-icon.js         # Like button component
  └── header.js            # Navigation header
lib/
  ├── posts.js             # Database operations (getPosts, storePost, updatePostLikeStatus)
  ├── cloudinary.js        # Image upload to Cloudinary
  └── format.js            # Date formatting utilities
actions/
  └── posts.js             # Server Actions (createPost, likePost)
```

### Path Aliases
- `@/*` maps to project root (configured in `jsconfig.json`)
- Example: `import { getPosts } from '@/lib/posts'`

### Hardcoded User IDs
- New posts are created with `userId: 1`
- Like actions are performed by `userId: 2`
- Query in `getPosts()` checks if user 2 has liked each post

### Optimistic Updates
- `components/posts.js` uses `useOptimistic` hook to immediately reflect like toggles in UI before server confirmation
- Note: There's a typo on line 46 where `updatePost` should be `updatedPost`
