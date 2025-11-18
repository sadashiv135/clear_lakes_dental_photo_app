# Clear Lakes Dental Photo Gallery

A modern photo management application built with **Nuxt 3** and **Supabase**.

## Live Demo
🔗 **Hosted on Vercel:** https://clear-lakes-dental-photo-app.vercel.app/

---

## Features

- User Authentication
- Photo Upload (Multiple files)
- Photo Gallery with Modal
- Replace Photos
- Delete Photos
- Responsive Design
- Real-time Validation

---

## Getting Started

### Prerequisites
- Node.js 18+
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
   - Create a `photos` storage bucket

5. **Run the development server**
   ```bash
   npm run dev
   ```
   Open `http://localhost:3000` in your browser
