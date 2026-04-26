# K Tech Website

Professional IT support website for K Tech, Abuja, Nigeria.

---

## File Structure

```
ktech/
├── index.html          ← The entire website (edit this for content changes)
├── api/
│   └── submit.js       ← Vercel serverless function (Notion CRM integration)
├── vercel.json         ← Vercel configuration
├── .gitignore          ← Excludes system files
└── README.md           ← This file
```

---

## What's Integrated

| Feature | Tool | Cost |
|---|---|---|
| Hosting | Vercel | Free |
| CRM / Database | Notion | Free |
| Instant Contact | WhatsApp | Free |
| Domain (optional) | Any registrar | ~$10/yr |

---

## One-Time Setup Guide

### Step 1 — Notion CRM (your customer database)

1. Go to https://www.notion.so and sign up (free)
2. Create a new **full-page database** called "K Tech Leads"
3. Add these columns:
   - `Name` — Title (already exists)
   - `Email` — Email
   - `Phone` — Phone
   - `Service` — Select
   - `Plan` — Select
   - `Status` — Select (options: New, In Progress, Done)
   - `Message` — Text
4. Go to https://developers.notion.com → **My integrations** → **New integration**
5. Give it a name (e.g. "K Tech Website"), copy the **Internal Integration Token**
6. Back in Notion, open your database → click `···` (top right) → **Connections** → add your integration
7. Copy your **Database ID** from the URL:
   `notion.so/your-workspace/[THIS_PART]?v=...`

### Step 2 — WhatsApp

1. In `index.html`, replace all instances of `2348103356742` with your real WhatsApp number in international format (no +, no spaces)
   Example: `+234 810 335 6742` becomes `2348103356742`

### Step 3 — Deploy to Vercel

1. Push this folder to a GitHub repository
2. Go to https://vercel.com → **Add New Project** → import your repo
3. In Vercel → your project → **Settings** → **Environment Variables**, add:
   - `NOTION_API_KEY` = your Notion integration token
   - `NOTION_DATABASE_ID` = your Notion database ID
4. Click **Deploy**

---

## Making Changes to the Website

All content is in **`index.html`**. Here is what to edit:

| What you want to change | Where to find it in index.html |
|---|---|
| Phone number | Search `2348103356742` — replace all 4 instances |
| Email address | Search `hello@ktech.ng` — replace both instances |
| Prices | Search `₦5,000`, `₦15,000` |
| Working hours | Search `8am to 7pm` |
| Service descriptions | Find `<!-- SERVICES -->` section |
| About text | Find `<!-- ABOUT -->` section |
| Hero headline | Find `<h1>IT Support` |
| Add/remove a service card | Copy a `<div class="service-card">` block |

kiitrepairs@gmail.com


---

## Local Development

Just open `index.html` in your browser. No server needed for the front end.

To test the form submission (Notion integration) locally:

```bash
npm install -g vercel
vercel dev
```

This runs the API functions locally so you can test the full form flow.

---

## Pushing to GitHub

```bash
cd ktech
git init
git add .
git commit -m "Initial K Tech website"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/ktech-website.git
git push -u origin main
```

Every time you make a change:

```bash
git add .
git commit -m "describe what you changed"
git push
```

Vercel auto-deploys every push to `main`. Your live site updates in about 30 seconds.
