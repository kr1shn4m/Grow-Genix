
# 🚀 Grow Genix - Official Website Architecture

> **The Agency for the AI Era.**  
> *Where Creativity Meets Code.*

---

## 📖 Overview

This repository contains the source code for the official **Grow Genix** corporate website. It is designed as a high-performance, static web application hosted on **GitHub Pages**.

The architecture focuses on **speed, aesthetics, and conversion**. We utilize a modern "Vanillajs" approach to ensure maximum compatibility and zero build-step complexity, while leveraging powerful libraries like **Three.js** for immersive visual experiences.

---

## 🏢 About Grow Genix

Grow Genix is a Tech-First AI Marketing Ecosystem based in Prayagraj, India. We bridge the gap between creative storytelling and hard-core automation.

*   **Core Focus:** AI Chatbots, Workflow Automation, Performance Marketing.
*   **Target Audience:** Coaches, Consultants, and High-Ticket Service Providers.
*   **Mission:** To democratize enterprise-level growth strategies for ambitious brands.

---

## 🛠️ Technical Stack

We believe in keeping the stack lightweight yet powerful.

| Component | Technology | Purpose |
|-----------|------------|---------|
| **Core** | HTML5, CSS3, ES6+ JavaScript | Structure, Styling, & Logic |
| **Visuals** | **Three.js** | 3D Particle Background System |
| **Animations**| **AOS (Animate On Scroll)** | Scroll-triggered fade/slide effects |
| **Icons** | **Lucide Icons** | Lightweight, consistent SVG iconography |
| **Typography**| **Outfit** (Google Fonts) | Modern, geometric sans-serif typeface |
| **Forms** | **Web3Forms API** | Serverless form handling & email delivery |
| **Utils** | **intl-tel-input** | International telephone input & validation |

---

## 📂 Project Structure

```bash
Grow-Genix/
│
├── index.html          # Landing Page (Home)
├── about/              # About Us Page
├── services/           # Services Overview
├── solutions/          # AI & Automation Solutions
├── pricing/            # Pricing & Packages
├── contact/            # Contact Page & Forms
├── legal/              # Privacy Policy & Terms (mapped routes)
│
├── css/
│   └── style.css       # Global Stylesheet (Variables, Light/Dark Mode)
│
├── js/
│   ├── main.js         # Core logic (Cursor, Preloader, UI events)
│   ├── three-bg.js     # Three.js particle system configuration
│   ├── form-handler.js # Form validation & API submission logic
│   └── component-loader.js # Dynamic Header/Footer injection
│
└── assets/             # Static assets (Favicons, OG Images)
```

---

## ⚙️ Configuration & Setup

### 1. Form Handling (Web3Forms)
This project uses **Web3Forms** to handle contact form submissions without a backend server.

> **⚠️ Security Note:** The Access Key has been sanitized from this public documentation.
> If you are a developer for Grow Genix, please contact the administrator to get the environment keys or check the internal `.env` documentation.

To configure the form locally:
1.  Open `js/form-handler.js`.
2.  Locate the `FORM_CONFIG` object.
3.  Replace `YOUR_ACCESS_KEY_HERE` with your valid Web3Forms Access Key.

```javascript
const FORM_CONFIG = {
    web3formsKey: 'YOUR_ACCESS_KEY_HERE', // Request this from Admin
    // ...
};
```

### 2. Branding & Customization
*   **Colors:** All theme colors are defined as CSS Variables in `css/style.css` under `:root`.
*   **Images:** Replace assets in the `/assets` folder ensuring filenames match.

---

## 🚀 Deployment Strategy

This project is optimized for **GitHub Pages**.

1.  **Push to Repository:** Ensure all file paths are relative (e.g., `../css/style.css`).
2.  **Settings:** Go to GitHub Repo > Settings > Pages.
3.  **Source:** Select `main` branch and `/ (root)` folder.
4.  **Custom Domain:** (Optional) Map `growgenix.tech` in the DNS settings.

---

## 🔒 Security & Privacy

*   **No Personal Data Storage:** The website does not store user data in cookies or local databases.
*   **HTTPS:** Enforced via GitHub Pages.
*   **Spam Protection:** Integrated Honeypot fields (`botcheck`) in forms to prevent spam submissions.

---

## © License & Rights

**Copyright © 2025 Grow Genix.**  
All rights reserved. The design, branding assets, and custom code architecture are proprietary to Grow Genix.

*   **Developed by:** Grow Genix Tech Team
*   **Contact:** growgenixmarketing@gmail.com

---
*Documentation maintained by Grow Genix Engineering.*
