// React header component mounted via ESM imports (no bundler required)
import React, { useEffect, useState } from "https://esm.sh/react@18";
import { createRoot } from "https://esm.sh/react-dom@18/client";
import htm from "https://esm.sh/htm@3.1.1";

const html = htm.bind(React.createElement);

function Header() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth > 800) setIsOpen(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return html`
    <header class="site-header react-header">
      <div class="container">
        <a class="brand" href="index.html">
          <img src="./logo.png" alt="Goat Tracking" class="brand-logo" />
        </a>
        <button
          class="nav-toggle"
          aria-controls="primary-nav"
          aria-expanded=${String(isOpen)}
          aria-label="Toggle navigation"
          onClick=${() => setIsOpen(!isOpen)}
        >
          <span class="nav-toggle-bar" aria-hidden="true"></span>
          <span class="nav-toggle-bar" aria-hidden="true"></span>
          <span class="nav-toggle-bar" aria-hidden="true"></span>
        </button>
        <nav id="primary-nav" class=${"primary-nav" + (isOpen ? " open" : "") } aria-label="Primary">
          <ul>
            <li><a href="index.html">Home</a></li>
            <li><a href="https://testyourpixel.goattracking.com" target="_blank" rel="noopener">Pixel Tester</a></li>
            <li><a href="pricing.html">Pricing</a></li>
          </ul>
        </nav>
        <div class="header-actions">
          <a class="login-link" href="https://app.goattracking.com/sign-in">Login</a>
          <a class="button primary small" href="schedule.html">DEMO</a>
        </div>
      </div>
    </header>
  `;
}

function mountHeader() {
  const container = document.getElementById("site-header-root");
  if (!container) return;
  const root = createRoot(container);
  root.render(html`<${Header} />`);
}

// Auto-mount on load
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", mountHeader);
} else {
  mountHeader();
}


