# 🎬 CipherNone: Interactive Lab Walkthrough

Welcome to the visual demonstration of the **CipherNone AppSec Laboratory**. This interactive walkthrough showcases the core features, security scenarios, and modern UI/UX elements of the project.

> [!TIP]
> Use the carousel below to navigate through each step of the security journey.

````carousel
![Dashboard Landing](file:///d:/Downloads/ciphernone/GuvenliWebYazilimiGelistirme-CipherNone-/demo/screenshots/step0_landing.png)
### 01. The Cybersecurity Dashboard
A futuristic, glassmorphism-based interface with real-time terminal logging (CipherNone CLI Log) and multi-server status monitoring.

<!-- slide -->
![Secure Login (RS256)](file:///d:/Downloads/ciphernone/GuvenliWebYazilimiGelistirme-CipherNone-/demo/screenshots/step1_secure_login.png)
### 02. Hardened Authentication (RS256)
Demonstrating the secure login flow. The system utilizes asymmetric RS256 signatures, ensuring the highest level of JWT integrity.

<!-- slide -->
![Defense in Action (403)](file:///d:/Downloads/ciphernone/GuvenliWebYazilimiGelistirme-CipherNone-/demo/screenshots/step2_secure_block.png)
### 03. Successful Attack Mitigation
When an exploit attempt (like `alg:none`) is detected, the hardened API immediately blocks the request with a `403 Forbidden` response and logs the event in the terminal.

<!-- slide -->
![Dynamic Theme: Light Mode](file:///d:/Downloads/ciphernone/GuvenliWebYazilimiGelistirme-CipherNone-/demo/screenshots/step3_light_mode.png)
### 04. Premium Aesthetics (Light Mode)
Switching between 'Gece Modu' and 'Gündüz Modu' is seamless, maintaining accessible neon accents and sleek typography in both themes.

<!-- slide -->
![Responsive Optimization](file:///d:/Downloads/ciphernone/GuvenliWebYazilimiGelistirme-CipherNone-/demo/screenshots/step4_mobile.png)
### 05. Adaptive Mobile View
The dashboard features a fully responsive grid system, adapting its layout and sidebar to ensure a premium experience on mobile and tablet devices.

<!-- slide -->
![Project Overview](file:///d:/Downloads/ciphernone/GuvenliWebYazilimiGelistirme-CipherNone-/demo/screenshots/step5_overview.png)
### 06. Educational Laboratory Context
Each lab section provides detailed context on discovery, exploitation, and hardening, making it an ideal tool for AppSec training.
````

## 🚀 Key Demonstration Points:
-   **JWT Integrity**: Visualizing how different signing algorithms (HS256 vs RS256) impact security.
-   **Real-time Monitoring**: Every HTTP/HTTPS request and server-side logic is streamed to the dashboard's terminal.
-   **Modern Stack**: Built with vanilla HTML/CSS/JS for high performance and no runtime dependencies.

---
[⬅️ Back to README](../README.md)
