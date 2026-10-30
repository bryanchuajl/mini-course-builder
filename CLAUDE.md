# CLAUDE.md

## Tech Stack
- Plain HTML, CSS, and JavaScript only.
- No frameworks and no build step: files open directly in a browser.

## Project Structure
All files live at the top level:
- `index.html` – the course page; one `<section class="lesson">` per lesson
- `styles.css` – plain styling, light and dark theme colours
- `script.js` – switches between lessons and handles the theme toggle
- `README.md` – placeholder readme
- `CLAUDE.md` – this file

The source slide deck is not stored in the repo. Update this section as the structure grows.

## Key Requirements
1. Every page must be responsive and work on desktop, tablet, and phone.
2. Users can toggle between a light and a dark theme. The default is the light theme.

## Rules for Claude
- Explain technical terms in plain language.
- Ask before making big changes.
- Ask rather than guess when something is unclear.

## Feature Plan

### Site structure
One page. JavaScript switches between three tabs and, inside the Lesson tab, between lessons (no separate pages). Top to bottom:
1. Header – course title and light/dark theme toggle.
2. Tabs – Lesson, Quiz, Simulator.
3. Lesson tab – a menu, one section per topic of the slide deck (8 for Lesson 5) with a heading, plain-language text and one check-in question, then Previous/Next buttons.
4. Quiz tab – 8 questions, each marked right or wrong as it is answered; the score shows after all 8.
5. Simulator tab – build an if/elif/else statement and see which block runs.

### How students move between sections
- Click a tab to switch between Lesson, Quiz and Simulator.
- In the Lesson tab, click a menu link, or use Previous/Next, to switch lessons. Next is always available, whether or not the check-in was answered correctly.
- The address bar (`#lesson-id`, `#quiz` or `#simulator`) tracks where the student is, so the back button and shared links work.
- Planned later: remembering finished lessons in the browser.

### Phases
- **Phase 1 – Course from the slides:** ask for the slides (PDF/PowerPoint) first, then build the page with all lessons, the menu, Previous/Next, and the light/dark toggle. Styling stays plain until it works. Check-in questions, the Quiz tab and the Simulator tab are done. Takeaway boxes and saved progress come later.
- **Phase 2 – Polish:** test on desktop/tablet/phone, check readability and keyboard use in both themes, fix issues.
- **Phase 3 – Later ideas (only if asked):** extras such as a certificate or printable summary.
