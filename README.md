# Flavour Auto-Rotation Slider

A responsive, circular flavour carousel built with plain HTML, CSS and JavaScript. It is ready for GitHub Pages and does not require React, npm, a build step, or a server.

## Files

- `index.html` — page structure
- `style.css` — responsive design and animations
- `script.js` — flavour data, circular menu, navigation and auto-rotation

## Run locally

Open `index.html` in a browser.

## Publish with GitHub Pages

1. Create or open your GitHub repository.
2. Upload `index.html`, `style.css`, `script.js`, and this README to the repository root.
3. Open **Settings → Pages**.
4. Under **Build and deployment**, choose **Deploy from a branch**.
5. Select the `main` branch and `/ (root)` folder, then save.
6. Wait for GitHub Pages to publish the site. Your page URL will appear in the Pages section.

## Change the flavours and images

Open `script.js` and edit the `flavours` array near the top. Each item has:

- `name`
- `image` — a direct image URL
- `background` — a CSS background gradient
- `description`

Use image URLs that are publicly accessible. The included image URLs point to the image files used by the source slider you provided. If you move the images into this repository, update the URLs to relative paths such as `assets/kiwi.png`.

## Auto-rotation behaviour

- Changes flavour every 4 seconds.
- Previous, Next and flavour buttons work.
- Manual navigation resets the 4-second timer.
- Pauses while the pointer is over the carousel, while a control has keyboard focus, during touch interaction, or when the browser tab is hidden.
- Includes a Pause/Resume button.
- Respects the device's reduced-motion preference.
