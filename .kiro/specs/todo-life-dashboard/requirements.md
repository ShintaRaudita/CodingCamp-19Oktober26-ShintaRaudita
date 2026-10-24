# Requirements Document

## Introduction

The To-Do List Life Dashboard is a client-side web application that combines task management, a focus timer, an interactive calendar, and quick links into a unified bento-grid dashboard interface. The application is built with HTML, CSS, and Vanilla JavaScript, using the browser Local Storage API for all data persistence. No backend server or JavaScript frameworks are required. The Dashboard provides a clean, minimal interface with a strict color scheme and clear visual hierarchy.

## Glossary

- **Dashboard**: The main application interface rendered in the browser, comprising all UI components.
- **Header**: The top section of the Dashboard containing the Live_Clock, Greeting, and control buttons.
- **Live_Clock**: The real-time clock and date display component in the Header.
- **Greeting**: The personalized welcome message displayed in the Header, showing a custom name.
- **Focus_Timer**: The countdown timer component supporting Focus_Session, Short_Break, and Long_Break modes.
- **Focus_Session**: A countdown period set to the configured focus time duration.
- **Short_Break**: A countdown period set to the configured short break duration.
- **Long_Break**: A countdown period set to the configured long break duration.
- **Calendar**: The interactive monthly calendar grid component for date selection and task navigation.
- **Task**: A to-do item stored in Local_Storage with the structure { id, text, date, completed }.
- **Upcoming_Tasks**: The task list box displaying tasks for the active calendar date.
- **Today_Tasks**: The to-do list displaying tasks for the current date, with add, edit, delete, and sort controls.
- **Progress_Bar**: The green visual indicator showing the percentage of completed tasks in the Today_Tasks list.
- **Quick_Links**: The grid of shortcut buttons for external URLs, with add functionality.
- **Local_Storage**: The browser's localStorage API used for client-side data persistence.
- **Theme**: The visual mode of the Dashboard, either light or dark.
- **JSON_Export**: The process of serializing Local_Storage data to a downloadable JSON file.
- **JSON_Import**: The process of loading JSON file data into Local_Storage.

## Requirements

### Requirement 1: Live Clock and Date Display

**User Story:** As a user, I want to see the current date and time at a glance, so that I can stay aware of the current day and time while using the Dashboard.

#### Acceptance Criteria

1. THE Live_Clock SHALL display the current date and time in the format "Monday, 12 october 2026 | 21:14:37" with the weekday name capitalized, the month name in lowercase, and the time in HH:MM:SS format.
2. THE Live_Clock SHALL update the displayed time every second.
3. THE Live_Clock SHALL display the full weekday name, numeric day, full lowercase month name, and four-digit year separated by the pipe character from the time.

### Requirement 2: Greeting with Custom Name

**User Story:** As a user, I want a personalized greeting with my name, so that the Dashboard feels customized to me.

#### Acceptance Criteria

1. THE Header SHALL display a Greeting using the custom name stored in Local_Storage.
2. WHEN the custom name is not set in Local_Storage, THE Header SHALL display the default name "Shinta".
3. WHEN the user clicks the pencil icon, THE Header SHALL display an editable input field pre-filled with the current custom name.
4. WHEN the user saves the custom name, THE Header SHALL persist the name to Local_Storage and update the Greeting immediately.

### Requirement 3: Light/Dark Theme Toggle

**User Story:** As a user, I want to toggle between light and dark themes, so that I can use the Dashboard comfortably in different lighting conditions.

#### Acceptance Criteria

1. THE Header SHALL display a Light/Dark Mode toggle button.
2. WHEN the user clicks the theme toggle button, THE Dashboard SHALL switch between light and dark Theme modes.
3. WHEN the Dashboard loads, THE Dashboard SHALL apply the Theme stored in Local_Storage.
4. WHEN no Theme is stored in Local_Storage, THE Dashboard SHALL default to dark mode.

### Requirement 4: JSON Export

**User Story:** As a user, I want to export my Local_Storage data, so that I can back up my tasks, links, and settings.

#### Acceptance Criteria

1. WHEN the user clicks the Export JSON button, THE Dashboard SHALL serialize all Local_Storage data into a downloadable JSON file.
2. THE Dashboard SHALL include Tasks, Quick_Links, custom name, Theme, and Focus_Timer settings in the exported JSON file.

### Requirement 5: JSON Import

**User Story:** As a user, I want to import JSON data, so that I can restore my tasks, links, and settings from a backup.

#### Acceptance Criteria

1. WHEN the user clicks the Import JSON button, THE Dashboard SHALL prompt the user to select a JSON file.
2. WHEN a valid JSON file is selected, THE Dashboard SHALL parse the file and write the data into Local_Storage.
3. IF an invalid JSON file is selected, THEN THE Dashboard SHALL display an error message and leave Local_Storage unchanged.
4. WHEN JSON data is successfully imported, THE Dashboard SHALL re-render all components to reflect the imported data.
5. WHEN a valid exported JSON file is imported, THE Dashboard SHALL restore Local_Storage to the state that existed at export time, producing an equivalent data set (round-trip property).

### Requirement 6: Focus Timer Display and Controls

**User Story:** As a user, I want a countdown timer with controls, so that I can manage my focus sessions and breaks.

#### Acceptance Criteria

1. THE Focus_Timer SHALL display a digital countdown showing minutes and seconds remaining.
2. THE Focus_Timer SHALL display a Start button, a Stop button, and a Reset/Break button.
3. WHEN the user clicks the Start button, THE Focus_Timer SHALL begin counting down from the current set time.
4. WHEN the user clicks the Stop button, THE Focus_Timer SHALL pause the countdown at the current displayed time.
5. WHEN the user clicks the Reset/Break button, THE Focus_Timer SHALL reset the countdown to the configured duration of the current mode.
6. WHEN the countdown reaches zero, THE Focus_Timer SHALL stop the countdown and display 00:00.

### Requirement 7: Focus Timer Default Durations

**User Story:** As a user, I want default timer durations for focus and breaks, so that I can start working immediately without configuration.

#### Acceptance Criteria

1. THE Focus_Timer SHALL default the Focus_Session duration to 25 minutes.
2. THE Focus_Timer SHALL default the Short_Break duration to 5 minutes.
3. THE Focus_Timer SHALL default the Long_Break duration to 10 minutes.

### Requirement 8: Focus Timer Settings

**User Story:** As a user, I want to customize the timer durations, so that I can adapt the timer to my work style.

#### Acceptance Criteria

1. THE Focus_Timer SHALL display three input fields of type number for Focus Time, Short Break, and Long Break, each accepting values in minutes.
2. WHEN the user changes a timer setting input value, THE Focus_Timer SHALL update the corresponding duration.
3. THE Focus_Timer SHALL persist timer settings to Local_Storage.
4. WHEN the Dashboard loads, THE Focus_Timer SHALL load timer settings from Local_Storage.
5. WHEN no timer settings are stored in Local_Storage, THE Focus_Timer SHALL use the default durations.

### Requirement 9: Task Data Structure

**User Story:** As a developer, I want a consistent Task data structure, so that tasks are stored and retrieved uniformly across the Dashboard.

#### Acceptance Criteria

1. THE Dashboard SHALL store each Task with the properties id, text, date, and completed.
2. THE Task date property SHALL use the YYYY-MM-DD format.
3. THE Task completed property SHALL be a boolean value.
4. THE Task id property SHALL be a unique identifier for each Task.

### Requirement 10: Interactive Calendar

**User Story:** As a user, I want an interactive calendar, so that I can navigate dates and view tasks for any day.

#### Acceptance Criteria

1. THE Calendar SHALL display a monthly grid of dates.
2. WHEN the user clicks a date in the Calendar grid, THE Calendar SHALL set that date as the active date.
3. WHEN a date is set as active, THE Upcoming_Tasks box SHALL load and display all Tasks with a date matching the active date.

### Requirement 11: To-Do List Today - Add Task

**User Story:** As a user, I want to add tasks for today, so that I can plan my current day.

#### Acceptance Criteria

1. THE Today_Tasks SHALL display an input field and an add button for creating new Tasks.
2. WHEN the user submits a new task, THE Dashboard SHALL create a Task with the current date and add the Task to Local_Storage.
3. WHEN the user submits a task with text identical to an existing Task for the same date, THE Dashboard SHALL prevent the duplicate, display a message, and leave the existing Task unchanged.
4. WHEN a Task is added, THE Dashboard SHALL re-render the Today_Tasks list.

### Requirement 12: To-Do List Today - Edit Task

**User Story:** As a user, I want to edit tasks inline, so that I can correct or update task text.

#### Acceptance Criteria

1. THE Today_Tasks SHALL display an edit control for each Task.
2. WHEN the user activates the edit control, THE Today_Tasks SHALL display an inline input field pre-filled with the Task text.
3. WHEN the user saves the edited text, THE Dashboard SHALL update the Task text in Local_Storage and re-render the list.

### Requirement 13: To-Do List Today - Delete Task

**User Story:** As a user, I want to delete tasks, so that I can remove completed or unwanted items.

#### Acceptance Criteria

1. THE Today_Tasks SHALL display a delete control for each Task.
2. WHEN the user clicks the delete control, THE Dashboard SHALL remove the Task from Local_Storage and re-render the list.

### Requirement 14: To-Do List Today - Sort Tasks

**User Story:** As a user, I want to sort tasks, so that I can organize my task list.

#### Acceptance Criteria

1. THE Today_Tasks SHALL provide a sort control with options for A-Z alphabetical order and completion status.
2. WHEN the user selects A-Z sort, THE Dashboard SHALL sort Tasks alphabetically by text in ascending order.
3. WHEN the user selects completion sort, THE Dashboard SHALL sort Tasks with incomplete Tasks displayed before completed Tasks.

### Requirement 15: To-Do List Today - Progress Bar

**User Story:** As a user, I want to see my completion progress, so that I can track how much I have accomplished.

#### Acceptance Criteria

1. THE Today_Tasks SHALL display a green Progress_Bar.
2. THE Progress_Bar SHALL display the completion percentage calculated as the number of completed Tasks divided by the total number of Tasks, multiplied by 100.
3. WHEN no Tasks exist for the current date, THE Progress_Bar SHALL display 0 percent.

### Requirement 16: Drag and Drop Between Task Lists

**User Story:** As a user, I want to drag tasks between lists, so that I can move Tasks to today or reschedule them.

#### Acceptance Criteria

1. THE Dashboard SHALL use native HTML5 drag-and-drop to enable dragging Tasks between Upcoming_Tasks and Today_Tasks.
2. WHEN a Task is dropped into the Today_Tasks list, THE Dashboard SHALL update the Task date to the current date in Local_Storage.
3. WHEN a Task is dropped into the Upcoming_Tasks list, THE Dashboard SHALL update the Task date to the active calendar date in Local_Storage.
4. WHEN a Task is dropped, THE Dashboard SHALL re-render both the Upcoming_Tasks and Today_Tasks lists.
5. WHEN a Task is being dragged, THE Dashboard SHALL provide a visual indicator showing the dragged item.

### Requirement 17: Quick Links Display

**User Story:** As a user, I want quick access to my favorite sites, so that I can navigate to the Dashboard from the Dashboard.

#### Acceptance Criteria

1. THE Quick_Links SHALL display a grid of shortcut buttons.
2. THE Quick_Links SHALL display the default links: Google Calendar, Notion, Gmail, GitHub, MDN Web Docs, Discord, and YouTube.
3. WHEN the user clicks a Quick_Links button, THE Dashboard SHALL open the corresponding URL in a new browser tab.

### Requirement 18: Quick Links Add

**User Story:** As a user, I want to add custom links, so that I can access my preferred sites from the Dashboard.

#### Acceptance Criteria

1. THE Quick_Links SHALL display an input form with Label and URL fields and an Add button.
2. WHEN the user submits a new link with a Label and URL, THE Dashboard SHALL append the link to Local_Storage.
3. WHEN a link is added, THE Dashboard SHALL re-render the Quick_Links grid.
4. IF the user submits a link with an empty Label or empty URL, THEN THE Dashboard SHALL display an error message and leave Quick_Links unchanged.

### Requirement 19: Quick Links Persistence

**User Story:** As a user, I want my custom links to persist, so that the links are available across browser sessions.

#### Acceptance Criteria

1. THE Dashboard SHALL persist all Quick_Links to Local_Storage.
2. WHEN the Dashboard loads, THE Quick_Links SHALL load links from Local_Storage.
3. WHEN no custom links are stored in Local_Storage, THE Quick_Links SHALL display the default links.

### Requirement 20: Bento Grid Layout

**User Story:** As a user, I want a bento grid dashboard layout, so that all components are organized in a clean, structured view.

#### Acceptance Criteria

1. THE Dashboard SHALL render all components in a bento grid layout.
2. THE Dashboard SHALL arrange the Header, Focus_Timer, Calendar, Today_Tasks, Upcoming_Tasks, and Quick_Links as grid cells within the bento grid.

### Requirement 21: Color Scheme

**User Story:** As a user, I want a consistent color scheme, so that the Dashboard has a cohesive visual design.

#### Acceptance Criteria

1. THE Dashboard SHALL use #1B1634 as the background color.
2. THE Dashboard SHALL use #422960 as the primary color.
3. THE Dashboard SHALL use #01F2FD as the secondary color.
4. THE Dashboard SHALL use #C03F82 and #C2E3F6 as accent colors.
5. THE Dashboard SHALL apply solid colors exclusively in all styling.

### Requirement 22: Responsive User Interface

**User Story:** As a user, I want a responsive interface, so that the Dashboard works smoothly without lag.

#### Acceptance Criteria

1. THE Dashboard SHALL render the user interface within 1 second of page load on a modern browser.
2. THE Dashboard SHALL respond to user interactions within 100 milliseconds.

### Requirement 23: Browser Compatibility and Technology Stack

**User Story:** As a user, I want the Dashboard to work in my browser, so that I can use the Dashboard without compatibility issues.

#### Acceptance Criteria

1. THE Dashboard SHALL function correctly in modern browsers supporting HTML5, CSS3, and ES6 JavaScript.
2. THE Dashboard SHALL use HTML for structure, CSS for styling, and Vanilla JavaScript for logic, without any JavaScript frameworks.
3. THE Dashboard SHALL use the browser Local_Storage API for all data persistence without requiring a backend server.

### Requirement 24: Folder and File Structure

**User Story:** As a developer, I want a clean file structure, so that the codebase is maintainable.

#### Acceptance Criteria

1. THE Dashboard SHALL contain exactly one CSS file inside the css/ directory.
2. THE Dashboard SHALL contain exactly one JavaScript file inside the js/ directory.

### Requirement 25: Visual Hierarchy and Minimal Interface

**User Story:** As a user, I want a clean and minimal interface with clear visual hierarchy, so that I can focus on my tasks without distraction.

#### Acceptance Criteria

1. THE Dashboard SHALL use distinct sizing, spacing, and color contrast to establish clear visual hierarchy between primary content and secondary elements.
2. THE Dashboard SHALL maintain a minimal interface by displaying only functional components and avoiding decorative clutter.
