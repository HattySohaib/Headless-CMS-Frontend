import React from "react";
import "./Footer.css";
import { useTheme } from "../../contexts/theme";
import { Link } from "react-router-dom";
import {
  RiGithubFill,
  RiLinkedinBoxFill,
  RiTwitterXFill,
  RiMailLine,
  RiArrowUpLine,
} from "@remixicon/react";

function Footer() {
  const { theme } = useTheme();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className={`footer footer-${theme}`}>
      <div className="footer-container">
        {/* Main Footer Content */}
        <div className="footer-content">
          {/* Brand Section */}
          <div className="footer-section brand-section">
            <h3 className="footer-brand">Irada</h3>
            <p className="footer-tagline">
              Powerful embeddable widgets for modern web applications. Build
              faster with our plug-and-play components.
            </p>
            <div className="social-links">
              <a
                href="https://github.com/HattySohaib"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
              >
                <RiGithubFill size={20} />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
              >
                <RiLinkedinBoxFill size={20} />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Twitter"
              >
                <RiTwitterXFill size={20} />
              </a>
              <a href="mailto:contact@bloggest.com" aria-label="Email">
                <RiMailLine size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer-section">
            <h4 className="footer-heading">Platform</h4>
            <ul className="footer-links">
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <Link to="/blogs">Blogs</Link>
              </li>
              <li>
                <Link to="/trending">Trending</Link>
              </li>
              <li>
                <Link to="/categories">Categories</Link>
              </li>
              <li>
                <Link to="/about">About</Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div className="footer-section">
            <h4 className="footer-heading">Resources</h4>
            <ul className="footer-links">
              <li>
                <Link to="/documentation">Documentation</Link>
              </li>
              <li>
                <Link to="/playground">Component Playground</Link>
              </li>
              <li>
                <a
                  href="https://www.npmjs.com/package/irada-widgets"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  NPM Package
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/HattySohaib/irada-widgets"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  GitHub
                </a>
              </li>
            </ul>
          </div>

          {/* Legal & Support */}
          <div className="footer-section">
            <h4 className="footer-heading">Legal & Support</h4>
            <ul className="footer-links">
              <li>
                <Link to="/privacy">Privacy Policy</Link>
              </li>
              <li>
                <Link to="/terms">Terms of Service</Link>
              </li>
              <li>
                <Link to="/messages">Contact Us</Link>
              </li>
              <li>
                <a href="mailto:support@bloggest.com">Support</a>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="footer-bottom">
          <div className="footer-bottom-content">
            <p className="copyright">
              © {new Date().getFullYear()} Irada Widgets. All rights reserved.
            </p>
            <p className="developer-credit">
              Designed & Developed by{" "}
              <a
                href="https://github.com/HattySohaib"
                target="_blank"
                rel="noopener noreferrer"
              >
                Sohaib Aftab
              </a>
            </p>
          </div>
          <button
            className="scroll-to-top"
            onClick={scrollToTop}
            aria-label="Scroll to top"
          >
            <RiArrowUpLine size={20} />
          </button>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
