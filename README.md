# React19-Newhooks-Fingerprintjs

A hobby app focused on showing code for some new React 19 Hooks/APIs and testing out browser fingerprinting technology.

## Table of contents

- [Overview](#overview)
  - [The challenge](#the-challenge)
  - [Screenshot](#screenshot)
  - [Links](#links)
  - [My process](#my-process)
  - [Built with](#built-with)
  - [What I learned](#what-i-learned)
  - [Continued development](#continued-development)
  - [Useful resources](#useful-resources)
  - [Author](#author)
  - [Acknowledgments](#acknowledgments)

## Overview

### The Challenge/User Stories

The goal was to build a client-side fingerprinting app that collects detailed device, browser, and network information while respecting user consent. Users can view real-time data on their device specs, network identity, and visitor metrics. When consent is given, the app enriches the fingerprint with anonymized IP-based location data. Users should also be able to navigate between different demo pages showcasing React hooks like useTransition, useRef, and others, while keeping state management clean via Zustand. Error handling, loading states, and a smooth UI experience were also key priorities to make the fingerprint collection transparent and user-friendly.

### Screenshot

![](/public/screenshot-desktop.png)

### Links

- Solution URL: [https://github.com/traez/react19-newhooks-fingerprintjs](https://github.com/traez/react19-newhooks-fingerprintjs)
- Live Site URL: [https://react19-newhooks-fingerprintjs.vercel.app/](https://react19-newhooks-fingerprintjs.vercel.app/)

## My process

### Built with

- Semantic HTML5 markup
- CSS custom properties
- Flexbox and CSS Grid
- Mobile-first workflow
- [React](https://reactjs.org/) - JS library
- [Next.js](https://nextjs.org/) - React framework
- Typescript
- Nodejs
- Tailwind CSS
- highlight.js
- nextjs-toploader
- react-icons
- sonner
- zustand

### What I learned

**1 Code Syntax Highlighting in React.js**  
For code snippet syntax highlighting in React.js, you can use `<code>`, `<kbd>`, and `<pre>` elements with Tailwind styling for basic needs. However, for professional applications, consider using [highlight.js](https://highlightjs.org/) for more robust syntax highlighting capabilities.

**2 React 19's `use()` API**  
The `use()` API is a new React 19 feature that allows you to wait for a Promise directly inside a component without needing `useEffect`, `useState`, or manual loading state management . It "pauses" rendering until the Promise resolves, then continues with the result. The primary objective of this API is to control loading and error states while retrieving data seamlessly.

**3 Server-Side API Calls in Next.js**  
In Next.js (especially with the App Router), it's best practice to run API calls server-side via route handlers whenever possible. This approach:

- Keeps sensitive logic and tokens secure
- Reduces client-side bundle size
- Avoids exposing third-party APIs to the browser
- Enables better caching and centralized data handling
- Makes frontend components cleaner and faster

**4 When Client-Side API Calls Are Necessary**  
While server-side API calls are preferred, client-side calls are necessary when:

- Working with browser-specific features (geolocation, local storage)
- Using third-party SDKs that only run in the browser
- Accessing session data only available client-side
- Handling real-time updates
- Fetching public data where security isn't a concern

**5 Hiding Sensitive Logic with Next.js API Routes**  
**Best Practice Summary:**

- ✅ Put non-trivial logic in API routes if it's not meant for the browser
- ✅ Don't expose secret keys, third-party APIs, or proprietary algorithms to the frontend
- ✅ Leverage the App Router's server-handling features for optimal security

**6 Dynamic Route Handling**  
Use `export const dynamic = 'force-dynamic'` in `route.ts` when your route depends on request-specific data such as:

- User's IP address, cookies, headers, or authentication details
- Real-time or frequently changing data
- Routes that perform side effects (logging, analytics, tracking)

This ensures the route runs fresh on the server for every request, bypassing static caching.

**7 Environment Variables in Next.js**  
The `process.env.NODE_ENV` variable is a built-in Node.js/Next.js variable that automatically reflects your app's runtime mode:

- `"development"` during local development (`next dev`)
- `"production"` when built for deployment (`next build && next start`)
- `"test"` during testing

No `.env` configuration is required for this variable.

**8 SHA-256 Hashing**  
SHA-256 is a secure hashing algorithm that creates a 256-bit (32-byte) hash from any input, commonly used for data integrity verification or secure password storage. In Next.js apps, you can use it server-side via Node.js's built-in `crypto` module without additional libraries.

**9 Tailwind CSS Theme Variables**  
Theme variables are special CSS variables defined using the `@theme` directive that determine which utility classes exist in your project:

```css
@import "tailwindcss";
@theme {
  /* Custom color */
  --color-mint-500: oklch(0.72 0.11 178);
  /* Custom spacing */
  --spacing-xs: 0.5rem;
  /* Custom font family */
  --font-family-sans: "Inter Variable", sans-serif;
}
```

This enables utility classes like `bg-mint-500`, `text-mint-500`, or `fill-mint-500`.  
Spacing utilities like `p-xs`, `m-xs`, or `gap-xs`.  
Font utilities `font-sans`.  

For theme variables that reference other variables, use the inline option:

```css
@theme inline {
  --font-sans: var(--font-inter);
  --font-trebuchetMs: "Trebuchet MS";
}
```

**10 Custom Base Styles in Tailwind**  
To add your own default base styles for specific HTML elements, use the `@layer` directive:

```css
@layer base {
  h1 {
    font-size: var(--text-2xl);
  }
  code {
    font-family: monospace;
    background: #e0e0e0;
    padding: 0.2em 0.4em;
    border-radius: 4px;
  }
}
```

**11 Sonner Toast Library - Dynamic Updates**  
The [Sonner toast library](https://sonner.emilkowal.ski/other) lets you create and update toast notifications dynamically using unique IDs. In the example, a loading toast (`toast.loading`) is shown while an action is in progress. Later, the same toast is updated to either a success (`toast.success`) or error (`toast.error`) state by passing the original `toastId`. This approach ensures a smooth transition instead of creating multiple toasts. It's especially useful for async operations, providing a clean way to show progress and results without cluttering the UI.

```javascript
const toastId = toast.loading("Adding todo...");
// Later update the same toast
toast.success("Todo added successfully!", { id: toastId });
// Or on error
toast.error("Failed to add todo. Please try again.", { id: toastId });
```

This pattern is ideal for async operations, providing clean progress feedback without UI clutter.

### Continued development

- More projects; increased competence!

### Useful resources

Stackoverflow  
YouTube  
Google  
ChatGPT

## Author

- Website - [Zeeofor Technologies](https://zeeofortech.vercel.app/)
- Twitter - [@trae_z](https://twitter.com/trae_z)

## Acknowledgments

-Jehovah that keeps breath in my lungs
