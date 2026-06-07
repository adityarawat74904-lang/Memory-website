# 🎬 Memora — Netflix-style Memory Website

A beautiful, cinematic personal memory archive built with pure HTML, CSS, and JavaScript. No frameworks, no build tools — just upload and run.

## ✨ Features

- 🎞️ Netflix-inspired dark UI with smooth animations
- 📁 Browse memories by category (Adventure, Family, Love, Milestone, Travel, Fun)
- ⭐ Favorite memories highlighted in the Featured section
- ➕ Add new memories with title, description, date, category, and color
- 🗑️ Delete memories with confirmation
- 💾 All data saved in your browser's localStorage
- 📱 Fully responsive — works on mobile, tablet, and desktop

## 🚀 How to Use

1. Clone this repo or download the files
2. Open `index.html` in any browser — it works instantly!
3. For GitHub Pages hosting, go to **Settings → Pages → Branch: main → / (root)**

## 📂 File Structure

```
memory-website/
├── index.html       ← Main page
├── css/
│   └── style.css    ← All styling
├── js/
│   └── app.js       ← All functionality
└── README.md
```

## 🌐 Hosting on GitHub Pages

After pushing to GitHub:
1. Go to your repo → **Settings** tab
2. Scroll to **Pages** section
3. Under "Branch", select `main` and folder `/root`
4. Click **Save**
5. Your site will be live at `https://YOUR-USERNAME.github.io/REPO-NAME`

## 🛠️ Customization

- Edit the `DEFAULT_MEMORIES` array in `js/app.js` to change the starter memories
- Edit CSS variables in `:root` in `css/style.css` to change colors
- Add more categories in the `CATEGORY_EMOJI` and `CATEGORY_LABELS` objects

## 📸 Built With

- Vanilla HTML + CSS + JavaScript
- [Playfair Display](https://fonts.google.com/specimen/Playfair+Display) — Display font
- [DM Sans](https://fonts.google.com/specimen/DM+Sans) — Body font
- localStorage for data persistence

---

Made with 🤍 — your memories deserve a beautiful home.
