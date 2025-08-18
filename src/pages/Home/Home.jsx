import { Link } from "react-router-dom";

import "./Home.css";

import Footer from "../../components/Footer/Footer";
import { useTheme } from "../../contexts/theme";

import dashboard_light from "../../assets/dashboard-light.png";
import dashboard_dark from "../../assets/dashboard-dark.png";
import {
  RiCodeSSlashLine,
  RiRocketLine,
  RiGlobalLine,
  RiArrowRightLine,
  RiPlayCircleLine,
  RiCheckboxCircleLine,
  RiDashboardLine,
  RiMessage2Line,
  RiArticleLine,
} from "@remixicon/react";

function Home() {
  const { theme } = useTheme();

  return (
    <div id="home" className={`home-${theme}`}>
      {/* Hero Section */}
      <div className="hero">
        <div className="hero-background">
          <div className="grid-overlay"></div>
        </div>

        <div className="hero-content">
          <div className="hero-badge">
            <span>✨ Your Content, Your Platform</span>
          </div>

          <h1>
            Build Faster <br />
            <span className="gradient-text">Ship Smarter</span>
          </h1>

          <p>
            Integrate powerful components into any website. Manage content from
            one dashboard.
            <br />
            No backend required. Just install and use.
          </p>

          <div className="hero-actions">
            <Link to={"/documentation"} className="cta-primary">
              Get Started Free
              <RiArrowRightLine size="1.2rem" />
            </Link>
            <button className="cta-secondary">
              <RiPlayCircleLine size="1.2rem" />
              Watch Demo
            </button>
          </div>

          <div className="hero-social-proof">
            <span>Because your content deserves your platform.</span>
          </div>
        </div>
      </div>

      <section className="dashboard-showcase">
        <div className="dashboard-hover">
          <div className="dashboard-mac-bar">
            <span className="mac-dot red"></span>
            <span className="mac-dot yellow"></span>
            <span className="mac-dot green"></span>
          </div>
          <img
            src={theme === "dark" ? dashboard_dark : dashboard_light}
            alt="Dashboard Preview"
            className="dashboard-img"
          />
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works">
        <div className="container">
          <div className="section-header">
            <h2>How It Works</h2>
            <p>Get up and running in minutes, not weeks</p>
          </div>

          <div className="steps-grid">
            <div className="step">
              <div className="step-number">1</div>
              <div className="step-content">
                <h3>Choose a Component</h3>
                <p>
                  Select from our library of pre-built components like blogs,
                  forms, galleries.
                </p>
              </div>
            </div>

            <div className="step">
              <div className="step-number">2</div>
              <div className="step-content">
                <h3>Install & Integrate</h3>
                <p>
                  Install from npm, then copy the code snippet and paste it into
                  your website.
                </p>
              </div>
            </div>

            <div className="step">
              <div className="step-number">3</div>
              <div className="step-content">
                <h3>Manage Content</h3>
                <p>
                  Use our powerful dashboard to add, edit, and manage all your
                  content in real-time.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <div className="section-header">
            <h2>Why Choose Our Platform?</h2>
            <p>Everything you need to build and manage dynamic websites</p>
          </div>

          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <RiCodeSSlashLine size="2rem" />
              </div>
              <h3>Zero Backend Setup</h3>
              <p>
                Just install our components and start managing content
                immediately. No servers, no databases.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <RiRocketLine size="2rem" />
              </div>
              <h3>Lightning Fast</h3>
              <p>
                Installing and adding components is a breeze, thanks to our
                Low-code approach.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <RiGlobalLine size="2rem" />
              </div>
              <h3>All in One</h3>
              <p>
                Not just blogs, not just messages - even testimonials are setup
                and managed in seconds.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Components Showcase */}
      {/* <section className="components-showcase">
        <div className="container">
          <div className="section-header">
            <h2>Available Components</h2>
            <p>Production-ready components for every use case</p>
          </div>

          <div className="components-grid">
            <div className="component-card">
              <div className="component-icon">
                <RiArticleLine size="2rem" />
              </div>
              <h3>Blog System</h3>
              <p>
                Complete blogging solution with categories, tags, and SEO
                optimization.
              </p>
              <div className="component-features">
                <span>
                  <RiCheckboxCircleLine size="1rem" /> Rich text editor
                </span>
                <span>
                  <RiCheckboxCircleLine size="1rem" /> SEO optimized
                </span>
                <span>
                  <RiCheckboxCircleLine size="1rem" /> Category management
                </span>
              </div>
            </div>

            <div className="component-card">
              <div className="component-icon">
                <RiMessage2Line size="2rem" />
              </div>
              <h3>Contact Forms</h3>
              <p>
                Customizable forms with validation, spam protection, and email
                notifications.
              </p>
              <div className="component-features">
                <span>
                  <RiCheckboxCircleLine size="1rem" /> Spam protection
                </span>
                <span>
                  <RiCheckboxCircleLine size="1rem" /> Email notifications
                </span>
                <span>
                  <RiCheckboxCircleLine size="1rem" /> Custom validation
                </span>
              </div>
            </div>

            <div className="component-card">
              <div className="component-icon">
                <RiDashboardLine size="2rem" />
              </div>
              <h3>Analytics Dashboard</h3>
              <p>
                Real-time insights into your content performance and user
                engagement.
              </p>
              <div className="component-features">
                <span>
                  <RiCheckboxCircleLine size="1rem" /> Real-time data
                </span>
                <span>
                  <RiCheckboxCircleLine size="1rem" /> Custom metrics
                </span>
                <span>
                  <RiCheckboxCircleLine size="1rem" /> Export reports
                </span>
              </div>
            </div>
          </div>

          <div className="cta-center">
            <Link to="/signup" className="cta-outline">
              View All Components
              <RiArrowRightLine size="1.2rem" />
            </Link>
          </div>
        </div>
      </section> */}

      {/* CTA Section */}
      {/* <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to Build Something Amazing?</h2>
            <p>
              Join thousands of developers who are building faster with our
              platform.
            </p>
            <div className="cta-actions">
              <Link to="/signup" className="cta-primary large">
                Start Building Now
                <RiArrowRightLine size="1.2rem" />
              </Link>
            </div>
          </div>
        </div>
      </section> */}

      <Footer />
    </div>
  );
}

export default Home;
