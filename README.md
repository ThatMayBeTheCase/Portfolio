# My Portfolio

This is my personal portfolio website, built with **HTML**, **CSS**, and **JavaScript**.  
It includes a fake terminal with animations, an interactive skills section, a project page with my projects and a simple responsive design.

👉 **Live demo**: [https://timmy.github.io/](https://thatmaybethecase.github.io/Portfolio)

---

## Features
- Fake terminal with typewriter effect  
- Interactive skills section with dynamic text  
- Responsive design for desktop and mobile  
- Project page with links to their github as well as demos

---

## Tech stack
### HTML — Semantics & Structure
- Semantic tags: `<header>`, `<nav>`, `<main>`, `<section>`, `<aside>`
- Proper heading (h1/h2/h3)
- `alt` attributes on images
- Shared navbar across pages

### CSS — Layout & Responsiveness
- **CSS Grid** for the hero (text + terminal)
- **Flexbox** for nav, cards, and lists
- **Media query** at `max-width: 768px`
- **Sticky** navbar with `z-index` to stay above content
- Subtle transitions and hover states

### JavaScript — Functionality & ES6
- ES6 features: `const`/`let`, arrow functions, `async/await`
- DOM API: `querySelector`, `getElementById`, `classList`, `dataset`, `closest`, `forEach`
- Accessibility hooks: `aria-expanded`, `prefers-reduced-motion`
- UI state mirrored in the DOM, `data-open` attribute (CSS handles animation)

---

## Interactive Features

### 1) Hamburger Menu for mobile
- **What:** A toggle button that opens/closes the navigation links on small screens.
- **How:** JavaScript sets `data-open="true|false"` on the nav container and updates `aria-expanded`.  
  CSS listens to `[data-open="true"]` and animates the panel open/closed.  
  Also closes on outside-click.

### 2) Contacts (Terminal)
- **What:** Clicking **Contacts** prints contact info line-by-line in the fake terminal.
- **How:**  
  - Lines are stored in an array and written **character by character** (with natural pauses).  
  - During typing, text is **HTML escaped** (written in plain text) to avoid breaking, when a line finishes, it is replaced with the **original HTML**, making links clickable.  
  - An **abort token** cancels ongoing animation if triggered again.  
  - For accessibility I have `prefers-reduced-motion` by rendering everything instantly if the user prefers less animation in browser settings.

### 3) "Skills" section
- **What:** Clicking a skill updates the heading and descriptive text with a typewriter animation.
- **How:**  
  - A simple dictionary maps `data-skill` → description.  
  - Event delegation `closest('[data-skill]')` handles clicks.  
  - The active skill gets a visual state, text types in character by character, also with no animation fallaback.

---

## Challenges & Solutions

- **Menu hidden behind content**  
  **Issue:** The mobile panel appeared under hero/projects.  
  **Fix:** `position: sticky/relative` + higher `z-index` on `.navbar` and the menu panel.

- **Inconsistent spacing**  
  **Issue:** `margin` on links clashed with `gap`.  
  **Fix:** Let `.nav-links "gap:"` control spacing instead of margins.

- **HTML in the terminal**  
  **Issue:** Partially typed HTML could render incorrectly.  
  **Fix:** Escape during typing, then swap to the original HTML when the line finishes so links work properly.

- **Prompt animated (everything typed, too noisy)**  
  **Issue:** The entire line (prompt + path + `$` + command/output) was typed character-by-character, which looked jittery and sometimes rendered partial HTML mid-typing.  
  **Fix:** Added a `promptMatch` regex to split each line into `prefixHTML` (prompt, path, `$ `) and `restHTML` (the command/output). Render `prefixHTML` immediately, type `restHTML` as escaped text via `escapeHTML`, then swap in the original HTML when the line finishes so links are clickable.


- **Accessibility**  
  **Issue:** Animations can be uncomfortable for some users.  
  **Fix:** Respect `prefers-reduced-motion` and skip animations if ruquested by user.

---
*This is an early stage and a demo, and will be built upon as my experience increases.*