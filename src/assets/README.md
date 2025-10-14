# Irada Widgets

A modern, minimal React widget library for displaying blogs and content from the **Irada Content Management System**. Built with a shadcn-inspired design system that seamlessly integrates into any website architecture.

> **🚀 Powered by Irada CMS**: All content is managed through the [Irada Dashboard](https://irada.sohaibaftab.me) - create, edit, and manage your blogs with ease!

## ✨ Features

- 🎨 **Minimal Design**: Clean, outline-based design that adapts to any design language
- 🌙 **Dark/Light Themes**: Built-in theme support with CSS variables
- 🎯 **Fully Customizable**: Extensive CSS variables for complete design control
- 📱 **Responsive**: Optimized for all screen sizes and devices
- ⚡ **Lightweight**: Minimal dependencies, maximum performance
- 🔧 **Easy Integration**: Simple props-based configuration with Irada ecosystem
- 📊 **Rich Content Management**: Full blog lifecycle through Irada Dashboard
- 💬 **Real-time Messages**: Contact form submissions appear instantly in your dashboard
- 🎪 **Modular**: Use individual components or complete pages

## 📦 Installation

```bash
npm install irada-widgets
```

### Peer Dependencies

Ensure you have these installed in your project:

```bash
npm install react react-dom react-router-dom
```

## 🚀 Quick Start

### Basic Setup

```jsx
import React from "react";
import { BrowserRouter } from "react-router-dom";
import { IradaBlogsPage } from "irada-widgets";

function App() {
  return (
    <BrowserRouter>
      <IradaBlogsPage
        apiKey="your-api-key"
        theme="light"
        heading="Our Blog"
        subheading="Discover insights and stories"
      />
    </BrowserRouter>
  );
}

export default App;
```

**Important**: The `IradaBlogsPage` component requires React Router to be configured as it handles internal routing between blog list and individual blog posts. For setup details, refer to the [React Router documentation](https://reactrouter.com/en/main/start/tutorial).

## 📚 Components Overview

Irada Widgets provides five main components that can be used independently or together:

### 🏠 IradaBlogsPage

Complete blog listing page with advanced search, infinite scroll, and routing to individual blog posts

### 📖 IradaBlogReader

Individual blog post reader with automatic table of contents and similar blog recommendations

### 🎡 IradaBlogsCarousel

Featured blogs carousel that adapts to all screen sizes with auto-scroll and manual navigation

### 🃏 IradaBlogCard

Individual blog card component for custom layouts

### 📝 IradaContactForm

Customizable contact/message form with real-time dashboard integration

---

## 🧩 Component Documentation

### IradaBlogsPage

A comprehensive blog page component featuring:

- **🔍 Advanced Search**: Real-time blog search functionality
- **♾️ Infinite Scroll**: Seamless content loading as you scroll
- **📄 Smart Pagination**: Efficient content delivery
- **🎯 Category Filtering**: Filter blogs by categories and tags
- **📱 Responsive Design**: Perfect on all devices

All blog content is managed through your [Irada Dashboard](https://irada.sohaibaftab.me) where you can create, edit, publish, and organize your blogs.

**⚠️ Requires React Router**: This component uses internal routing and must be wrapped in a `BrowserRouter`.

#### Props

| Prop         | Type                | Default                            | Description        |
| ------------ | ------------------- | ---------------------------------- | ------------------ |
| `apiKey`     | `string`            | **Required**                       | Your Irada API key |
| `theme`      | `'light' \| 'dark'` | `'light'`                          | Theme mode         |
| `heading`    | `string`            | `'Discover Our Blog'`              | Main page heading  |
| `subheading` | `string`            | `'Explore insights, tutorials...'` | Page subtitle      |

#### Example

```jsx
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { IradaBlogsPage } from "irada-widgets";

function BlogSection() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/blogs/*"
          element={
            <IradaBlogsPage
              apiKey="your-irada-api-key"
              theme="dark"
              heading="Tech Insights"
              subheading="Latest developments in technology and innovation"
            />
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
```

### IradaBlogReader

Individual blog post reader component with enhanced features:

- **📋 Automatic Table of Contents**: Generated from blog headings with navigation
- **🔗 Similar Blog Recommendations**: Automatically suggests related content
- **📱 Responsive Reading**: Optimized typography for all devices
- **🔙 Navigation Support**: Built-in back navigation and sharing

**⚠️ Important**: If you're using `IradaBlogsCarousel` without `IradaBlogsPage`, you'll need to handle blog reading routes manually since blog reading is only handled by `IradaBlogsPage`.

#### Props

| Prop     | Type                | Default      | Description          |
| -------- | ------------------- | ------------ | -------------------- |
| `apiKey` | `string`            | **Required** | Your Irada API key   |
| `theme`  | `'light' \| 'dark'` | `'light'`    | Theme mode           |
| `slug`   | `string`            | **Required** | Blog slug to display |

#### Example

```jsx
import { IradaBlogReader } from "irada-widgets";
import { useParams } from "react-router-dom";

function BlogPost() {
  const { slug } = useParams();

  return (
    <IradaBlogReader apiKey="your-irada-api-key" theme="light" slug={slug} />
  );
}
```

### IradaBlogsCarousel

An interactive carousel showcasing featured blog posts that perfectly adapts to all screen sizes with auto-scroll functionality.

#### Props

| Prop     | Type                | Default      | Description        |
| -------- | ------------------- | ------------ | ------------------ |
| `apiKey` | `string`            | **Required** | Your Irada API key |
| `theme`  | `'light' \| 'dark'` | `'light'`    | Theme mode         |

#### Example

```jsx
import { IradaBlogsCarousel } from "irada-widgets";

function FeaturedSection() {
  return (
    <section className="featured-blogs">
      <h2>Featured Articles</h2>
      <IradaBlogsCarousel apiKey="your-irada-api-key" theme="light" />
    </section>
  );
}
```

### IradaBlogCard

Individual blog card component for building custom layouts and grids.

#### Props

| Prop    | Type                | Default      | Description      |
| ------- | ------------------- | ------------ | ---------------- |
| `blog`  | `BlogObject`        | **Required** | Blog data object |
| `theme` | `'light' \| 'dark'` | `'light'`    | Theme mode       |

#### Blog Object Structure

```typescript
interface BlogObject {
  _id: string;
  title: string;
  meta: string;
  slug: string;
  banner: string;
  category: string;
  tags: string[];
  likesCount?: number;
  viewsCount?: number;
  publishedAt: string;
  author: {
    username: string;
    profileImageUrl?: string;
  };
}
```

#### Example

```jsx
import { IradaBlogCard } from "irada-widgets";

function CustomBlogGrid({ blogs }) {
  return (
    <div className="custom-blog-grid">
      {blogs.map((blog) => (
        <IradaBlogCard key={blog._id} blog={blog} theme="light" />
      ))}
    </div>
  );
}
```

### IradaContactForm

A customizable contact form widget with real-time dashboard integration.

> **💬 Real-time Dashboard**: All messages submitted through this form appear instantly in your [Irada Dashboard](https://irada.sohaibaftab.me) for immediate response and management.

#### Props

| Prop                 | Type                | Default                  | Description               |
| -------------------- | ------------------- | ------------------------ | ------------------------- |
| `apiKey`             | `string`            | **Required**             | Your Irada API key        |
| `theme`              | `'light' \| 'dark'` | `'light'`                | Theme mode                |
| `heading`            | `string`            | `'Get in Touch'`         | Form heading              |
| `subheading`         | `string`            | `'Send us a message...'` | Form subtitle             |
| `placeholderName`    | `string`            | `'Your name'`            | Name field placeholder    |
| `placeholderEmail`   | `string`            | `'Your email'`           | Email field placeholder   |
| `placeholderMessage` | `string`            | `'Your message...'`      | Message field placeholder |
| `buttonText`         | `string`            | `'Send Message'`         | Submit button text        |
| `onSuccess`          | `function`          | `undefined`              | Success callback          |
| `onError`            | `function`          | `undefined`              | Error callback            |

#### Example

```jsx
import { IradaContactForm } from "irada-widgets";

function ContactPage() {
  const handleSuccess = (response) => {
    console.log("Message sent successfully:", response);
    // Show success notification
  };

  const handleError = (error) => {
    console.error("Failed to send message:", error);
    // Show error notification
  };

  return (
    <div className="contact-page">
      <IradaContactForm
        apiKey="your-irada-api-key"
        theme="light"
        heading="Contact Our Team"
        subheading="We'd love to hear from you. Send us a message and we'll respond as soon as possible."
        buttonText="Send Message"
        onSuccess={handleSuccess}
        onError={handleError}
      />
    </div>
  );
}
```

---

## 🎨 Styling & Customization

### CSS Import

The widgets come with built-in styles that are automatically included. However, you can manually import the CSS for better control:

```jsx
// Option 1: Automatic (recommended)
import { IradaBlogsPage } from "irada-widgets";
// Styles are automatically included

// Option 2: Manual import (if needed)
import { IradaBlogsPage } from "irada-widgets";
import "irada-widgets/dist/App.css";
```

### Theme Configuration

Apply themes using the `theme` prop or by setting the `data-theme` attribute:

```jsx
// Using theme prop
<IradaBlogsPage theme="dark" />

// Using CSS class (for manual control)
<div className="irada-widget" data-theme="dark">
  <IradaBlogsPage />
</div>
```

### CSS Variables System

Irada Widgets uses a comprehensive CSS variables system for customization. All variables are scoped under the `.irada-widget` class.

#### 🎨 Color Variables

```css
.irada-widget {
  /* Primary Colors */
  --irada-primary: #000000;
  --irada-secondary: #6b7280;
  --irada-accent: #000000;
  --irada-accent-foreground: #ffffff;

  /* Background Colors */
  --irada-background: #ffffff;
  --irada-background-secondary: #f9fafb;
  --irada-bg-primary: #ffffff;

  /* Text Colors */
  --irada-text: #000000;
  --irada-text-secondary: #6b7280;
  --irada-text-primary: #000000;

  /* Border Colors */
  --irada-border: #e5e7eb;
  --irada-border-hover: #d1d5db;
  --irada-border-color: #e5e7eb;

  /* Status Colors */
  --irada-error: #ef4444;
  --irada-error-alpha: rgba(239, 68, 68, 0.1);
  --irada-primary-alpha: rgba(0, 0, 0, 0.1);
  --irada-primary-hover: #1a1a1a;
}
```

#### 📐 Spacing Variables

```css
.irada-widget {
  --irada-spacing-xs: 0.5rem; /* 8px */
  --irada-spacing-sm: 0.75rem; /* 12px */
  --irada-spacing: 1rem; /* 16px */
  --irada-spacing-lg: 1.5rem; /* 24px */
  --irada-spacing-xl: 2rem; /* 32px */
}
```

#### 🔄 Border Radius Variables

```css
.irada-widget {
  --irada-radius: 6px;
  --irada-radius-md: 6px;
  --irada-radius-lg: 8px;
  --irada-radius-xl: 12px;
}
```

#### 📝 Typography Variables

```css
.irada-widget {
  /* Font Families */
  --irada-font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI",
    Roboto, sans-serif;
  --irada-font-family-display: "Bricolage Grotesque", system-ui, sans-serif;

  /* Font Sizes */
  --irada-font-size-sm: 0.875rem; /* 14px */
  --irada-font-size: 1rem; /* 16px */
  --irada-font-size-lg: 1.125rem; /* 18px */
  --irada-font-size-xl: 1.25rem; /* 20px */
  --irada-font-size-2xl: 1.5rem; /* 24px */
  --irada-font-size-3xl: 1.875rem; /* 30px */
}
```

#### 🎭 Shadow & Effects Variables

```css
.irada-widget {
  --irada-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
  --irada-shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --irada-shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  --irada-shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  --irada-transition: all 0.2s ease-in-out;
}
```

### 🌈 Custom Theme Examples

#### Modern Dark Theme

```css
.irada-widget[data-theme="dark"] {
  --irada-primary: #ffffff;
  --irada-background: #0a0a0a;
  --irada-background-secondary: #1a1a1a;
  --irada-text: #ffffff;
  --irada-text-secondary: #9ca3af;
  --irada-border: #2a2a2a;
  --irada-border-hover: #404040;
}
```

#### Brand Color Theme

```css
.irada-widget.brand-theme {
  --irada-primary: #3b82f6;
  --irada-accent: #ef4444;
  --irada-background: #f8fafc;
  --irada-background-secondary: #ffffff;
  --irada-border: #e2e8f0;
  --irada-border-hover: #cbd5e1;
}
```

#### Minimal Grayscale Theme

```css
.irada-widget.minimal-theme {
  --irada-primary: #374151;
  --irada-secondary: #6b7280;
  --irada-background: #ffffff;
  --irada-background-secondary: #f9fafb;
  --irada-text: #111827;
  --irada-text-secondary: #6b7280;
  --irada-border: #e5e7eb;
  --irada-radius: 4px;
}
```

### 🎯 Advanced Customization

#### Component-Specific Styling

Target specific components with CSS:

```css
/* Blog Card Customization */
.irada-widget .recommended-blog {
  border-radius: 12px;
  transition: transform 0.3s ease;
}

.irada-widget .recommended-blog:hover {
  transform: scale(1.02);
}

/* Carousel Customization */
.irada-widget .featured-blog-slide {
  border-radius: 16px;
}

/* Contact Form Customization */
.irada-widget .message-form-container {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}
```

#### Typography Customization

```css
.irada-widget {
  /* Custom font integration */
  --irada-font-family: "Inter", system-ui, sans-serif;
  --irada-font-family-display: "Playfair Display", serif;
}

/* Load custom fonts */
@import url("https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Playfair+Display:wght@400;600;700&display=swap");
```

#### Responsive Customization

```css
.irada-widget {
  --irada-max-width: 1200px;
}

/* Mobile adjustments */
@media (max-width: 768px) {
  .irada-widget {
    --irada-spacing: 0.75rem;
    --irada-spacing-lg: 1rem;
    --irada-spacing-xl: 1.5rem;
  }
}
```

---

## 🌐 Irada Ecosystem Integration

Irada Widgets are designed exclusively for the Irada Content Management System. All you need is your Irada API key to get started.

### Getting Your API Key

1. Visit the [Irada Dashboard](https://irada.sohaibaftab.me)
2. Sign up or log in to your account
3. Navigate to Settings → API Keys
4. Generate your API key for your widgets

### Content Management

- **📝 Blog Management**: Create, edit, and publish blogs directly from your dashboard
- **💬 Message Inbox**: View and respond to contact form messages in real-time
- **📊 Analytics**: Track blog views, engagement, and contact form submissions
- **🎯 Content Organization**: Organize blogs with categories, tags, and featured status

---

## 💡 Usage Examples

### Complete Blog Website

```jsx
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import {
  IradaBlogsPage,
  IradaBlogReader,
  IradaBlogsCarousel,
  IradaContactForm,
} from "irada-widgets";

function App() {
  const apiConfig = {
    apiKey: "your-irada-api-key",
    theme: "light",
  };

  return (
    <BrowserRouter>
      <div className="app">
        {/* Navigation */}
        <nav className="navbar">
          <a href="/">Home</a>
          <a href="/blogs">Blog</a>
          <a href="/contact">Contact</a>
        </nav>

        <Routes>
          {/* Homepage with featured carousel */}
          <Route
            path="/"
            element={
              <div>
                <section className="hero">
                  <h1>Welcome to Our Blog</h1>
                  <IradaBlogsCarousel {...apiConfig} />
                </section>
              </div>
            }
          />

          {/* Blog section with routing */}
          <Route
            path="/blogs/*"
            element={
              <IradaBlogsPage
                {...apiConfig}
                heading="Our Blog"
                subheading="Insights, tutorials, and stories from our team"
              />
            }
          />

          {/* Standalone blog reader route (if using carousel without full blogs page) */}
          <Route
            path="/article/:slug"
            element={<IradaBlogReader {...apiConfig} />}
          />

          {/* Contact page */}
          <Route
            path="/contact"
            element={
              <IradaContactForm
                {...apiConfig}
                heading="Get in Touch"
                subheading="We'd love to hear from you"
              />
            }
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
```

### Custom Blog Layout with IradaBlogCard

```jsx
import React, { useState, useEffect } from "react";
import { IradaBlogCard } from "irada-widgets";

function CustomBlogGrid() {
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    // Fetch blogs from the Irada API using your key
    // This would typically be handled by the Irada widgets internally
    fetchBlogsFromIrada().then(setBlogs);
  }, []);

  return (
    <div className="custom-blog-layout">
      <div className="blog-grid">
        {blogs.map((blog) => (
          <IradaBlogCard key={blog._id} blog={blog} theme="light" />
        ))}
      </div>
    </div>
  );
}
```

### Themed Components

```jsx
import React, { useState } from "react";
import { IradaBlogsCarousel, IradaContactForm } from "irada-widgets";

function ThemedPage() {
  const [theme, setTheme] = useState("light");

  return (
    <div className={`page ${theme}`}>
      <button onClick={() => setTheme(theme === "light" ? "dark" : "light")}>
        Toggle Theme
      </button>

      <IradaBlogsCarousel apiKey="your-irada-api-key" theme={theme} />

      <IradaContactForm
        apiKey="your-irada-api-key"
        theme={theme}
        heading="Contact Us"
      />
    </div>
  );
}
```

### Using Carousel with Manual Blog Reader Routing

If you're using `IradaBlogsCarousel` without `IradaBlogsPage`, you'll need to handle blog reading routes manually:

```jsx
import React from "react";
import { BrowserRouter, Routes, Route, useParams } from "react-router-dom";
import { IradaBlogsCarousel, IradaBlogReader } from "irada-widgets";

function BlogReaderPage() {
  const { slug } = useParams();

  return (
    <IradaBlogReader apiKey="your-irada-api-key" theme="light" slug={slug} />
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <div>
              <h1>Featured Articles</h1>
              <IradaBlogsCarousel apiKey="your-irada-api-key" theme="light" />
            </div>
          }
        />
        <Route path="/blog/:slug" element={<BlogReaderPage />} />
      </Routes>
    </BrowserRouter>
  );
}
```

---

## 🛠️ Development & Contributing

### Local Development Setup

```bash
# Clone the repository
git clone https://github.com/HattySohaib/irada-widgetsUi.git
cd irada-widgets

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

### Project Structure

```
irada-widgets/
├── src/
│   ├── BlogCard/          # Individual blog card component
│   ├── BlogReader/        # Blog post reader component
│   ├── BlogsPage/         # Main blogs listing page
│   ├── FeaturedBlogs/     # Featured blogs carousel
│   ├── MessageForm/       # Contact form component
│   ├── Loaders/          # Loading components
│   ├── App.css           # Main styles with CSS variables
│   └── index.js          # Main export file
├── demo/                 # Demo and examples
├── dist/                 # Built files (generated)
├── package.json
├── webpack.config.js
└── README.md
```

### Build Process

The library uses Webpack to build UMD modules that work in various environments:

```javascript
// webpack.config.js
module.exports = {
  entry: "./src/index.js",
  mode: "production",
  output: {
    libraryTarget: "umd", // Universal Module Definition
  },
  externals: {
    react: "react",
    "react-dom": "react-dom",
    "react-router-dom": "react-router-dom",
  },
};
```

---

## 🔧 Troubleshooting

### Common Issues

#### 1. Router Issues

**Problem**: `IradaBlogsPage` not working or showing blank page.

**Solution**: Ensure your app is wrapped with `BrowserRouter`:

```jsx
import { BrowserRouter } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <IradaBlogsPage apiKey="your-key" />
    </BrowserRouter>
  );
}
```

#### 2. Styles Not Loading

**Problem**: Components appear unstyled.

**Solution**: Styles are automatically imported, but if needed:

```jsx
// Explicit import
import "irada-widgets/dist/App.css";
```

#### 3. API Connection Issues

**Problem**: "API key is required" or no data loading.

**Solutions**:

- Verify your API key is correct
- Check API endpoint URL
- Ensure your API returns data in the expected format
- Check browser console for network errors

```jsx
// Debug API issues
<IradaBlogsPage
  apiKey="your-key"
  apiEndpoint="https://your-api.com"
  onError={(error) => console.error("API Error:", error)}
/>
```

#### 4. Theme Not Applying

**Problem**: Dark/light theme not working.

**Solution**: Ensure theme prop is passed and CSS variables are not overridden:

```jsx
// Correct theme usage
<IradaBlogsPage theme="dark" />

// Or manual control
<div data-theme="dark">
  <IradaBlogsPage />
</div>
```

#### 5. TypeScript Issues

**Problem**: TypeScript errors when using the components.

**Solution**: The library includes basic TypeScript support. For custom types:

```typescript
// Create custom type definitions if needed
declare module "irada-widgets" {
  export interface BlogObject {
    _id: string;
    title: string;
    meta: string;
    slug: string;
    // ... other properties
  }

  export const IradaBlogsPage: React.FC<{
    apiKey: string;
    theme?: "light" | "dark";
    apiEndpoint?: string;
    heading?: string;
    subheading?: string;
  }>;
}
```

### Performance Optimization

#### Lazy Loading

```jsx
import { lazy, Suspense } from "react";

const IradaBlogsPage = lazy(() =>
  import("irada-widgets").then((module) => ({
    default: module.IradaBlogsPage,
  }))
);

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <IradaBlogsPage apiKey="your-key" />
    </Suspense>
  );
}
```

#### CSS Optimization

```css
/* Reduce initial CSS load by overriding only needed variables */
.irada-widget {
  --irada-primary: #your-brand-color;
  --irada-font-family: "Your-Font", system-ui;
}
```

---

## 📱 Browser Support

| Browser | Version | Status          |
| ------- | ------- | --------------- |
| Chrome  | 88+     | ✅ Full Support |
| Firefox | 85+     | ✅ Full Support |
| Safari  | 14+     | ✅ Full Support |
| Edge    | 88+     | ✅ Full Support |
| Opera   | 74+     | ✅ Full Support |

### Feature Support

- ✅ CSS Grid & Flexbox
- ✅ CSS Custom Properties (Variables)
- ✅ ES6+ JavaScript Features
- ✅ Responsive Design
- ✅ Touch Events (Mobile)
- ✅ Keyboard Navigation

---

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

---

## 🤝 Support & Community

### Getting Help

- 📖 **Documentation**: This README and inline code comments
- 🐛 **Bug Reports**: [GitHub Issues](https://github.com/HattySohaib/irada-widgetsUi/issues)
- 💡 **Feature Requests**: [GitHub Issues](https://github.com/HattySohaib/irada-widgetsUi/issues)
- 📧 **Email Support**: [Contact the maintainers](mailto:sohaib@yourdomain.com)

### Contributing

We welcome contributions! Please see our contributing guidelines:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

### Changelog

#### Version 0.8.0

- ✨ Added comprehensive CSS variables system
- 🐛 Fixed routing issues in `IradaBlogsPage`
- 🎨 Improved dark theme support
- 📱 Enhanced mobile responsiveness
- 🔧 Better TypeScript support

---

## 🎯 Roadmap

### Upcoming Features

- [ ] **More Components**: Newsletter signup, social sharing widgets
- [ ] **Enhanced Theming**: More built-in themes and theme builder
- [ ] **Analytics Integration**: Built-in analytics tracking
- [ ] **SEO Optimization**: Better meta tags and structured data
- [ ] **Accessibility**: Enhanced ARIA support and keyboard navigation
- [ ] **Performance**: Code splitting and tree shaking improvements

---

<div align="center">

**Made with ❤️ by [Sohaib Aftab](https://github.com/HattySohaib)**

[🌟 Star this repo](https://github.com/HattySohaib/irada-widgetsUi) | [🐛 Report Bug](https://github.com/HattySohaib/irada-widgetsUi/issues) | [💡 Request Feature](https://github.com/HattySohaib/irada-widgetsUi/issues)

</div>
