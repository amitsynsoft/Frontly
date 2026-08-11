# Frontend Engineering Standards

## Architecture Principles

* Always prefer scalable, maintainable, and production-ready solutions over quick fixes.
* Never place all logic, UI, API handling, and form state inside a single component.
* Break large features into smaller reusable components.
* Separate presentation, business logic, configuration, and types whenever possible.
* Keep page components focused on composition and orchestration.

---

## Component Structure

* Create reusable components whenever functionality may be shared across multiple screens.
* Avoid duplicated UI implementations.
* Extract repeated logic into reusable hooks or utility functions.
* Keep components focused on a single responsibility.
* If a component exceeds reasonable complexity, split it into smaller components.

Example:

```txt
Feature/
├── components/
├── hooks/
├── utils/
├── types/
├── FeaturePage.tsx
```

---

## Form Architecture

For all major forms use:

```txt
FormName/
├── FormName.tsx
├── FormName.config.ts
├── FormName.type.ts
├── FormName.schema.ts
├── index.ts
```

Rules:

* Use React Hook Form.
* Use Zod or Yup validation.
* Keep validation schemas separate.
* Keep field configuration separate.
* Keep default values separate.
* Use mapper functions for API payload conversion.
* Reuse the same form for create and edit flows whenever possible.

---

## Styling Rules

* Always use theme values, design tokens, CSS variables, or framework theme systems.
* Never introduce hardcoded colors when theme values exist.
* Never introduce hardcoded spacing systems when design tokens exist.
* Follow the project's design system.
* Prefer reusable UI primitives before creating custom implementations.
* Ensure responsiveness for mobile, tablet, and desktop layouts.

---

## Text and Localization Rules

* Avoid hardcoded text inside components.
* Move labels, placeholders, validation messages, and static content to configuration or localization files.
* Follow existing i18n patterns.
* Ensure all user-facing text is configurable whenever possible.

---

## API and Data Layer Rules

* Use RTK Query or the project's existing API abstraction.
* Do not place API calls directly throughout UI components.
* Define proper DTOs and TypeScript interfaces.
* Transform API data through mapper functions when needed.
* Keep API concerns separated from presentation concerns.

---

## State Management Rules

* Keep local UI state local.
* Use global state only when data truly needs to be shared.
* Avoid unnecessary state duplication.
* Prefer derived state over duplicated state.

---

## Performance Rules

* Avoid unnecessary re-renders.
* Avoid unnecessary useEffect usage.
* Memoize expensive computations when beneficial.
* Lazy load large features when appropriate.
* Optimize lists and table rendering for scalability.

---

## Accessibility Rules

* Use semantic HTML.
* Provide accessible labels for form controls.
* Support keyboard navigation.
* Associate validation messages with their corresponding inputs.
* Follow accessibility best practices whenever possible.

---

## Error Handling Rules

* Every page must properly handle:

  * Loading state
  * Error state
  * Empty state
  * Success state

* Never assume API requests always succeed.

* Display meaningful feedback to users.

---

## Code Quality Rules

* Use strict TypeScript practices.
* Avoid use of any unless absolutely necessary.
* Remove unused imports.
* Remove dead code.
* Remove debugging logs before finalizing.
* Keep files clean and maintainable.
* Follow existing project patterns before introducing new patterns.

---

## Before Generating Code

Always ask:

1. Can this be made reusable?
2. Should this be split into multiple components?
3. Is there an existing component that should be reused?
4. Is all styling theme-based?
5. Is text configurable?
6. Are loading, error, empty, and success states handled?
7. Is the implementation scalable for future requirements?

Generate code only after considering all of the above rules.
