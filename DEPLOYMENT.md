# Deployment Guide - FNP Florist & Bakery (Sector 76, Noida)

This document provides production deployment instructions for **FNP - Florist & Bakery in Noida Sector 76**.

---

## 1. Environment Configuration

Before deploying, create your `.env` (or configure Environment Variables in your hosting provider dashboard):

```env
# Firebase Configuration (From your Firebase Console Project Settings)
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id

# Admin Access Credentials
VITE_ADMIN_EMAIL=admin@fnpnoida76.com

# Development-only local admin password (used when Firebase is not configured)
VITE_LOCAL_ADMIN_PASSWORD=admin123

# Store Contact Defaults
VITE_DEFAULT_STORE_PHONE="+91 9999517599"
VITE_DEFAULT_WHATSAPP_NUMBER="919999517599"
```

> **Development note**: When Firebase is not configured, Vite development mode uses browser-local storage for catalogue data and a local admin account. The default local credentials are `admin@fnpnoida76.com` / `admin123`; set `VITE_LOCAL_ADMIN_PASSWORD` to change the password. This local mode is disabled in production builds.

---

## 2. Deploying to Firebase Hosting

Firebase Hosting provides fast global CDN delivery, automated SSL certificates, and direct integration with Firestore security rules:

1. **Install Firebase CLI**:
   ```bash
   npm install -g firebase-tools
   ```

2. **Login to Firebase**:
   ```bash
   firebase login
   ```

3. **Initialize Firebase in Project Directory**:
   ```bash
   firebase init
   ```
   - Select **Firestore**, **Hosting**, and **Storage**.
   - Public directory: `dist`
   - Configure as single-page app (SPA): `Yes` (rewrite all URLs to `/index.html`)
   - Set up automatic builds and deploys with GitHub: (Optional)

4. **Deploy Firestore Rules**:
   ```bash
   firebase deploy --only firestore:rules
   ```

5. **Build and Deploy the App**:
   ```bash
   npm run build
   firebase deploy --only hosting
   ```

---

## 3. Deploying to Vercel

1. Push your code to your GitHub / GitLab repository.
2. Sign in to [Vercel](https://vercel.com) and click **Add New Project**.
3. Import the repository.
4. Set the Build and Output settings:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. In **Environment Variables**, add the keys from `.env.example`.
6. Click **Deploy**.
7. Single-Page Application rewrites are handled automatically by `vercel.json`:
   ```json
   {
     "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
   }
   ```

---

## 4. Deploying to Hostinger (cPanel / Business Web Hosting)

1. Run the production build command locally or in CI:
   ```bash
   npm run build
   ```
2. Navigate to your Hostinger **hPanel** -> **File Manager**.
3. Open the `public_html` directory of your domain.
4. Upload all files from your local `dist/` directory into `public_html`.
5. Create or verify the `.htaccess` file in `public_html` to handle client-side routing (React Router):
   ```apache
   <IfModule mod_rewrite.c>
     RewriteEngine On
     RewriteBase /
     RewriteRule ^index\.html$ - [L]
     RewriteCond %{REQUEST_FILENAME} !-f
     RewriteCond %{REQUEST_FILENAME} !-d
     RewriteRule . /index.html [L]
   </IfModule>
   ```
6. Ensure HTTPS is forced via Hostinger's Free SSL certificate section.

---

## 5. Connecting a Custom Domain

1. In your domain registrar (e.g. GoDaddy, Namecheap, Google Domains):
   - Add **A Records** pointing to your host IP.
   - Add **CNAME Record**: `www` pointing to `@` or your hosting URL.
2. Complete domain verification in your hosting panel (Firebase, Vercel, or Hostinger).
3. Update `robots.txt` and `sitemap.xml` with your final production domain name.

---

## 6. Store Administrator Production Setup

1. **Create the Admin Account in Firebase**:
   - Go to the **Firebase Console** -> **Authentication** -> **Users** tab.
   - Click **Add User**.
   - Enter your designated store administrator email (e.g., `admin@fnpnoida76.com` or your business email) and a strong, secure password.
   - Note the generated user `UID`.

2. **Grant Administrator Privileges**:
   - Go to **Firestore Database** -> **admins** collection.
   - Create a new document with the Document ID set to the user's `UID`:
     ```json
     {
       "email": "admin@fnpnoida76.com",
       "role": "superadmin",
       "createdAt": "2026-03-30T00:00:00.000Z"
     }
     ```
   - Alternatively, users with verified emails matching `VITE_ADMIN_EMAIL` have authorization enforced by security rules.

3. **Log In to Admin Dashboard**:
   - Navigate to `/admin` or `/admin/login` on your production URL.
   - Enter your administrator credentials.
   - Once authenticated, you will be redirected to `/admin/products`.

4. **Verify Store Operations**:
   - Navigate to **Store Settings** in the dashboard.
   - Confirm official business phone: `+91 9999517599`
   - Confirm WhatsApp recipient number: `919999517599`
   - Verify store address: `Shop No. 29, Ground Floor, Amrapali Crystal Home, Shopping Arcade, near Mithaas, Amrapali Silicon City, Sector 76, Noida, Uttar Pradesh 201301`
   - Confirm Google Maps link and operating hours.
