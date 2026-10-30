# CLAUDE.md

## Tech Stack
- Plain HTML, CSS, and JavaScript only.
- No frameworks and no build step: files open directly in a browser.

## Project Structure
The repo is nearly empty for now:
- `README.md` – placeholder readme
- `CLAUDE.md` – this file

New files go at the top level (e.g. `index.html`, `styles.css`, `script.js`). Update this section as the structure grows.

## Key Requirements
1. Every page must be responsive and work on desktop, tablet, and phone.
2. Users can toggle between a light and a dark theme. The default is the light theme.

## Rules for Claude
- Explain technical terms in plain language.
- Ask before making big changes.
- Ask rather than guess when something is unclear.

## Feature Plan

### Site structure
One long scrolling page. Top to bottom:
1. Header – course title, short intro, light/dark theme toggle.
2. Sticky menu – stays visible; links jump to each lesson and show which are done.
3. Lessons (3-5, one per slide) – each has a heading, plain-language text, the slide image, a key-takeaways box, and a short quiz.
4. Footer – wrap-up message.

### How students move between sections
- Scroll down, or click a menu link to jump to a lesson.
- The menu highlights the lesson currently on screen.
- Finished lessons and quiz results are remembered in the browser, so students can return later.

### Phases
- **Phase 1 – Course from the slides:** ask for the slides (PDF/PowerPoint) first, then build the page with all lessons, quizzes, takeaways, sticky menu, saved progress, and the light/dark toggle.
- **Phase 2 – Polish:** test on desktop/tablet/phone, check readability and keyboard use in both themes, fix issues.
- **Phase 3 – Later ideas (only if asked):** extras such as a certificate or printable summary.
