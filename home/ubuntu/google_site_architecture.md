# Google Site Embeddable Architecture for ADHD Productivity App

## Overview

This document outlines the architecture for our ADHD productivity app with JRPG-style UI that will be embeddable in Google Sites. Based on our research, we'll use Svelte to create web components that can be easily embedded and will function without requiring user accounts.

## Architecture Components

### 1. Core Web Component Structure

We'll create a custom web component using Svelte that can be embedded in Google Sites through the HTML embed feature. The architecture will consist of:

- **Main Container Component**: A single entry point that loads all sub-components
- **Modular Sub-Components**: Separate components for different features (task management, time tracking, etc.)
- **Local Storage Interface**: A service layer for data persistence without requiring accounts
- **JRPG UI Theme Layer**: Styling and animation components for the JRPG aesthetic

### 2. Build and Deployment Process

1. **Svelte Component Development**: Create standard Svelte components
2. **Web Component Compilation**: Use a custom build process to compile Svelte components as web components
3. **Bundle Creation**: Generate a single JavaScript bundle that can be loaded via CDN
4. **Static Asset Hosting**: Host assets (images, fonts, etc.) on a CDN for fast loading

### 3. Embedding Approach

Based on our research of Google Sites limitations and best practices, we'll use the following approach:

```html
<!-- In Google Sites HTML Embed -->
<script src="https://cdn.example.com/adhd-productivity-app.js"></script>
<adhd-productivity-app></adhd-productivity-app>
```

This approach allows us to:
- Load our web component bundle from a CDN
- Initialize the app with a simple custom HTML tag
- Avoid iframe limitations in Google Sites
- Maintain a clean separation between the app and the hosting site

### 4. Data Storage Strategy

Since we can't rely on server-side storage (no accounts), we'll implement:

- **LocalStorage API**: For persistent data storage between sessions
- **IndexedDB**: For larger data sets if needed
- **Export/Import Functionality**: Allow users to backup and restore their data
- **Optional Cloud Sync**: Provide instructions for users who want to set up their own cloud storage

### 5. Technical Considerations for Google Sites

1. **Content Security Policy (CSP)**: Google Sites has strict CSP rules. Our app will:
   - Avoid inline scripts
   - Load all resources from trusted CDNs
   - Use proper CORS headers for all resources

2. **Size Optimization**: Google Sites has performance limitations, so we'll:
   - Minimize bundle size through code splitting
   - Lazy load features when possible
   - Optimize all assets for web delivery

3. **Responsive Design**: The app will adapt to different embed sizes:
   - Responsive layout that works in various container widths
   - Collapsible UI elements for smaller viewports
   - Mobile-friendly touch targets

4. **Shadow DOM Isolation**: Use Shadow DOM to:
   - Isolate our CSS from the Google Site
   - Prevent our styles from affecting the parent site
   - Maintain consistent JRPG styling regardless of the parent site's theme

## Implementation Approach

### Phase 1: Core Component Structure

1. Create the base Svelte application
2. Set up the build process for web component compilation
3. Implement the main container component with Shadow DOM
4. Test basic embedding in Google Sites

### Phase 2: Feature Implementation

1. Implement task management features with JRPG UI
2. Add time tracking and visualization components
3. Create local storage service layer
4. Implement data import/export functionality

### Phase 3: Optimization and Finalization

1. Optimize bundle size and loading performance
2. Enhance responsive design for various embed sizes
3. Add final JRPG styling and animations
4. Create comprehensive embedding documentation

## Technical Stack

- **Framework**: Svelte
- **Build Tools**: Rollup with custom plugins for web component compilation
- **Storage**: LocalStorage and IndexedDB
- **Styling**: CSS with Shadow DOM encapsulation
- **Hosting**: GitHub Pages for the demo and documentation
- **CDN**: Cloudflare or similar for production deployment

## Embedding Instructions Preview

The final product will include detailed instructions for embedding in Google Sites:

1. In Google Sites, add an "Embed" element
2. Choose "Embed code"
3. Paste the provided HTML snippet
4. Adjust the size settings as needed
5. Save and publish the site

## Conclusion

This architecture leverages Svelte's lightweight nature and web component capabilities to create an embeddable ADHD productivity app with JRPG-style UI that works within Google Sites' constraints. By using local storage and avoiding server dependencies, we ensure the app can be used without accounts while still providing a rich, interactive experience.
