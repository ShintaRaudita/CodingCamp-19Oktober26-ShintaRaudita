# Implementation Plan: Todo List Life Dashboard

## Overview

This plan builds the dashboard incrementally in vanilla HTML, CSS, and JavaScript with no frameworks, no backend, and no build step. All structure lives in a single `index.html` using a Bento Grid layout, all styling in the one allowed `css/styles.css`, and all behavior in the one allowed `js/app.js`. The JavaScript is organized as module objects inside that single file (`Storage`, `Notify`, `Header`, `Timer`, `TaskMgr`, `Links`). No test framework is installed and no test files or directories are created. Correctness properties are documented to guide manual verification.

Each step builds on the previous one and ends by wiring the new module into the `DOMContentLoaded` bootstrap so there is no orphaned code.

## Tasks

- [ ] 1. Scaffold the page, stylesheet, and app entry point
  - [ ] 1.1 Create `index.html` with the semantic Bento Grid structure
    - Add `<head>` linking the single stylesheet `css/styles.css`
    - Add `<header id="header">` region for clock, greeting, theme, and JSON IO
    - Add `<main class="bento-grid">` with sections for `#focus-timer`, `#calendar-widget`, `#upcoming-tasks`, `#today-tasks`, and `#quick-links`
    - Add `<div id="notify" aria-live="polite">` for status/error messages
    - Add `<script src="js/app.js">` at the end of `<body>`
    - _Requirements: 20.1, 20.2, 24.1, 24.2, 25.1, 25.2_

  - [ ] 1.2 Create `css/styles.css` with the base layout and strict color scheme
    - Implement CSS Grid for the Bento Layout
    - Apply the strict solid color scheme (Background: `#1B1634`, Primary: `#422960`, Secondary: `#01F2FD`, Accents: `#C03F82`, `#C2E3F6`) with no gradients
    - Ensure responsive design
    - _Requirements: 21.1, 21.2, 21.3, 21.4, 21.5, 22.1_

  - [ ] 1.3 Create `js/app.js` with the bootstrap skeleton
    - Add a `DOMContentLoaded` listener that calls each module's `init()` in order (Header, Timer, TaskMgr, Links)
    - Leave module objects as stubs
    - _Requirements: 23.1, 23.2_

- [ ] 2. Implement Shared Helpers (Storage and Notify)
  - [ ] 2.1 Implement `Notify` helper
    - Implement `Notify.error(message)` and `Notify.info(message)`
    - _Requirements: 5.3, 11.3, 18.4_

  - [ ] 2.2 Implement `Storage` helper for Local Storage and JSON IO
    - Implement `read(key)` and `write(key, value)`
    - Implement `loadJSON(key)` and `saveJSON(key, data)`
    - Implement `exportJSON()` to download all keys as a `.json` file
    - Implement `importJSON(jsonString)` to parse, validate, and overwrite Local Storage
    - _Requirements: 4.1, 4.2, 5.1, 5.2, 5.3, 5.4, 5.5_

- [ ] 3. Implement Header_Module
  - [ ] 3.1 Implement clock rendering and time-of-day greeting
    - Render clock every 1000ms formatting as "Weekday, DD month YYYY | HH:MM:SS"
    - Calculate Morning/Afternoon/Night greeting
    - _Requirements: 1.1, 1.2, 1.3_

  - [ ] 3.2 Implement custom name editing and theme toggle
    - Read `userName` from `dashboard.settings` (default: "Shinta")
    - Add inline edit functionality via pencil icon to update and persist the name
    - Implement Light/Dark mode toggle persisting to `dashboard.settings`
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 3.1, 3.2, 3.3, 3.4_

- [ ] 4. Implement Focus_Timer
  - [ ] 4.1 Implement configurable timer settings
    - Read Focus (25), Short Break (5), Long Break (10) from `dashboard.settings`
    - Bind `<input type="number">` fields to update and persist these durations
    - _Requirements: 7.1, 7.2, 7.3, 8.1, 8.2, 8.3, 8.4, 8.5_

  - [ ] 4.2 Implement countdown logic and controls
    - Implement Start, Stop, and Reset buttons
    - Implement `reset()` to strictly return to the configured duration of the active mode
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 6.6_

- [ ] 5. Implement Task_Manager (Calendar and State)
  - [ ] 5.1 Implement Monthly Calendar Grid
    - Generate current month dates and handle click events to set `activeDate` state
    - _Requirements: 10.1, 10.2_

  - [ ] 5.2 Implement Task Data Management & Progress Bar
    - Load tasks from `dashboard.tasks` (Structure: `{ id, text, date, completed }`)
    - Implement `calculateProgress()` for Today's tasks `(completed / total) * 100` and update the green progress bar CSS width
    - _Requirements: 9.1, 9.2, 9.3, 9.4, 15.1, 15.2, 15.3_

- [ ] 6. Implement Task_Manager (CRUD and Drag-and-Drop)
  - [ ] 6.1 Implement Add, Edit, Toggle, Delete, and Sort
    - Implement Add with strict duplicate text prevention for the same date
    - Implement inline Edit, complete Toggle, and Delete
    - Implement Sort by A-Z and Completion status
    - _Requirements: 11.1, 11.2, 11.3, 11.4, 12.1, 12.2, 12.3, 13.1, 13.2, 14.1, 14.2, 14.3_

  - [ ] 6.2 Implement HTML5 Drag and Drop
    - Add `dragstart`, `dragover`, and `drop` event listeners to task elements and list containers
    - On drop, mutate the task's `date` property (Current Date for Today_Tasks, Active Calendar Date for Upcoming_Tasks), persist, and re-render
    - _Requirements: 16.1, 16.2, 16.3, 16.4, 16.5_

- [ ] 7. Implement Quick_Links
  - [ ] 7.1 Implement Quick Links rendering and defaults
    - Load links from `dashboard.quicklinks` or inject defaults (Google Calendar, Notion, Gmail, GitHub, MDN, Discord, YouTube)
    - _Requirements: 17.1, 17.2, 17.3, 19.1, 19.2, 19.3_

  - [ ] 7.2 Implement Quick Links Add and Remove
    - Validate Label and URL inputs (prevent empty submissions)
    - Append to array, persist, and render
    - _Requirements: 18.1, 18.2, 18.3, 18.4_

- [ ] 8. Manual Verification & Properties Check
  - [ ]* 8.1 Verify Clock Format and Custom Name (Property 1)
  - [ ]* 8.2 Verify Timer Configuration and Reset (Property 2)
  - [ ]* 8.3 Verify Duplicate Task Prevention (Property 3)
  - [ ]* 8.4 Verify Drag and Drop Date Mutation (Property 4)
  - [ ]* 8.5 Verify Progress Bar Calculation (Property 5)
  - [ ]* 8.6 Verify JSON Export/Import Round-Trip (Property 6)

## Notes

- Tasks marked with `*` are optional lightweight manual-verification steps. No test framework is used.
- Exactly one CSS file (`css/styles.css`) and one JS file (`js/app.js`) are used.
- Persistence uses Local Storage keys `dashboard.tasks`, `dashboard.quicklinks`, and `dashboard.settings`.

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1.1", "1.2", "1.3"] },
    { "id": 1, "tasks": ["2.1", "2.2"] },
    { "id": 2, "tasks": ["3.1", "3.2", "4.1"] },
    { "id": 3, "tasks": ["4.2", "5.1", "5.2", "7.1"] },
    { "id": 4, "tasks": ["6.1", "6.2", "7.2"] },
    { "id": 5, "tasks": ["8.1", "8.2", "8.3", "8.4", "8.5", "8.6"] }
  ]
}