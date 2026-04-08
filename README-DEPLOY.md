# ============================================
# MARCHÉ LT EBEN-EZER - DEPLOYMENT GUIDE
# ============================================

## 📁 FINAL FOLDER STRUCTURE

```
marcheltebenezer/
├── index.html                 # Main store (FRONTEND)
├── app.js                     # Store JavaScript
├── styles.css                 # Store Styles
├── admin.html                 # Admin Panel
├── admin-app.js               # Admin JavaScript
├── admin-styles.css           # Admin Styles
├── pricing-admin.html         # Pricing Management
├── pricing-engine.js          # Pricing Logic
├── image-pipeline.html         # Product Image Tool
├── image-pipeline.js          # Image Pipeline
├── african-food-canada.html   # SEO Page
├── where-to-buy-african-groceries-canada.html  # SEO Page
├── robots.txt                  # Search Engine
├── sitemap.xml                # Site Map
├── product_images.json        # Product Image Map
│
├── files/                     # Static Assets
│   ├── logo.jpg              # Store Logo
│   ├── SIGNATURE.jpg         # Business Signature
│   └── STOCKLIST/
│       ├── pictures/          # Product Images
│       └── slips/             # Invoice Slips
│
└── README-DEPLOY.md           # This file
```

---

## 🚀 DEPLOY TO CLOUDFLARE PAGES (SIMPLE)

### Step 1: Prepare Your Files
1. Create a folder called `dist` or `public`
2. Copy ALL files listed above into that folder
3. Keep the folder structure exactly as shown

### Step 2: Connect to Cloudflare
1. Go to https://dash.cloudflare.com
2. Click "Pages" in left sidebar
3. Click "Create project"
4. Select "Upload assets"
5. Drag and drop your `dist` folder
6. Name your project: `marchelteben-ezer`

### Step 3: Configure (Just Once)
- **Branch to deploy**: `main` (or whatever you use)
- **Build settings**: Leave empty (this is static HTML)
- **Output directory**: Leave empty

### Step 4: Done!
Cloudflare will give you a URL like:
`https://marchelteben-ezer.pages.dev`

---

## 🔧 CUSTOM DOMAIN (OPTIONAL)

If you want your own domain (e.g., `marchelteben-ezer.com`):

1. In Cloudflare Pages → Your Project → Custom domains
2. Enter your domain
3. Cloudflare will show DNS settings
4. Update your domain registrar DNS:
   - Type: CNAME
   - Name: `@` or your subdomain
   - Value: `marchelteben-ezer.pages.dev`

---

## ⚙️ IMPORTANT SETTINGS

### Environment Variables (None Required)
This is a static site - no environment variables needed!

### Build Settings
- **Build command**: None (static files)
- **Output directory**: None (root)

---

## 🛡️ WHAT NOT TO TOUCH

Don't change these:
- `robots.txt` - Controls search engines
- `sitemap.xml` - Site map for Google
- Schema.org data in HTML head - Controls search appearance

---

## 📞 BUSINESS SETTINGS TO UPDATE

Before going live, update in HTML files:

1. **Phone**: `+1 (514) 467-0229` (in footer, checkout modal)
2. **Address**: `4821 Boul Henri-Bourassa Est, Montreal, QC H1H 1M5`
3. **WhatsApp**: `https://wa.me/15144670229`
4. **Business Hours** in schema (index.html lines ~170-185)

---

## ✅ DEPLOYMENT CHECKLIST

Before launching:
- [ ] All HTML files in one folder
- [ ] `files/` folder with images present
- [ ] Test in browser (double-click index.html)
- [ ] Uploaded to Cloudflare Pages
- [ ] Custom domain connected (optional)

---

## 🔍 TESTING YOUR DEPLOYMENT

Open your Cloudflare URL and verify:
1. Homepage loads with products
2. Logo displays
3. Add to cart works
4. WhatsApp ordering works
5. Admin panel loads
6. SEO pages work

---

## 📞 HELP

If something breaks:
- Check browser console (F12) for errors
- Verify all files are uploaded
- Ensure `files/` folder is included
- Contact developer with error message

---

## 💰 COST

Cloudflare Pages: **FREE** (for personal/business sites)
Custom domain: $0-15/year for domain registration

---

# ============================================
# END OF GUIDE
# ============================================
