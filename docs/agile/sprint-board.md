# Lockstep Language — Sprint Board

**Sprint Goal:** Deliver a responsive, navigable front-end prototype of the Lockstep Language marketing and onboarding experience, demonstrating the Tell → Show → Do method, a simulated registration flow, and a layout that adapts across devices.

**Total Planned Effort:** 11 story points
**Total Completed Effort:** 11 story points
**Sprint Status:** Complete

---

## Columns

### To Do
*(empty — all stories completed)*

### In Progress
*(empty — all stories completed)*

### Done

---

## US-01 — Understand how it works

- **Description:** As a visitor, I want to understand how Lockstep Language works so I can decide whether to register.
- **Story Points:** 3
- **Priority:** High
- **Status:** Done

**Development Tasks**
- Build Home page introducing Tell → Show → Do and the four competencies.
- Build "How It Works" page with a worked example (*necesito*).
- Build "Learning Method Details" page with the full method, cumulative-vocabulary table, and lesson-length examples.
- Implement interactive pronunciation / syllable-highlight demo with audio playback and timed fallback.
- Wire single-page client-side navigation (`goToPage()`) across all explainer pages.

**Acceptance Criteria**
- Home page introduces the Tell → Show → Do method and the four competencies. ✅
- A dedicated "How It Works" page walks through the three stages with a worked example. ✅
- A "Learning Method Details" page covers the full sequence, per-competency practice, pronunciation demo, cumulative-vocabulary example, and lesson-length options. ✅
- All of this is reachable without registering. ✅

---

## US-02 — Register for an account

- **Description:** As a visitor, I want to complete a registration form so I can begin my learning journey.
- **Story Points:** 5
- **Priority:** High
- **Status:** Done *(simulated, front-end only — see note)*

**Development Tasks**
- Build registration form (first name, last name, email, password, confirm password, terms checkbox).
- Implement real-time and on-submit client-side validation in `scripts/script.js`.
- Add inline error messages, form-level error summary, and show/hide password toggle.
- Build confirmation page and wire the valid-submit transition.
- Add "Prototype only" notes clarifying no data leaves the browser.

**Acceptance Criteria**
- Form collects first name, last name, email, password, confirm password, and Terms agreement. ✅
- Invalid input (missing fields, bad email format, short password, mismatched passwords, unchecked terms) is caught inline with a summary count. ✅
- A valid submission advances to a confirmation screen. ✅

**Note:** Registration is a simulated client-side flow; no backend, account creation, or email is sent. This is documented on the Register page itself and in the README.

---

## US-03 — Responsive display

- **Description:** As a user, I want the website to display properly on different screen sizes so I can use it on my preferred device.
- **Story Points:** 3
- **Priority:** Medium
- **Status:** Done

**Development Tasks**
- Establish layout system (Flexbox + CSS custom properties).
- Add tablet (`max-width: 860px`) and mobile (`max-width: 560px`) breakpoints in `styles/style.css`.
- Build the hamburger menu with open/close behavior.
- Wire outside-click, `Escape`, and resize handlers to close the menu.
- Manually verify layout at desktop, tablet, and mobile (375×812) viewports.

**Acceptance Criteria**
- Layout reflows cleanly at tablet and mobile breakpoints. ✅
- Primary navigation becomes a hamburger menu on smaller screens and behaves correctly (opens, closes on outside click / `Escape` / resize). ✅
