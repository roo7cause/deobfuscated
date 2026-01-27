# Deployment Guide for Deobfuscated Blog

## Recommended: Vercel (Easiest & Best for Astro)

### Step 1: Push to GitHub
1. Create a new repository on GitHub (if you haven't already)
2. Push your code:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/deobfuscated.git
   git push -u origin main
   ```

### Step 2: Deploy to Vercel
1. Go to [vercel.com](https://vercel.com) and sign up/login with GitHub
2. Click "Add New Project"
3. Import your GitHub repository
4. Vercel will auto-detect Astro - no configuration needed!
5. Click "Deploy"

### Step 3: Configure Custom Domain
1. In Vercel dashboard, go to your project → Settings → Domains
2. Add your domain: `deobfuscated.dev`
3. Follow DNS instructions (add CNAME record)
4. Update `src/config.ts` to ensure `SITE.website` matches your domain

### Step 4: Environment Variables (Optional)
If you want to use Google Search Console verification:
1. Go to Vercel → Project → Settings → Environment Variables
2. Add: `PUBLIC_GOOGLE_SITE_VERIFICATION` = your verification code

### Build Settings (Auto-detected by Vercel)
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`
- **Node Version**: 20.x (auto-detected)

---

## Alternative: Netlify

### Step 1: Push to GitHub (same as above)

### Step 2: Deploy to Netlify
1. Go to [netlify.com](https://netlify.com) and sign up/login
2. Click "Add new site" → "Import an existing project"
3. Connect your GitHub repository
4. Netlify will auto-detect Astro
5. Click "Deploy site"

### Step 3: Configure Custom Domain
1. Go to Site settings → Domain management
2. Add custom domain: `deobfuscated.dev`
3. Configure DNS as instructed

---

## Alternative: Cloudflare Pages

### Step 1: Push to GitHub (same as above)

### Step 2: Deploy to Cloudflare Pages
1. Go to Cloudflare Dashboard → Pages
2. Click "Create a project" → "Connect to Git"
3. Select your repository
4. Build settings:
   - **Framework preset**: Astro
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
5. Click "Save and Deploy"

---

## Post-Deployment Checklist

- [ ] Verify site is accessible
- [ ] Test dark/light mode toggle
- [ ] Check mobile responsiveness
- [ ] Verify RSS feed at `/rss.xml`
- [ ] Test search functionality
- [ ] Verify OG images are generating correctly
- [ ] Set up Google Search Console (optional)
- [ ] Set up analytics (optional)
- [ ] Test all internal links
- [ ] Verify sitemap at `/sitemap-index.xml`

---

## Troubleshooting

### Build fails
- Check Node version (should be 18+)
- Ensure all dependencies are in `package.json`
- Check build logs in deployment platform

### Fonts not loading
- Verify font name matches exactly in `astro.config.ts`
- Check network tab for font loading errors

### OG images not generating
- Ensure `dynamicOgImage: true` in `src/config.ts`
- Check that `SITE.website` is set correctly
- Verify image generation dependencies are installed
