# Clear Lakes Dental Photo Gallery

A modern photo management application built with **Nuxt 3** and **Supabase**. Designed for Clear Lakes Dental to securely store, manage, and organize dental practice photos.

## Live Demo
🔗 **Hosted on Vercel:** [Add your Vercel link here]

---

## Features

✅ **User Authentication**
- Secure email/password login and registration
- Protected routes with global auth middleware
- Session management with Supabase Auth

✅ **Photo Management**
- Upload multiple photos at once
- View photos in responsive gallery with modal
- Replace existing photos
- Delete photos with confirmation
- Automatic thumbnail generation

✅ **Security**
- Server-side API routes with Supabase service role
- Row-Level Security (RLS) policies
- Protected file storage
- User session validation

✅ **User Experience**
- Responsive design (mobile, tablet, desktop)
- Photo grid with hover effects
- Full-size photo modal viewer
- Real-time success/error messages
- File validation and preview

---

## Tech Stack

| Technology | Purpose |
|-----------|---------|
| **Nuxt 3.17.5** | Vue meta-framework with file-based routing |
| **Vue 3.5.16** | Progressive JavaScript framework |
| **TypeScript** | Type-safe development |
| **Supabase** | Backend-as-a-Service (Auth + Storage) |
| **Tailwind CSS** | Utility-first CSS framework |
| **Vite 6.4.1** | Build tool and dev server |
| **Nitro** | Server engine for API routes |

---

## Project Structure

```
├── app.vue                    # Root app component
├── nuxt.config.ts            # Nuxt configuration
├── tsconfig.json             # TypeScript configuration
├── tailwind.config.js        # Tailwind CSS configuration
├── postcss.config.js         # PostCSS configuration
│
├── pages/                    # File-based routing
│   ├── index.vue            # Home page with feature cards
│   ├── login.vue            # Login/registration page
│   ├── gallery.vue          # Photo gallery with modal
│   └── upload.vue           # Photo upload page (multiple files)
│
├── components/
│   └── header.vue           # Logo header component
│
├── middleware/
│   └── auth.global.ts       # Global auth middleware for protected routes
│
├── server/
│   └── api/
│       └── photos/
│           ├── list.get.ts          # List all photos
│           ├── upload.post.ts       # Upload new photos
│           ├── update.post.ts       # Replace existing photos
│           └── delete.post.ts       # Delete photos
│
├── assets/
│   └── css/
│       └── tailwind.css     # Tailwind directives and custom CSS
│
└── public/
    └── robots.txt           # SEO robots file
```

---

## Getting Started

### Prerequisites
- Node.js 18+ (tested with 22.10.0)
- npm or yarn
- Supabase account

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/sadashiv135/clear_lakes_dental_photo_app.git
   cd clear_lakes_dental_photo_app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   - Create a `.env` file in the root directory
   - Add your Supabase credentials:
   ```env
   NUXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NUXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   ```

4. **Set up Supabase**
   - Create a new project on [Supabase](https://supabase.com)
   - Enable email/password authentication
   - Create a `photos` storage bucket (public)
   - Apply RLS policies (see Supabase setup guide in PROJECT_DOCUMENTATION.md)

5. **Run the development server**
   ```bash
   npm run dev
   ```
   Open `http://localhost:3000` in your browser

---

## Key Features Explained

### 📸 Photo Upload (Single & Multiple)
- Users can select one or multiple image files at once
- Real-time preview of selected images
- Drag-and-drop support (ready to implement)
- Validation: Image format and file size checks
- **Route:** `/upload`

### 🖼️ Photo Gallery
- Responsive grid layout (4-5 photos per row)
- Click any photo to view full-size in modal
- Modal features: Close button, ESC key support, click outside to close
- **Route:** `/gallery`

### 🔐 Authentication
- Login and registration on `/login`
- Protected routes redirect to login if not authenticated
- Logout button on home page
- Session management via Supabase Auth

### 🏠 Home Page
- Welcome section with greeting
- Three feature cards: Gallery, Upload, Logout
- Quick navigation to main features
- **Route:** `/` (index)

---

## API Routes

All API routes are server-side for security:

### `GET /api/photos/list`
Returns all photos for the authenticated user
```json
[
  { "name": "photo1.jpg", "url": "https://..." },
  { "name": "photo2.jpg", "url": "https://..." }
]
```

### `POST /api/photos/upload`
Upload a new photo
- **Body:** FormData with `file` field
- **Returns:** Uploaded file details

### `POST /api/photos/update`
Replace an existing photo (same filename)
- **Body:** FormData with `oldName` and `file` fields
- **Returns:** Updated file details

### `POST /api/photos/delete`
Delete a photo
- **Body:** `{ "name": "filename.jpg" }`
- **Returns:** Success/error response

---

## How It Works

### File-Based Routing
Files in `pages/` directory automatically map to routes:
- `pages/index.vue` → `/` (home)
- `pages/login.vue` → `/login`
- `pages/gallery.vue` → `/gallery`
- `pages/upload.vue` → `/upload`

### Authentication Flow
1. User visits `/login` (not authenticated)
2. User enters email/password and submits
3. Supabase validates credentials
4. On success: User is logged in, redirected to `/`
5. On failure: Error message displayed
6. Global middleware (`auth.global.ts`) protects routes

### Photo Upload Flow
1. User navigates to `/upload`
2. Selects one or multiple images
3. Clicks "Upload (N)" button
4. Each file is uploaded to `/api/photos/upload`
5. Server validates and stores in Supabase storage
6. After all uploads complete → redirect to `/gallery`

### Photo Viewing Flow
1. Gallery page loads photos via `/api/photos/list`
2. Displays responsive grid of photo thumbnails
3. Click any photo → opens full-size modal
4. Modal shows full image with close button
5. Can delete or replace from gallery view

---

## Deployment

### Deploy to Vercel

1. **Push code to GitHub**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Connect to Vercel**
   - Go to [Vercel](https://vercel.com)
   - Click "Add New Project"
   - Import GitHub repository
   - Select this project

3. **Add environment variables**
   - In Vercel dashboard, go to Settings → Environment Variables
   - Add all variables from your `.env` file:
     - `NUXT_PUBLIC_SUPABASE_URL`
     - `NUXT_PUBLIC_SUPABASE_ANON_KEY`
     - `SUPABASE_SERVICE_ROLE_KEY`

4. **Deploy**
   - Vercel automatically deploys on push to main
   - Your live link will appear in dashboard

---

## Development Commands

```bash
# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint and fix code
npm run lint
```

---

## Security Notes

- ✅ Service-role keys only used server-side (in `/server/api/`)
- ✅ Anon keys used client-side only
- ✅ Row-Level Security (RLS) policies on Supabase storage
- ✅ File validation on both client and server
- ✅ Auth middleware protects sensitive routes
- ✅ No secrets in version control (use `.env`)

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Photos not loading | Check Supabase URL and anon key in `.env` |
| Upload fails | Verify file is image format and under 5MB |
| Auth errors | Clear browser cache and check Supabase auth settings |
| CSS not applying | Run `npm run dev` and hard refresh browser (Cmd+Shift+R) |

---

## Future Enhancements

- Drag-and-drop file upload
- Photo tagging and categorization
- Search functionality
- Bulk delete
- Photo cropping/editing
- Export/download options

---

## Contributing

This is a personal project for internship assessment. Contributions welcome for improvements!

---

## License

MIT License - Feel free to use this project for learning.

---

## Contact

**Developer:** Sadashiv Mhaskar  
**Repository:** [GitHub](https://github.com/sadashiv135/clear_lakes_dental_photo_app)  
**Live Demo:** [Vercel Deployment - Add link here]

---

*Last Updated: November 2025*
