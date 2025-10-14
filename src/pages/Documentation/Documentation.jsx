import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { useTheme } from "../../contexts/theme";
import "./Documentation.css";
import {
  RiCodeSSlashLine,
  RiRocketLine,
  RiPaletteLine,
  RiSettings3Line,
  RiBookLine,
  RiServerLine,
  RiDashboardLine,
  RiMessage2Line,
  RiArticleLine,
  RiLayoutLine,
  RiFileTextLine,
  RiContactsBookLine,
  RiArrowRightLine,
  RiCheckboxCircleLine,
  RiLightbulbLine,
  RiGithubLine,
  RiMailLine,
  RiStarLine,
  RiBugLine,
  RiMenuLine,
  RiCloseLine,
  RiFileCopyLine,
  RiCheckLine,
  RiSearchLine,
  RiFilter3Line,
  RiEyeLine,
  RiSmartphoneLine,
  RiPlayLine,
  RiDragMove2Line,
  RiTimeLine,
  RiSettings4Line,
  RiNotification3Line,
  RiInputMethodLine,
  RiPhoneLine,
  RiMailSendLine,
  RiPlug2Line,
  RiDatabaseLine,
  RiFeedbackFill,
  RiPaintBrushLine,
  RiFlightTakeoffLine,
} from "@remixicon/react";

function Documentation() {
  const { theme } = useTheme();
  const [activeSection, setActiveSection] = useState("overview");
  const [activeSubsection, setActiveSubsection] = useState("introduction");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [copiedCode, setCopiedCode] = useState(null);

  // Copy to clipboard function
  const copyToClipboard = async (text, id) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedCode(id);
      setTimeout(() => setCopiedCode(null), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  // Flat navigation structure - No nesting
  const navigationStructure = [
    { id: "overview", label: "Overview", icon: RiBookLine },
    { id: "quickstart", label: "Quick Start", icon: RiRocketLine },
    { id: "blogs-page", label: "IradaBlogsPage", icon: RiArticleLine },
    {
      id: "blogs-carousel",
      label: "FeaturedBlogsCarousel",
      icon: RiLayoutLine,
    },
    { id: "message-form", label: "MessageForm", icon: RiContactsBookLine },
    { id: "blog-card", label: "IradaBlogCard", icon: RiFileTextLine },
    { id: "styling", label: "Styling", icon: RiPaletteLine },
    { id: "dashboard", label: "Dashboard Integration", icon: RiDashboardLine },
    { id: "troubleshooting", label: "Troubleshooting", icon: RiSettings3Line },
    { id: "support", label: "Support", icon: RiMessage2Line },
  ];

  // Component props data
  const componentProps = {
    IradaBlogsPage: [
      {
        name: "apiKey",
        type: "string",
        required: true,
        description: "Your Irada API key (required)",
        default: "-",
      },
      {
        name: "theme",
        type: "'light' | 'dark'",
        required: false,
        description: "Visual theme for the component",
        default: "'light'",
      },
      {
        name: "heading",
        type: "string",
        required: false,
        description: "Page heading",
        default: "'Discover Our Blog'",
      },
      {
        name: "subheading",
        type: "string",
        required: false,
        description: "Page subtitle",
        default:
          "'Explore insights, tutorials, and stories from our community'",
      },
    ],
    FeaturedBlogsCarousel: [
      {
        name: "apiKey",
        type: "string",
        required: true,
        description: "Your Irada API key (required)",
        default: "-",
      },
      {
        name: "theme",
        type: "'light' | 'dark'",
        required: false,
        description: "Visual theme for the component",
        default: "'light'",
      },
    ],
    MessageForm: [
      {
        name: "apiKey",
        type: "string",
        required: true,
        description: "Your Irada API key (required)",
        default: "-",
      },
      {
        name: "theme",
        type: "'light' | 'dark'",
        required: false,
        description: "Visual theme for the component",
        default: "'light'",
      },
      {
        name: "heading",
        type: "string",
        required: false,
        description: "Form title",
        default: "'Get in Touch'",
      },
      {
        name: "subheading",
        type: "string",
        required: false,
        description: "Form subtitle",
        default:
          "'Send us a message and we'll get back to you as soon as possible.'",
      },
      {
        name: "placeholderName",
        type: "string",
        required: false,
        description: "Name input placeholder",
        default: "'Your name'",
      },
      {
        name: "placeholderEmail",
        type: "string",
        required: false,
        description: "Email input placeholder",
        default: "'Your email'",
      },
      {
        name: "placeholderMessage",
        type: "string",
        required: false,
        description: "Message textarea placeholder",
        default: "'Your message…'",
      },
      {
        name: "buttonText",
        type: "string",
        required: false,
        description: "Submit button text",
        default: "'Send Message'",
      },
      {
        name: "onSuccess",
        type: "(result) => void",
        required: false,
        description: "Called with server response after submit",
        default: "undefined",
      },
      {
        name: "onError",
        type: "(errorMsg) => void",
        required: false,
        description: "Called on validation or network error",
        default: "undefined",
      },
    ],
    IradaBlogCard: [
      {
        name: "blog",
        type: "IradaBlog",
        required: true,
        description: "The blog data object (required)",
        default: "-",
      },
      {
        name: "theme",
        type: "'light' | 'dark'",
        required: false,
        description: "Visual theme for the component",
        default: "'light'",
      },
    ],
  };

  const components = [
    {
      name: "IradaBlogsPage",
      icon: RiArticleLine,
      description: "Complete blog listing page with built-in reader routing",
      features: [
        "Advanced Search",
        "Category Filtering",
        "Built-in Reader",
        "Responsive Design",
      ],
    },
    {
      name: "FeaturedBlogsCarousel",
      icon: RiLayoutLine,
      description: "Interactive carousel showcasing featured blog posts",
      features: [
        "Auto-scroll",
        "Touch Navigation",
        "Responsive Design",
        "Minimal Config",
      ],
    },
    {
      name: "MessageForm",
      icon: RiContactsBookLine,
      description:
        "Customizable contact form with real-time dashboard integration",
      features: [
        "Real-time Dashboard",
        "Custom Placeholders",
        "Success/Error Callbacks",
        "Easy Integration",
      ],
    },
    {
      name: "IradaBlogCard",
      icon: RiArticleLine,
      description: "Individual blog card component for custom layouts",
      features: [
        "Blog Object Based",
        "Lightweight",
        "Responsive",
        "Theme Support",
      ],
    },
  ];

  // Feature icons mapping
  const featureIcons = {
    "Advanced Search": RiSearchLine,
    "Category Filtering": RiFilter3Line,
    "Built-in Reader": RiEyeLine,
    "Responsive Design": RiSmartphoneLine,
    "Auto-scroll": RiPlayLine,
    "Touch Navigation": RiDragMove2Line,
    "Minimal Config": RiSettings4Line,
    "Real-time Dashboard": RiNotification3Line,
    "Custom Placeholders": RiInputMethodLine,
    "Success/Error Callbacks": RiPhoneLine,
    "Easy Integration": RiPlug2Line,
    "Blog Object Based": RiDatabaseLine,
    Lightweight: RiFlightTakeoffLine,
    "Theme Support": RiPaintBrushLine,
  };

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      // Calculate offset to account for fixed header/navbar
      const offsetTop = element.offsetTop - 80; // Adjust this value as needed
      window.scrollTo({
        top: offsetTop,
        behavior: "smooth",
      });

      // Update active states
      setActiveSection(sectionId);
      setActiveSubsection(sectionId);

      // If it's a subsection, update the parent section as well
      const section = navigationStructure.find((s) =>
        s.subsections?.some((sub) => sub.id === sectionId)
      );
      if (section) {
        setActiveSection(section.id);
        setActiveSubsection(sectionId);
      }
    }
    setMobileMenuOpen(false);
  };

  // Improved scroll tracking
  const handleScroll = useCallback(() => {
    const scrollPosition = window.scrollY + 100; // Add offset to account for header
    // Get all sections
    const sections = navigationStructure
      .flatMap((section) => [
        { id: section.id, element: document.getElementById(section.id) },
        ...(section.subsections?.map((sub) => ({
          id: sub.id,
          element: document.getElementById(sub.id),
          parentId: section.id,
        })) || []),
      ])
      .filter((item) => item.element);

    // Find the current section based on scroll position
    let currentSection = null;
    let currentSubsection = null;

    for (let i = sections.length - 1; i >= 0; i--) {
      const section = sections[i];
      if (section.element.offsetTop <= scrollPosition) {
        if (section.parentId) {
          currentSection = section.parentId;
          currentSubsection = section.id;
        } else {
          currentSection = section.id;
          // Find first subsection of this section
          const firstSubsection = navigationStructure.find(
            (s) => s.id === section.id
          )?.subsections?.[0];
          currentSubsection = firstSubsection?.id || section.id;
        }
        break;
      }
    }

    if (currentSection && currentSection !== activeSection) {
      setActiveSection(currentSection);
    }

    if (currentSubsection && currentSubsection !== activeSubsection) {
      setActiveSubsection(currentSubsection);
    }
  }, [activeSection, activeSubsection]); // Removed navigationStructure from deps

  // Add scroll listener
  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    // Initial check
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [handleScroll]);

  const isSubsectionActive = (subsectionId) => {
    return activeSubsection === subsectionId;
  };

  // Helper function to render feature pill with icon
  const FeaturePill = ({ feature }) => {
    const IconComponent = featureIcons[feature];
    return (
      <span className="feature-pill">
        {IconComponent && <IconComponent size="0.875rem" />}
        {feature}
      </span>
    );
  };

  // CodeBlock component with copy functionality (no syntax highlighting for now)
  const CodeBlock = ({ children, id, language = "bash" }) => {
    const codeText = children;
    const isCodeCopied = copiedCode === id;

    return (
      <div className="code-block">
        <div className="code-header">
          <span className="code-language">{language}</span>
          <button
            className="copy-button"
            onClick={() => copyToClipboard(codeText, id)}
            title={isCodeCopied ? "Copied!" : "Copy to clipboard"}
          >
            {isCodeCopied ? (
              <RiCheckLine size="1rem" />
            ) : (
              <RiFileCopyLine size="1rem" />
            )}
            {isCodeCopied ? "Copied!" : "Copy"}
          </button>
        </div>
        <pre>
          <code>{codeText}</code>
        </pre>
      </div>
    );
  };

  return (
    <div className={`documentation-page documentation-${theme}`}>
      {/* Navigation Sidebar */}
      <nav className={`doc-sidebar ${mobileMenuOpen ? "mobile-open" : ""}`}>
        <div className="sidebar-header">
          <h2>Documentation</h2>
          <button
            className="mobile-close-btn"
            onClick={() => setMobileMenuOpen(false)}
          >
            <RiCloseLine size="1.5rem" />
          </button>
        </div>

        <ul className="nav-list">
          {navigationStructure.map((item) => {
            const IconComponent = item.icon;
            const isActive = activeSection === item.id;

            return (
              <li key={item.id} className="nav-item">
                <button
                  className={`nav-button ${isActive ? "active" : ""}`}
                  onClick={() => scrollToSection(item.id)}
                >
                  <IconComponent size="1.2rem" />
                  <span>{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>

        <div className="sidebar-footer">
          <a
            href="https://github.com/HattySohaib/irada-widgetsUi"
            target="_blank"
            rel="noopener noreferrer"
            className="footer-link"
          >
            <RiGithubLine size="1rem" />
            GitHub
          </a>
          <a href="mailto:sohaib@yourdomain.com" className="footer-link">
            <RiMailLine size="1rem" />
            Support
          </a>
        </div>
      </nav>

      {/* Mobile Menu Button */}
      <button
        className="mobile-menu-btn"
        onClick={() => setMobileMenuOpen(true)}
      >
        <RiMenuLine size="1.5rem" />
        Menu
      </button>

      {/* Main Content */}
      <main className="doc-content">
        {/* Overview Section */}
        <section id="overview" className="doc-section">
          <h2>Overview</h2>

          <div id="introduction">
            <h3>Introduction</h3>
            <p>
              Irada Widgets is a production-ready React widget library designed
              exclusively for the Irada Content Management System. Built with a
              shadcn-inspired design system, these widgets seamlessly integrate
              into any website architecture while providing powerful content
              management capabilities.
            </p>
          </div>

          <div id="features">
            <h3>Features</h3>
            <div className="features-grid">
              <div className="feature-item">
                <RiPaletteLine size="2rem" className="feature-icon" />
                <h3>Minimal Design</h3>
                <p>
                  Clean, outline-based design that adapts to any design language
                </p>
              </div>
              <div className="feature-item">
                <RiSettings3Line size="2rem" className="feature-icon" />
                <h3>Fully Customizable</h3>
                <p>Extensive CSS variables for complete design control</p>
              </div>
              <div className="feature-item">
                <RiRocketLine size="2rem" className="feature-icon" />
                <h3>Lightweight</h3>
                <p>Minimal dependencies, maximum performance</p>
              </div>
              <div className="feature-item">
                <RiCodeSSlashLine size="2rem" className="feature-icon" />
                <h3>Easy Integration</h3>
                <p>Simple props-based configuration with Irada ecosystem</p>
              </div>
            </div>
          </div>
        </section>

        {/* Quick Start Section */}
        <section id="quickstart" className="doc-section">
          <h2>Quick Start</h2>
          <p className="section-description">
            Get up and running with Irada Widgets in just a few minutes. Follow
            these simple steps to integrate beautiful, functional widgets into
            your React application.
          </p>

          <div className="quickstart-container">
            {/* Step 1: Installation */}
            <div id="setup" className="quickstart-step">
              <div className="step-header">
                <div className="step-indicator">
                  <span className="step-number">1</span>
                  <div className="step-line"></div>
                </div>
                <div className="step-title">
                  <p>Installation</p>
                  <p>Install the package and dependencies</p>
                </div>
              </div>
              <div className="step-body">
                <p>
                  Install Irada Widgets and its peer dependencies using npm or
                  yarn. The package is lightweight and optimized for production
                  use.
                </p>
                <CodeBlock id="quickstart-install" language="bash">
                  {`npm install irada-widgets
npm install react react-dom react-router-dom`}
                </CodeBlock>
                <div className="step-info">
                  <strong>Note:</strong> React Router is required for full
                  functionality of blog components.
                </div>
              </div>
            </div>

            {/* Step 2: API Key */}
            <div id="api-key" className="quickstart-step">
              <div className="step-header">
                <div className="step-indicator">
                  <span className="step-number">2</span>
                  <div className="step-line"></div>
                </div>
                <div className="step-title">
                  <p>Get Your API Key</p>
                  <p>Connect to the Irada dashboard</p>
                </div>
              </div>
              <div className="step-body">
                <p>
                  Visit the{" "}
                  <a
                    href="https://irada.sohaibaftab.me"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="external-link"
                  >
                    Irada Dashboard
                  </a>{" "}
                  to create your account and generate an API key.
                </p>
                <div className="sub-steps">
                  <div className="sub-step">
                    <span className="sub-step-number">1</span>
                    <span>Sign up or log in to your account</span>
                  </div>
                  <div className="sub-step">
                    <span className="sub-step-number">2</span>
                    <span>Navigate to Settings → API Keys</span>
                  </div>
                  <div className="sub-step">
                    <span className="sub-step-number">3</span>
                    <span>Generate a new API key for your widgets</span>
                  </div>
                  <div className="sub-step">
                    <span className="sub-step-number">4</span>
                    <span>Copy and securely store your API key</span>
                  </div>
                </div>
                <div className="step-info">
                  <strong>Security:</strong> Keep your API key secure and never
                  expose it in client-side code in production.
                </div>
              </div>
            </div>

            {/* Step 3: Basic Usage */}
            <div id="basic-usage" className="quickstart-step">
              <div className="step-header">
                <div className="step-indicator">
                  <span className="step-number">3</span>
                </div>
                <div className="step-title">
                  <p>Basic Usage</p>
                  <p>Set up your first widget</p>
                </div>
              </div>
              <div className="step-body">
                <p>
                  Start with the blog page component. Set up React Router and
                  add the IradaBlogsPage:
                </p>
                <CodeBlock id="basic-usage-code" language="jsx">
                  {`import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { IradaBlogsPage } from "irada-widgets";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        
        {/* Blog Routes - Must use /blogs/* pattern */}
        <Route
          path="/blogs/*"
          element={
            <IradaBlogsPage
              apiKey="your-demo-api-key"
              theme="light"
              heading="Our Blog"
            />
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

function HomePage() {
  return <h1>Welcome to our website</h1>;
}

export default App;`}
                </CodeBlock>
                <div className="step-info">
                  <strong>Critical:</strong> The IradaBlogsPage route MUST use
                  the pattern <code>/blogs/*</code>
                  for the internal blog reader routing to work correctly.
                </div>
              </div>
            </div>
          </div>

          {/* Success Message */}
          <div className="quickstart-success">
            <div className="success-icon">
              <RiCheckboxCircleLine size="2rem" />
            </div>
            <div className="success-content">
              <h3>🎉 You're all set!</h3>
              <p>
                Your Irada Widgets are now ready to use. The widgets will
                automatically sync with your dashboard content and provide a
                seamless user experience.
              </p>
              <div className="success-actions">
                <button
                  className="success-btn primary"
                  onClick={() => scrollToSection("components")}
                >
                  Explore Components
                </button>
                <a
                  href="https://irada.sohaibaftab.me"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="success-btn secondary"
                >
                  Open Dashboard
                </a>
              </div>
            </div>
          </div>

          {/* Important Notes */}
          <div className="quickstart-notes">
            <div className="note-item">
              <RiLightbulbLine size="1.25rem" className="note-icon" />
              <div>
                <strong>Router Requirement:</strong> IradaBlogsPage requires
                React Router for navigation between blog posts.
              </div>
            </div>
            <div className="note-item">
              <RiServerLine size="1.25rem" className="note-icon" />
              <div>
                <strong>Real-time Updates:</strong> Content changes in your
                dashboard are reflected immediately in your widgets.
              </div>
            </div>
            <div className="note-item">
              <RiSettings3Line size="1.25rem" className="note-icon" />
              <div>
                <strong>Customization:</strong> All widgets support extensive
                theming and CSS customization options.
              </div>
            </div>
          </div>
        </section>

        {/* IradaBlogsPage Component */}
        <section id="blogs-page" className="doc-section">
          <div className="component-header">
            <RiArticleLine size="2.5rem" className="component-icon" />
            <div className="component-info">
              <h2>IradaBlogsPage</h2>
              <p>Complete blog listing page with built-in reader routing</p>
              <div className="component-features">
                <FeaturePill feature="Advanced Search" />
                <FeaturePill feature="Category Filtering" />
                <FeaturePill feature="Built-in Reader" />
                <FeaturePill feature="Responsive Design" />
              </div>
            </div>
          </div>

          <div className="important-note">
            <RiLightbulbLine size="1.25rem" />
            <div>
              <strong>Routing Requirement:</strong> Must be set up with the
              route pattern <code>/blogs/*</code>
              to enable the built-in blog reader functionality.
            </div>
          </div>

          <h3>Usage Example</h3>
          <CodeBlock id="blogs-page-usage" language="jsx">
            {`import { IradaBlogsPage } from "irada-widgets";
import { Routes, Route } from "react-router-dom";

// Must use /blogs/* pattern for internal routing
<Route
  path="/blogs/*"
  element={
    <IradaBlogsPage
      apiKey="your-demo-api-key"
      theme="light"
      heading="Our Blog"
      subheading="Explore insights and stories"
    />
  }
/>`}
          </CodeBlock>

          <h3>Props</h3>
          <table className="props-table">
            <thead>
              <tr>
                <th>Prop</th>
                <th>Type</th>
                <th>Required</th>
                <th>Default</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              {componentProps.IradaBlogsPage.map((prop) => (
                <tr key={prop.name}>
                  <td className="prop-name">{prop.name}</td>
                  <td className="prop-type">{prop.type}</td>
                  <td>
                    {prop.required ? (
                      <span className="prop-required">Required</span>
                    ) : (
                      <span className="prop-optional">Optional</span>
                    )}
                  </td>
                  <td className="prop-default">
                    {prop.default !== "-" && prop.default !== "undefined" ? (
                      <code>{prop.default}</code>
                    ) : (
                      prop.default
                    )}
                  </td>
                  <td className="prop-description">{prop.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        {/* FeaturedBlogsCarousel Component */}
        <section id="blogs-carousel" className="doc-section">
          <div className="component-header">
            <RiLayoutLine size="2.5rem" className="component-icon" />
            <div className="component-info">
              <h2>FeaturedBlogsCarousel</h2>
              <p>Interactive carousel showcasing featured blog posts</p>
              <div className="component-features">
                <FeaturePill feature="Auto-scroll" />
                <FeaturePill feature="Touch Navigation" />
                <FeaturePill feature="Responsive Design" />
                <FeaturePill feature="Minimal Config" />
              </div>
            </div>
          </div>

          <h3>Usage Example</h3>
          <CodeBlock id="carousel-usage" language="jsx">
            {`import { FeaturedBlogsCarousel } from "irada-widgets";

function HomePage() {
  return (
    <section className="hero">
      <h1>Featured Posts</h1>
      <FeaturedBlogsCarousel
        apiKey="your-demo-api-key"
        theme="light"
      />
    </section>
  );
}`}
          </CodeBlock>

          <h3>Props</h3>
          <table className="props-table">
            <thead>
              <tr>
                <th>Prop</th>
                <th>Type</th>
                <th>Required</th>
                <th>Default</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              {componentProps.FeaturedBlogsCarousel.map((prop) => (
                <tr key={prop.name}>
                  <td className="prop-name">{prop.name}</td>
                  <td className="prop-type">{prop.type}</td>
                  <td>
                    {prop.required ? (
                      <span className="prop-required">Required</span>
                    ) : (
                      <span className="prop-optional">Optional</span>
                    )}
                  </td>
                  <td className="prop-default">
                    {prop.default !== "-" && prop.default !== "undefined" ? (
                      <code>{prop.default}</code>
                    ) : (
                      prop.default
                    )}
                  </td>
                  <td className="prop-description">{prop.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        {/* MessageForm Component */}
        <section id="message-form" className="doc-section">
          <div className="component-header">
            <RiContactsBookLine size="2.5rem" className="component-icon" />
            <div className="component-info">
              <h2>MessageForm</h2>
              <p>
                Customizable contact form with real-time dashboard integration
              </p>
              <div className="component-features">
                <FeaturePill feature="Real-time Dashboard" />
                <FeaturePill feature="Custom Placeholders" />
                <FeaturePill feature="Success/Error Callbacks" />
                <FeaturePill feature="Easy Integration" />
              </div>
            </div>
          </div>

          <h3>Usage Examples</h3>

          <h4>Basic Contact Form</h4>
          <CodeBlock id="message-form-basic" language="jsx">
            {`import { MessageForm } from "irada-widgets";

function ContactPage() {
  return (
    <div className="contact-page">
      <MessageForm
        apiKey="your-demo-api-key"
        theme="light"
        heading="Get in Touch"
        subheading="We'd love to hear from you"
        buttonText="Send Message"
        onSuccess={(result) => {
          console.log('Message sent!', result);
          alert('Thank you for your message!');
        }}
        onError={(error) => {
          console.error('Error:', error);
          alert('Failed to send message. Please try again.');
        }}
      />
    </div>
  );
}`}
          </CodeBlock>

          <h4>Embedded in Footer</h4>
          <CodeBlock id="message-form-footer" language="jsx">
            {`import { MessageForm } from "irada-widgets";

function Footer() {
  return (
    <footer className="site-footer">
      <div className="contact-section">
        <MessageForm
          apiKey="your-demo-api-key"
          theme="dark"
          heading="Quick Message"
          placeholderName="Your name"
          placeholderEmail="your.email@example.com"
          placeholderMessage="What's on your mind?"
          buttonText="Send"
        />
      </div>
    </footer>
  );
}`}
          </CodeBlock>

          <h3>Props</h3>
          <table className="props-table">
            <thead>
              <tr>
                <th>Prop</th>
                <th>Type</th>
                <th>Required</th>
                <th>Default</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              {componentProps.MessageForm.map((prop) => (
                <tr key={prop.name}>
                  <td className="prop-name">{prop.name}</td>
                  <td className="prop-type">{prop.type}</td>
                  <td>
                    {prop.required ? (
                      <span className="prop-required">Required</span>
                    ) : (
                      <span className="prop-optional">Optional</span>
                    )}
                  </td>
                  <td className="prop-default">
                    {prop.default !== "-" && prop.default !== "undefined" ? (
                      <code>{prop.default}</code>
                    ) : (
                      prop.default
                    )}
                  </td>
                  <td className="prop-description">{prop.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        {/* IradaBlogCard Component */}
        <section id="blog-card" className="doc-section">
          <div className="component-header">
            <RiFileTextLine size="2.5rem" className="component-icon" />
            <div className="component-info">
              <h2>IradaBlogCard</h2>
              <p>Individual blog card component for custom layouts</p>
              <div className="component-features">
                <FeaturePill feature="Blog Object Based" />
                <FeaturePill feature="Lightweight" />
                <FeaturePill feature="Responsive" />
                <FeaturePill feature="Theme Support" />
              </div>
            </div>
          </div>

          <h3>Usage Example</h3>
          <CodeBlock id="blog-card-usage" language="jsx">
            {`import { IradaBlogCard } from "irada-widgets";

function CustomBlogGrid({ blogs }) {
  return (
    <div className="blog-grid">
      {blogs.map((blog) => (
        <IradaBlogCard
          key={blog._id}
          blog={blog}
          theme="light"
        />
      ))}
    </div>
  );
}

// Example blog object
const exampleBlog = {
  _id: "64f7b8c9e123456789abcdef",
  slug: "my-awesome-blog-post",
  banner: "https://example.com/banner.jpg",
  title: "My Awesome Blog Post",
  meta: "A short description of the blog post content...",
  category: "Technology",
  tags: ["React", "JavaScript", "Web Development"],
  viewsCount: 150,
  publishedAt: "2024-01-15T10:00:00Z"
};`}
          </CodeBlock>

          <h3>Blog Interface</h3>
          <CodeBlock id="blog-interface" language="typescript">
            {`interface IradaBlog {
  _id: string               // Unique blog ID
  slug: string              // URL slug (used for routing)
  banner: string            // Cover image URL
  title: string             // Blog title
  meta: string              // Short description / excerpt
  category: string          // Category name
  tags: string[]            // Array of tag strings
  viewsCount?: number       // (optional) number of views
  likesCount?: number       // (optional) number of likes
  publishedAt?: string      // (optional) ISO date string when first published
  updatedAt?: string        // (optional) ISO date string when last updated
}`}
          </CodeBlock>

          <h3>Props</h3>
          <table className="props-table">
            <thead>
              <tr>
                <th>Prop</th>
                <th>Type</th>
                <th>Required</th>
                <th>Default</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              {componentProps.IradaBlogCard.map((prop) => (
                <tr key={prop.name}>
                  <td className="prop-name">{prop.name}</td>
                  <td className="prop-type">{prop.type}</td>
                  <td>
                    {prop.required ? (
                      <span className="prop-required">Required</span>
                    ) : (
                      <span className="prop-optional">Optional</span>
                    )}
                  </td>
                  <td className="prop-default">
                    {prop.default !== "-" && prop.default !== "undefined" ? (
                      <code>{prop.default}</code>
                    ) : (
                      prop.default
                    )}
                  </td>
                  <td className="prop-description">{prop.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
        <section id="styling" className="doc-section">
          <h2>Styling & Customization</h2>

          <div id="css-variables">
            <h3>CSS Variables System</h3>
            <p>
              Irada Widgets uses a comprehensive CSS variables system for
              customization. All variables are scoped under the{" "}
              <code>.irada-widget</code> class.
            </p>
          </div>

          <div id="themes" className="styling-categories">
            <div className="styling-category">
              <h4>Color Variables</h4>
              <div className="code-block">
                <pre>
                  <code>{`.irada-widget {
  /* Primary Colors */
  --irada-primary: #000000;
  --irada-secondary: #6b7280;
  --irada-accent: #000000;
  
  /* Background Colors */
  --irada-background: #ffffff;
  --irada-background-secondary: #f9fafb;
  
  /* Text Colors */
  --irada-text: #000000;
  --irada-text-secondary: #6b7280;
  
  /* Border Colors */
  --irada-border: #e5e7eb;
  --irada-border-hover: #d1d5db;
}`}</code>
                </pre>
              </div>
            </div>

            <div id="customization" className="styling-category">
              <h4>Custom Theme Example</h4>
              <div className="code-block">
                <pre>
                  <code>{`.irada-widget.brand-theme {
  --irada-primary: #3b82f6;
  --irada-accent: #ef4444;
  --irada-background: #f8fafc;
  --irada-background-secondary: #ffffff;
  --irada-border: #e2e8f0;
  --irada-border-hover: #cbd5e1;
}`}</code>
                </pre>
              </div>
            </div>
          </div>

          <h3>Theme Configuration</h3>
          <div className="code-block">
            <pre>
              <code>{`// Using theme prop
<IradaBlogsPage theme="dark" />

// Using CSS class for manual control
<div className="irada-widget" data-theme="dark">
  <IradaBlogsPage />
</div>`}</code>
            </pre>
          </div>
        </section>

        {/* Dashboard Integration Section */}
        <section id="dashboard" className="doc-section">
          <h2>Dashboard Integration</h2>

          <div id="capabilities" className="dashboard-info">
            <div className="dashboard-feature">
              <RiDashboardLine size="2.5rem" className="dashboard-icon" />
              <div>
                <h3>Seamless Content Management</h3>
                <p>
                  All widget content is managed through the powerful Irada
                  Dashboard, providing a unified experience for content creators
                  and developers.
                </p>
              </div>
            </div>

            <div className="dashboard-capabilities">
              <h3>Dashboard Capabilities</h3>
              <div className="capabilities-grid">
                <div className="capability">
                  <RiArticleLine size="1.5rem" />
                  <h4>Blog Management</h4>
                  <p>
                    Create, edit, and publish blogs with rich text editor, SEO
                    optimization, and category management
                  </p>
                </div>
                <div className="capability">
                  <RiMessage2Line size="1.5rem" />
                  <h4>Message Inbox</h4>
                  <p>
                    View and respond to contact form messages in real-time with
                    organized conversation threads
                  </p>
                </div>
                <div className="capability">
                  <RiServerLine size="1.5rem" />
                  <h4>API Management</h4>
                  <p>
                    Generate and manage API keys, monitor usage, and configure
                    widget permissions
                  </p>
                </div>
                <div className="capability">
                  <RiSettings3Line size="1.5rem" />
                  <h4>Analytics & Insights</h4>
                  <p>
                    Track blog views, engagement metrics, and contact form
                    submissions with detailed analytics
                  </p>
                </div>
              </div>
            </div>

            <div id="performance" className="ecosystem-performance">
              <h3>Ecosystem Performance</h3>
              <div className="performance-metrics">
                <div className="metric">
                  <div className="metric-value">⚡ &lt;100ms</div>
                  <div className="metric-label">API Response Time</div>
                </div>
                <div className="metric">
                  <div className="metric-value">📱 100%</div>
                  <div className="metric-label">Mobile Responsive</div>
                </div>
                <div className="metric">
                  <div className="metric-value">🎯 99.9%</div>
                  <div className="metric-label">Uptime</div>
                </div>
                <div className="metric">
                  <div className="metric-value">🔒 SSL</div>
                  <div className="metric-label">Secure Connection</div>
                </div>
              </div>
            </div>

            <div id="workflow" className="dashboard-workflow">
              <h3>Typical Workflow</h3>
              <div className="workflow-steps">
                <div className="workflow-step">
                  <span className="workflow-number">1</span>
                  <div>
                    <h4>Content Creation</h4>
                    <p>
                      Use the Irada Dashboard to create and manage your blog
                      posts, configure contact forms, and organize content
                    </p>
                  </div>
                </div>
                <div className="workflow-step">
                  <span className="workflow-number">2</span>
                  <div>
                    <h4>Widget Integration</h4>
                    <p>
                      Install Irada Widgets in your React application and
                      configure with your API key
                    </p>
                  </div>
                </div>
                <div className="workflow-step">
                  <span className="workflow-number">3</span>
                  <div>
                    <h4>Real-time Sync</h4>
                    <p>
                      Your widgets automatically reflect changes made in the
                      dashboard without requiring deployment
                    </p>
                  </div>
                </div>
                <div className="workflow-step">
                  <span className="workflow-number">4</span>
                  <div>
                    <h4>Monitor & Analyze</h4>
                    <p>
                      Track performance, engagement, and user interactions
                      through the dashboard analytics
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Troubleshooting Section */}
        <section id="troubleshooting" className="doc-section">
          <h2>Troubleshooting</h2>

          <div className="troubleshooting-list">
            <div id="router-issues" className="troubleshoot-item">
              <h3>Router Issues</h3>
              <p>
                <strong>Problem:</strong> IradaBlogsPage not working or showing
                blank page.
              </p>
              <p>
                <strong>Solution:</strong> Ensure your app is wrapped with
                BrowserRouter:
              </p>
              <div className="code-block">
                <pre>
                  <code>{`import { BrowserRouter } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <IradaBlogsPage apiKey="your-key" />
    </BrowserRouter>
  );
}`}</code>
                </pre>
              </div>
            </div>

            <div id="styling-issues" className="troubleshoot-item">
              <h3>Styles Not Loading</h3>
              <p>
                <strong>Problem:</strong> Components appear unstyled.
              </p>
              <p>
                <strong>Solution:</strong> Styles are automatically imported,
                but if needed:
              </p>
              <div className="code-block">
                <pre>
                  <code>{`// Explicit import
import "irada-widgets/dist/App.css";`}</code>
                </pre>
              </div>
            </div>

            <div id="api-issues" className="troubleshoot-item">
              <h3>API Connection Issues</h3>
              <p>
                <strong>Problem:</strong> "API key is required" or no data
                loading.
              </p>
              <p>
                <strong>Solutions:</strong>
              </p>
              <ul>
                <li>Verify your API key is correct</li>
                <li>Check API endpoint URL</li>
                <li>Ensure your API returns data in the expected format</li>
                <li>Check browser console for network errors</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Support Section */}
        <section id="support" className="doc-section">
          <h2>Support & Community</h2>

          <div id="documentation" className="support-options">
            <div className="support-option">
              <RiBookLine size="2rem" className="support-icon" />
              <h3>Documentation</h3>
              <p>Comprehensive guides and API reference</p>
              <a href="#overview" className="support-link">
                Browse Docs <RiArrowRightLine size="1rem" />
              </a>
            </div>

            <div className="support-option">
              <RiBugLine size="2rem" className="support-icon" />
              <h3>Bug Reports</h3>
              <p>Report issues and track their progress</p>
              <a
                href="https://github.com/HattySohaib/irada-widgetsUi/issues"
                target="_blank"
                rel="noopener noreferrer"
                className="support-link"
              >
                GitHub Issues <RiArrowRightLine size="1rem" />
              </a>
            </div>

            <div className="support-option">
              <RiLightbulbLine size="2rem" className="support-icon" />
              <h3>Feature Requests</h3>
              <p>Suggest new features and enhancements</p>
              <a
                href="https://github.com/HattySohaib/irada-widgetsUi/issues"
                target="_blank"
                rel="noopener noreferrer"
                className="support-link"
              >
                Request Feature <RiArrowRightLine size="1rem" />
              </a>
            </div>

            <div className="support-option">
              <RiMailLine size="2rem" className="support-icon" />
              <h3>Email Support</h3>
              <p>Direct support from the maintainers</p>
              <a href="mailto:sohaib@yourdomain.com" className="support-link">
                Contact Us <RiArrowRightLine size="1rem" />
              </a>
            </div>
          </div>

          <div id="community" className="community-section">
            <h3>Contributing</h3>
            <p>We welcome contributions! Here's how you can help:</p>
            <ol>
              <li>Fork the repository</li>
              <li>Create a feature branch</li>
              <li>Make your changes</li>
              <li>Add tests if applicable</li>
              <li>Submit a pull request</li>
            </ol>

            <div id="contributing" className="community-links">
              <a
                href="https://github.com/HattySohaib/irada-widgetsUi"
                target="_blank"
                rel="noopener noreferrer"
                className="community-link"
              >
                <RiStarLine size="1.2rem" />
                Star on GitHub
              </a>
              <a
                href="https://github.com/HattySohaib/irada-widgetsUi/issues"
                target="_blank"
                rel="noopener noreferrer"
                className="community-link"
              >
                <RiBugLine size="1.2rem" />
                Report Issue
              </a>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="doc-footer">
          <div className="footer-content">
            <p>
              Made with ❤️ by{" "}
              <a
                href="https://github.com/HattySohaib"
                target="_blank"
                rel="noopener noreferrer"
              >
                Sohaib Aftab
              </a>
            </p>
            <div className="footer-links">
              <a
                href="https://github.com/HattySohaib/irada-widgetsUi"
                target="_blank"
                rel="noopener noreferrer"
              >
                GitHub
              </a>
              <a href="mailto:sohaib@yourdomain.com">Support</a>
              <Link to="/dashboard">Dashboard</Link>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}

export default Documentation;
