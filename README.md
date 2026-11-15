# Yeon and Pil — EPK website

Static site: plain HTML, CSS and JavaScript. No build step, no libraries.

## Folder structure

```
index.html          all page content (one section per block, commented)
css/style.css       all styling; design tokens (colors, fonts) are at the top
js/main.js          small features: menu, fade-in, copy buttons, video loader
assets/
  img/              web images (webp) used on the page
  press/            full-size press photos and logo (what "Download" gives people)
  downloads/        EPK PDFs (EN / KO / TH / all languages)
```

## Preview on your computer

```
python3 -m http.server 8000
```

Open http://localhost:8000 (opening index.html by double-click also works,
but the Google Fonts and YouTube thumbnails need an internet connection).

## Common edits

| I want to...                       | Edit                                                         |
|------------------------------------|--------------------------------------------------------------|
| Change band text or highlights     | `index.html`, sections `ABOUT` and `Highlights`              |
| Change a link (Spotify, Instagram) | `index.html`, section `LISTEN`, the `href` of the icon button |
| Swap a YouTube video               | `index.html`, `data-video-id="..."` (the part after `v=`)     |
| Change colors or fonts             | `css/style.css`, section `1. DESIGN TOKENS`                   |
| Replace the hero image             | overwrite `assets/img/hero.webp` (about 2000px wide)          |
| Add a press photo                  | put the original in `assets/press/`, a ~1000px webp in `assets/img/`, copy one `<li>` in the `Press photos` list |
| Replace a PDF                      | overwrite the file in `assets/downloads/` with the same name  |
| Remove the phone number            | delete the `tel:` line in the `CONTACT` section               |

## Publish

Any static host works (GitHub Pages, Netlify, Cloudflare Pages, or your own server).
Upload the whole folder as it is. `index.html` must stay at the top level.

For GitHub Pages: push this folder to a repository, then
Settings > Pages > Deploy from branch > `main` / root.
