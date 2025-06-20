# Beginners Google Gemini Ai Course

AI Integration Sandbox App using Google Gemini.

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

This hobby app was built to explore and demonstrate the capabilities of Google Gemini's AI in a real-world context. The goal was to integrate Gemini for multiple core features: generating rich, context-aware text responses; enabling interactive chat sessions with an LLM; and visualizing token usage in real time. The app is structured to simulate a basic AI assistant workflow, showing how LLMs can be embedded into web apps for content generation, conversation, and cost-awareness via token tracking.  

As a user, I want to:  

- Chat with a Gemini-powered assistant in a fluid, session-based way.
- Generate text content on demand from prompts I provide.
- See how many tokens each interaction uses, so I can better understand and manage usage costs.
This app serves both as a playground for testing Gemini and a template for building more advanced AI-driven tools.

### Screenshot

![](/public/screenshot-desktop.png)

### Links

- Solution URL: [https://github.com/traez/beginners-google-gemini-ai-course](https://github.com/traez/beginners-google-gemini-ai-course)
- Live Site URL: [https://beginners-google-gemini-ai-course.vercel.app/](https://beginners-google-gemini-ai-course.vercel.app/)

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
- nextjs-toploader
- zustand  
- @google/genai  
- dotenv  
- drizzle-orm  
- postgres  
- react-markdown  
- uuid  

### What I learned

**1 API Key Security Best Practices**  
**Never expose API keys in frontend code**, even with environment variable prefixes like `VITE_` or `NEXT_PUBLIC_`. These variables get bundled into your frontend build and are visible in browser DevTools.

**✅ Secure Approach:**

- Route all API requests through your backend server (e.g., `/api/generate-content`)
- Store API keys as server-side environment variables
- Frontend never directly accesses or sends the API key


**❌ Insecure Approach:**

```javascript
// DON'T DO THIS - Exposes key in frontend bundle
const apiKey = process.env.VITE_GEMINI_API_KEY
```

**✅ Secure Implementation:**

```javascript
// Frontend makes request to your API endpoint
const response = await fetch('/api/generate-content', {
  method: 'POST',
  body: JSON.stringify({ prompt: userInput })
})

// Backend handles the actual API call with secure key
```   

**2 Tailwind Responsive Image Pattern**  
For responsive images with fixed aspect ratios, use this Tailwind pattern:

```javascriptreact
<div className="relative w-full max-w-[370px] aspect-[740/987] mt-4">
  <Image
    src="/gemini.jpg"
    alt="gemini"
    fill
    sizes="(min-width: 360px) 100vw"
    className="object-contain rounded-lg"
  />
</div>
```

**Key Components:**

- `relative` - Required for `fill` positioning
- `aspect-[width/height]` - Maintains consistent aspect ratio
- `fill` - Makes image fill the container
- `sizes` - Optimizes image loading for different screen sizes
- `object-contain` - Prevents image distortion   

**3 Essential Resources**  
### Pricing & Documentation

- [Vertex AI Pricing](https://cloud.google.com/vertex-ai/generative-ai/pricing) - Cost calculator for AI models
- [Gemini 2.0 Flash Documentation](https://cloud.google.com/vertex-ai/generative-ai/docs/models/gemini/2-0-flash#2.0-flash)
- [Content Generation API](https://ai.google.dev/api/generate-content) - General FAQ

### Google Cloud Console

- [API Credentials](https://console.cloud.google.com/apis/credentials) - Manage API keys
- [Project Dashboard](https://console.cloud.google.com/home/dashboard) - Project overview

### Official Tutorials (Current as of June 2025)

- [Gemini API Libraries](https://ai.google.dev/gemini-api/docs/libraries) - SDK options
- [Quickstart Guide](https://ai.google.dev/gemini-api/docs/quickstart) - Getting started
- [Migration Guide](https://ai.google.dev/gemini-api/docs/migrate) - Upgrade to Google Gen AI SDK
- [Text Generation](https://ai.google.dev/gemini-api/docs/text-generation) - Implementation guide  

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
